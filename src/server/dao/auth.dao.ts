import UserModel, { UserDocument } from "../models/user.model";
import { IRegisterBody } from "../validators/auth.validator";

export function findUserByEmail( email : string ) : Promise<UserDocument | null> {
    return UserModel.findOne( { email });
}

export function findUserById( id : string ) : Promise<UserDocument | null> {
    return UserModel.findOne( { _id : id });
}

export function createUser( data : IRegisterBody) : Promise<UserDocument> {
    return UserModel.create({ ...data });
}