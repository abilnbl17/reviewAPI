import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
// import { body, validationResult } from "express-validator";
import { regisValidation } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";

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
      regisValidation,
      this.authController.registerUser
    );
    this.router.post("/forget", this.authController.forgotPassword);
    this.router.post("/reset", verifyToken, this.authController.resetPassword);
  }

  getRouter(): Router {
    return this.router;
  }
}
