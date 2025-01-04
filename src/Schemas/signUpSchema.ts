import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must not be 20 or more characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username must only contain letters, numbers, underscores, and dashes"
  );


  export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(8,{message:"password must be atleast 6 characters"})  
  })