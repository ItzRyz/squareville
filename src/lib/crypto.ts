import { hashSync, compareSync, genSaltSync } from "bcrypt-ts";

const encryptPassword = async (password: string) => {
  return hashSync(password, genSaltSync(12));
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return compareSync(password, hashedPassword);
};

export { encryptPassword, comparePassword };
