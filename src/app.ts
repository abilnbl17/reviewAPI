// to configure express config
import express, {
  Express,
  NextFunction,
  json,
  urlencoded,
  Request,
  Response,
} from "express";
import cors from "cors";
import { SampleRouter } from "./routers/sample.router";
import { AuthRouter } from "./routers/auth.router";
import { redisClient } from "./helpers/redis";
import { PostRouter } from "./routers/posts.router";

const PORT = 7070;

export default class App {
  readonly app: Express;

  constructor() {
    this.app = express();
    this.configure(); //execute config methode
    this.routes();
    this.handleError();
  }

  // void karna kita pakai typescript fungsi yang tidak menghasilkan return, karna kita tidak menuliskan return didalam configure
  private configure(): void {
    this.app.use(cors()); // to give access for FE
    this.app.use(json()); // to read req.body
    this.app.use(urlencoded({ extended: true })); // to accept req.body form type
  }
  // to define routes config from routers directory
  private routes(): void {
    const sampleRouter = new SampleRouter();
    const authRouter = new AuthRouter();
    const postRouter = new PostRouter();

    this.app.get("/", async (req: Request, res: Response) => {
      return res.status(200).send("<h1>Welcome to Free Blog</h1>");
    });
    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/posts", postRouter.getRouter());
  }

  // Define error handling
  private handleError(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log("Error : ", err);
        return res.status(500).send(err);
      }
    );
  }

  //untuk start app PORT atau localhost yang sudah di SetUp
  public async start(): Promise<void> {
    await redisClient.connect(); // cara menggunakan diconnecting terlebih dulu. Connect to redis
    this.app.listen(PORT, () => {
      console.log(`API running : http://localhost:${PORT}/`);
    });
  }
}
