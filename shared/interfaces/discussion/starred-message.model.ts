import { Message } from './message.model';
import { UserProfile } from '../user-profile.model';

export interface StarredMessage {
    _id?: string;
    message: string;
    archived: boolean;
    createdAt: string;
}
