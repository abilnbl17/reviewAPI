import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testing.emailing.prwdka@gmail.com", // email yang pada gmail atau email yang baru dibuat
    pass: "tmhyiheqqimurudl", // ini bukan password email pada gmail, tapi email yang baru digenerate ke pass ini
  },
});
