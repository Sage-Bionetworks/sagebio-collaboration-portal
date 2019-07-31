import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import { testProjectId } from './projects';

const thread1Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3f9');
const thread2Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3fa');
const thread3Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3f4');

let threads = [
    {
        _id: thread1Id,
        title: `Thread #1 for a known project or entity`,
        entityId: testProjectId,
        createdBy: adminUserId,
        createdAt: new Date(2019, 7, 31, 11, 33).toISOString(),
        updatedAt: new Date(2019, 7, 31, 11, 33).toISOString(),
    },
    {
        _id: thread2Id,
        title: `A thread without a project or entity`,
        createdBy: adminUserId,
        createdAt: new Date(2019, 7, 31, 11, 33).toISOString(),
        updatedAt: new Date(2019, 7, 31, 11, 33).toISOString(),
    },
    {
        _id: thread3Id,
        title: `Thread #2 for a known project or entity`,
        entityId: testProjectId,
        createdBy: adminUserId,
        createdAt: new Date(2019, 7, 31, 11, 33).toISOString(),
        updatedAt: new Date(2019, 7, 31, 11, 33).toISOString(),
    },
];

export {
    threads,
    thread1Id,
    thread2Id,
    thread3Id,
};
