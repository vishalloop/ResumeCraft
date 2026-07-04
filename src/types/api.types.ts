    export interface AuthUser {
        id: string;
        name: string;
        email: string;
    };

    export interface ApiResponse <T = void> {
        success : boolean;
        message : string;
        data? : T;
        error? : object;
    }