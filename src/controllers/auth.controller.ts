import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { genSalt, hash } from "bcrypt";
import { transporter } from "../helpers/nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { sign } from "jsonwebtoken";
import { redisClient } from "../helpers/redis";

export class AuthController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      // konsep distructure menjadi lebih disederhanakan
      const { username, email, password } = req.body;
      const checkUser = await prisma.user.findUnique({
        where: { email },
      });

      if (checkUser) {
        throw new Error("Email is already exist");
      }

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
        },
      });

      //acess template email
      const templateMail = path.join(
        __dirname,
        "../templates",
        "registrasi.hbs"
      );
      const templateSource = fs.readFileSync(templateMail, "utf-8");
      const compileTemplate = handlebars.compile(templateSource);

      await transporter.sendMail({
        from: "Free Blog",
        to: email,
        subject: "Registration Succeccfully",
        html: compileTemplate({ name: username }),
      });

      res.status(201).send({ success: true, result: newUser });
    } catch (error: any) {
      console.log(error);
      next(error); // meneruskan error ke handleerror yang ada di app.ts
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. check user by email
      const checkUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (checkUser) {
        //2. if exist create token and send with email
        const token = sign(
          {
            id: checkUser?.id,
            role: checkUser?.role,
            email: checkUser?.email,
          },
          "scretJWT"
        );

        // menyimpan token yang aktif kedalam redis
        await redisClient.setEx(`forgot:${req.body.email}`, 3600, token);

        const templateMail = path.join(
          __dirname,
          "../templates",
          "forgotPassword,hbs"
        );
        const templateSource = fs.readFileSync(templateMail, "utf-8");
        const compileTemplate = handlebars.compile(templateSource);

        await transporter.sendMail({
          from: "Free Blog",
          to: req.body.email,
          subject: "Request Reset Password",
          html: compileTemplate({
            url: `http://localhost:3000/reset-password?tkn=${token}`,
          }),
        });

        return res.status(200).send({
          success: true,
          message: "Check your email",
        });
      } else {
        // 3. if not exist throw error
        throw new Error("Account is not Exist");
      }
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Data from token :", req.dataUser);
      console.log("Data pass :", req.body.password);
      console.log("Data confirmPass :", req.body.confirmPass);
    } catch (error) {
      next(error);
    }
  }
}
