import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    message1Id,
    message2Id
} from './messages';

let starredMessages = [{
    message: message1Id,
    starredBy: adminUserId
}];

export {
    starredMessages
};
