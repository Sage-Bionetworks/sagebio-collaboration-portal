import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    toolTagId,
    feLiteTagId
} from './tags';

let messages = [{
    body: `{\"ops\":[{\"insert\":\"a body\\n\"}]}`,
    tags: [
        toolTagId
    ],
    createdBy: adminUserId
}, {
    body: `{\"ops\":[{\"insert\":\"another body\\n\"}]}`,
    tags: [
        toolTagId,
        feLiteTagId
    ],
    createdBy: adminUserId
}];

export {
    messages
};
