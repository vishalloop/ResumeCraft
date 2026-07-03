export interface IUser {
    name : string;
    email : string;
    password : string;
    createdAt? : Date;
    updatedAt? : Date
};

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface JwtPayLoad {
    userId : string;
    email? : string;
}