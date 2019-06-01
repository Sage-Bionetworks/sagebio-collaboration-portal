import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    message1Id,
    message2Id
} from './messages';

let replies = [{
    body: `{\"ops\":[{\"insert\":\"Reply to a body\\n\"}]}`,
    thread: message1Id,
    createdBy: adminUserId
}, {
    body: `{\"ops\":[{\"insert\":\"Reply to another body\\n\"}]}`,
    thread: message2Id,
    createdBy: adminUserId
}];

export {
    replies
};
