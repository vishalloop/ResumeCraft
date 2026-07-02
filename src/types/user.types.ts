export interface IUser {
    name : string;
    email : string;
    password : string;
    createdAt? : Date;
    updatedAt? : Date
};

export interface JwtPayLoad {
    userId : string;
    email? : string;
}