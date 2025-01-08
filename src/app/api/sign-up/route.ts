import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs"

export async function POST(request:Request){
    await dbConnect()
    try{
        const {username,email,password} = request.json()
        const existingUserVerifiedByUsername  = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            true
        }else{
           const hashedPassword = await bcrypt.hash(password,10)
           const expiryDate  = new Date()
           expiryDate.setHours(expiryDate.getHours() + 1)

          const newUser =  new UserModel({
            username,
                email,
                hashedPassword,
                verifyCode,
                expiryDate,
                isVerified:false,
                isAcceptingmessage:true,
                messages:[]
           })
           await newUser.save()
           //send verfication email
          const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode)
            if (!emailResponse.success) {
                return Response.json({
                   success:false,
                   message:"Email not sent" 
                },{status:500})
            }
            return Response.json({
                success:true,
                message:"user registered verify email" 
             },{status:201})
        }
        
    }catch(error){
        console.error("Error registaring ");
        return Response.json(
            {
            success:false,
            message:'Error registering'
        },{
            status:500
        }
    )
        
    }
}