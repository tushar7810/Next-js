import {z} from 'zod'

export const usernameValidation = z.string().min(2,"Username must be atleast 2 characters")
    .max(20,"Username must be atost 20 characters").regex(/^[a-zA-Z0-9_]+$/,"username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(8,{ message: "Password should contail 8 characters"}),
    
})