import { Message } from './message.model';
import { UserProfile } from '../user-profile.model';

export interface StarredMessage {
    _id?: string;
    message: Message;
    starredBy: UserProfile;
    archived: boolean;
}
