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

const PORT = 7070;

export default class App {
  private app: Express;

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

    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter);
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
  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API running : http://localhost:${PORT}/`);
    });
  }
}
