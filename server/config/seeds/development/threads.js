import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import { testProjectId, anotherProjectId } from './projects';
import {
    phccpShinyToolExample
} from './tools';

const thread1Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3f9');
const thread2Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3fa');
const thread3Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3f4');
const thread4Id = new mongoose.Types.ObjectId('5cf1eb9420a6a06be995c3f4');

let threads = [
    {
        _id: thread1Id,
        title: `Project thread #1`,
        entityId: testProjectId,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 11, 33).toISOString(),
        updatedAt: new Date(2019, 4, 27, 11, 33).toISOString(),
    },
    {
        _id: thread2Id,
        title: `Public thread #1`,
        entityId: anotherProjectId,
        createdBy: adminUserId,
        createdAt: new Date(2019, 6, 31, 11, 33).toISOString(),
        updatedAt: new Date(2019, 6, 31, 11, 33).toISOString(),
    },
    {
        _id: thread3Id,
        title: `Project thread #2`,
        entityId: testProjectId,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 12, 23).toISOString(),
        updatedAt: new Date(2019, 4, 27, 12, 23).toISOString(),
    },
    {
        _id: thread4Id,
        title: `This tool is awesome!`,
        entityId: phccpShinyToolExample._id,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 12, 23).toISOString(),
        updatedAt: new Date(2019, 4, 27, 12, 23).toISOString(),
    }
];

export {
    threads,
    thread1Id,
    thread2Id,
    thread3Id,
};
