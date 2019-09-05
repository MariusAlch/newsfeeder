import multer from "multer";
import mongoFileStorate from "multer-gridfs-storage";
import { config } from "./config";

const storage = mongoFileStorate({
  url: config.mongoUri,
});
const MB = 1024 * 1024;

export const upload = multer({ storage, limits: { fileSize: 2 * MB } });
