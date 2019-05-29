import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    toolTagId,
    feLiteTagId
} from './tags';

let messages = [{
    slug: 'about-tools',
    title: 'Which tools can be used for gene expression analysis?',
    body: `{\"ops\":[{\"insert\":\"a body\\n\"}]}`,
    tags: [
        toolTagId
    ],
    createdBy: adminUserId
}, {
    slug: 'about-fe-lite',
    title: 'How to open a file in FE Lite?',
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
