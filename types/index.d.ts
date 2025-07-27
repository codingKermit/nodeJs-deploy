import User from '../models/user';
import IUser from '../models/user';

declare global {
    namespace Express {
        interface User extends IUser{
        }
    }

    interface Error {
        status : number
    }

    type Env = 'development' | 'test' | 'production';
}

declare module 'express-session' {
    interface SessionData {
        passport : User;
    }
}