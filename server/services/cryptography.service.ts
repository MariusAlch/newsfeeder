import bcrypt from "bcrypt";
import crypto from "crypto-js";
import { config } from "../util/config";

class CryptographyService {
  createCipher(data: string): string {
    return crypto.AES.encrypt(data, config.appSecret).toString();
  }

  decodeCipher(cipher: string): string {
    const bytes = crypto.AES.decrypt(cipher, config.appSecret);
    return bytes.toString(crypto.enc.Utf8);
  }

  createHash(data: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
  }

  compareHash(data: string, hash: string): boolean {
    return bcrypt.compareSync(data, hash);
  }
}

export const cryptographyService = new CryptographyService();
