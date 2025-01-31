import { Message } from "@/model/user.model"
export interface ApiResponse{
    success: boolean,
    message: string,
    isAccesptingMssage?: boolean,
    messages?: Array<Message>
}