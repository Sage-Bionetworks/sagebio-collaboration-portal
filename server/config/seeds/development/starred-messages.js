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
}, {
    message: message2Id,
    starredBy: adminUserId,
    archived: false
}];

export {
    starredMessages
};
