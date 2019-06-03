import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    toolTagId,
    feLiteTagId
} from './tags';

const message1Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3e9');
const message2Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3ea');
const message3Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3e4');

let messages = [{
    _id: message1Id,
    body: `{\"ops\":[{\"insert\":\"a body\\n\"}]}`,
    tags: [
        toolTagId
    ],
    createdBy: adminUserId
}, {
    _id: message2Id,
    body: `{\"ops\":[{\"insert\":\"another body\\n\"}]}`,
    tags: [
        toolTagId,
        feLiteTagId
    ],
    createdBy: adminUserId
}, {
    _id: message3Id,
    body: `{\"ops\":[{\"insert\":\"yet another body\\n\"}]}`,
    tags: [
        toolTagId,
        feLiteTagId
    ],
    createdBy: adminUserId
}];

export {
    messages,

    message1Id,
    message2Id,
    message3Id
};
