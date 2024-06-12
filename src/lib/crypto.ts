import { hashSync, compareSync, genSaltSync } from "bcrypt-ts";

const encryptPassword = async (password: string) => {
  return hashSync(password, genSaltSync(12));
};

const comparePassword = async (password: string, hashedPassword: string | undefined) => {
  return compareSync(password, hashedPassword as string);
};

export { encryptPassword, comparePassword };
