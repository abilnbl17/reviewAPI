import { Request } from "express";
import multer from "multer";
import { join } from "path"; // digunakan untuk merge location file yang dituju

// akan menyimpan configurasi yang akan simpan
// parameter uploader harus lebih biak diisi
// ketika mau mengupload bisa di rename menggunakna fileprefix
// folderName menggunakan untuk merubah nama yang akan dibrikan ( ketika parameter diberikan tanda "?" boleh diisi atau tidak )
export const uploader = (filePrefix: string, folderName?: string) => {
  // mendefine defaultDir
  const defaultDir = join(__dirname, "../../public"); // __dirname, mengarahkan file uploader dengan mengarahkannya ke public
  // mengarahkan ke directory file utama

  const configStorage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void // cb itu callback function pada code ini
    ) => {
      const fileDestination = folderName ? defaultDir + folderName : defaultDir;
      console.log("FOLDER TUJUAN : ", fileDestination); // memeriksa alamat penyimpanan tujuan
      cb(null, fileDestination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      // example1: ( email : photoku.jpg )
      //example2: ( email : photoku.profile.jpg )
      const originalNameParts = file.originalname.split("."); // example ["photo", "profile", "jpg"]
      console.log("ORIGINAL FILE NAME", originalNameParts);
      const extention = originalNameParts[originalNameParts.length - 1]; // example : biar hasilnya "jpg"
      const newName = filePrefix + Date.now() + "." + extention;
      console.log("NEW FILE NAME : ", newName);

      cb(null, newName);
    },
  });

  return multer({ storage: configStorage });
};
