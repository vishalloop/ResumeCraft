import { IUser } from "@/types/user.types";
import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface UserDocument extends IUser ,Document {
    comparePassword(candidatePassword: string) : Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
    name : {
        type : String,
        required : [true, "Name is Required for Registration."]
    },
    email : {
        type : String,
        required : [true, "Email address is required for Registration."],
        unique : true
    },
    password : {
        type : String,
        required : [true, "password is required for Registration."]
    }
},{
    timestamps : true,
});

userSchema.pre("save", async function () : Promise<void> {
    if(!this.isModified("password")) {
        return;
    };

    this.password = await bcrypt.hash(this.password , 10);
});

userSchema.methods.comparePassword = function (candidatePassword : string) : Promise<boolean> {

    return bcrypt.compare(candidatePassword, this.password);

}

const UserModel = mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default UserModel;