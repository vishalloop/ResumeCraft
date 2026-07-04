import z from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be 2 characters long." }),
  email: z.string().trim().toLowerCase().email({ message: "Please Enter valid Email Address" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" })
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

export const loginSchema = z.object({
    email : z.string().trim().toLowerCase().email({ message : "Please Enter Valid Email Address." }),
    password : z.string().min(1, { message : "Password is Required"}),
});

export type IRegisterBody = z.infer<typeof registerSchema>;