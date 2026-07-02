import UserModel, { UserDocument } from "../models/user.model";
import { IRegisterBody } from "../validators/auth.validator";

export function checkUser(email:string) : Promise<UserDocument | null> {

    return UserModel.findOne( { email });
}

export function createUser( data : IRegisterBody) : Promise<UserDocument> {
    return UserModel.create({ ...data })
}