import { ComplaintStatus } from './complaint-status.models';
import { Users } from './user.models';
import { Category } from './category.models';
import { ComplaintGalleries } from './complaint-galleries.models';

export class Complaint{
    id?:any;
    description:string;
    location:string;
    userDto:Users;
    category:Category;
    complaintStatus:ComplaintStatus;
    complaintGalleries?:ComplaintGalleries[];
}