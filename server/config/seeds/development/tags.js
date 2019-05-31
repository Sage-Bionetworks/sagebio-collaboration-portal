import mongoose from 'mongoose';
import {
    adminUserId
} from './users';

const toolTagId = new mongoose.Types.ObjectId('5cdf47b21bf56b1367c3f868');
const feLiteTagId = new mongoose.Types.ObjectId('5cdf47b21bf56b1367c3f869');

let tags = [{
    _id: toolTagId,
    name: 'tool',
    createdBy: adminUserId
}, {
    _id: feLiteTagId,
    name: 'fe-lite',
    createdBy: adminUserId
}];

export {
    tags,

    toolTagId,
    feLiteTagId
};
