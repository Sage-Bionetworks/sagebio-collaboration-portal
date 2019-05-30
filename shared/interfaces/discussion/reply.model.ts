import { User } from '../user.model';
import { Message } from './message.model';

export interface Reply {
    _id?: number;
    message: Message;
    body: string;
    createdAt: string;
    createdBy: User;
}
