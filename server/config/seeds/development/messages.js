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
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 12, 56),
        updatedAt: new Date(2019, 4, 27, 12, 56)
    }, {
        _id: message2Id,
        body: `{\"ops\":[{\"insert\":\"another body\\n\"}]}`,
        tags: [
            toolTagId,
            feLiteTagId
        ],
        createdBy: adminUserId,
        createdAt: new Date(2019, 5, 10, 14, 32),
        updatedAt: new Date(2019, 5, 10, 14, 32)
    }, {
        _id: message3Id,
        body: `{\"ops\":[{\"insert\":\"yet another body\\n\"}]}`,
        tags: [
            toolTagId,
            feLiteTagId
        ],
        createdBy: adminUserId,
        createdAt: new Date(2019, 5, 10, 16, 32),
        updatedAt: new Date(2019, 5, 10, 16, 32)
    },
    //
    // REPLIES
    //
    {
        body: `{\"ops\":[{\"insert\":\"Reply to a body\\n\"}]}`,
        thread: message1Id,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 28, 12, 57),
        updatedAt: new Date(2019, 4, 28, 12, 57)
    }, {
        body: `{\"ops\":[{\"insert\":\"Reply to another body\\n\"}]}`,
        thread: message2Id,
        createdBy: adminUserId,
        createdAt: new Date(2019, 5, 10, 14, 36),
        updatedAt: new Date(2019, 5, 10, 14, 36)
    }
];

export {
    messages,

    message1Id,
    message2Id,
    message3Id
};
