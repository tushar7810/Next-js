import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(email:string,username:string,verifyCode: string): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({username, otp: verifyCode})
        });
        return {success:true, message:"Verification email send successfully"}
    } catch (error) {
        console.error("Error sending verification email : ", error)
        return {success:false, message:"Failed to send varification email"}
    }
}