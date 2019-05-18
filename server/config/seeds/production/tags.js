import mongoose from 'mongoose';
import {
    adminUserId
} from './users';

let tags = [{
    name: 'tool',
    createdBy: adminUserId
}, {
    name: 'fe-lite',
    createdBy: adminUserId
}];

export {
    tags
};
