import mongoose, {Schema , Document} from "mongoose";

export interface Message extends Document{
    content: String;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document{
    username: String,
    email: String,
    password: String,
    verifyCode: String,
    verifyCodeExpire: Date,
    isVarified: boolean
    isAcceptingMessage: boolean
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username required"],
        trim: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        match: [ /.+\@.+\..+/, "please use a valid email address"]
    },
    password: {
        type:String,
        required: true,
        minlength: [8 , "Password must contain 8 characters"]
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpire: {
        type: Date,
        required: true
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default UserModel