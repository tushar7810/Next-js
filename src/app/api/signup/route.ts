import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcrypt'

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await req.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVarified: true })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                message: "User already exist",
                success: false
            },
                {
                    status: 400
                }
            )
        }

        const existingUserbyEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVarified) {
                return Response.json({
                    message: "User already exist",
                    success: false
                },
                    {
                        status: 400
                    }
                )
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserbyEmail.password = hashedPassword
                existingUserbyEmail.verifyCode = verifyCode
                existingUserbyEmail.verifyCodeExpire = new Date(Date.now()+3600000)

                await existingUserbyEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expireDate = new Date()
            expireDate.setHours(expireDate.getHours() + 1)

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpire: expireDate,
                isVarified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }
        
        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                message: emailResponse.message,
                success: false
            },
                {
                    status: 400
                })
        }

        return Response.json({
            success: true,
            message: "User registerd successfully",
        },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error in register", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
            {
                status: 400
            }
        )
    }
}