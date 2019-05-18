import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    toolTagId,
    feLiteTagId
} from './tags';

let articles = [{
    slug: 'about-tools',
    title: 'Which tools can be used for gene expression analysis?',
    body: '',
    tags: [
        toolTagId
    ],
    createdBy: adminUserId
}, {
    slug: 'about-fe-lite',
    title: 'How to open a file in FE Lite?',
    body: '',
    tags: [
        toolTagId,
        feLiteTagId
    ],
    createdBy: adminUserId
}];

export {
    articles
};
