import { Request, Response } from "express";

export class SampleController {
  async getSample(req: Request, res: Response) {
    // ketika running GET pada postman akan menampilkan respose status 200/OK dengan keterangan dibawah ini
    return res.status(200).send("Sample Get Controller");
  }

  async createSample(req: Request, res: Response) {
    return res.status(200).send("Sample Create Controller");
  }

  async addNewImage(req: Request, res: Response) {
    try {
      console.log(req.file);
    } catch (error: any) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
