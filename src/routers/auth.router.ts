import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { body, validationResult } from "express-validator";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initialaizeRoutes();
  }

  private initialaizeRoutes(): void {
    this.router.post(
      "/regis",
      body("email").notEmpty().withMessage("email required"),
      (req: Request, res: Response, next: NextFunction) => {
        const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
        // kondis if yang diutamakan error dulu karena agar tidak berlanjut ke error selanjutnya
        if (!errorValidator.isEmpty()) {
          // jika errorValidator tidak kosong maka akan dikirimka response sebaga error
          return res.status(400).send({ error: errorValidator.array() });
        }
        next(); // jika errorValidator kosong maka lanjut ke controller register
      },
      this.authController.registerUser
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
