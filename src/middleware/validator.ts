import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// export const regisValidation = [
//   // sudah di sederhanakan pada file middleware
//   body("username").notEmpty().withMessage("username required"), // username tidak boleh kosong
//   body("email").notEmpty().withMessage("email required"), // email tidak boleh kosong
//   body("email").isEmail().withMessage("email wrong"), // email salah
//   (req: Request, res: Response, next: NextFunction) => {
//     const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
//     // kondis if yang diutamakan error dulu karena agar tidak berlanjut ke error selanjutnya
//     if (!errorValidator.isEmpty()) {
//       // jika errorValidator tidak kosong maka akan dikirimka response sebaga error
//       return res.status(400).send({ error: errorValidator.array() });
//     }
//     next(); // jika errorValidator kosong maka lanjut ke controller register
//   },
// ];
// catetan yang diatas

export const regisValidation = [
  body("username").notEmpty().withMessage("Username required"),
  body("email").notEmpty().withMessage("Email required"),
  body("email").isEmail().withMessage("Email Wrong"),
  body("password").notEmpty().withMessage("password required"),
  body("username").isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errorValidator = validationResult(req); // untuk menampung jika ada error dari middleware validator
    if (!errorValidator.isEmpty()) {
      // jika errorValidator tidak kosong maka akan dikirimkan response sebagai error
      return res.status(400).send({ error: errorValidator.array() });
    }
    next(); // jika error validator kosong maka lanjut ke controller resgister
  },
];
