import { UserType } from './userType.models';

export class Users{
    id?:any;
    name:string;
    surname:string;
    phone?:string;
    tcNumber:string;
    email:string;
    password:string;
    adress:string;
    userTypeDto?:UserType;
}