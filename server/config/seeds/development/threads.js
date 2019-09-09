import mongoose from 'mongoose';
import {
    appId
} from '../default/constants';
import {
    adminUserId
} from './users';
import { adminProjectId, testProjectId } from './projects';
import {
    phccpShinyToolExample
} from './tools';
import {
    sageCkanCatalog
} from './data-catalogs';
import { entityTypes } from '../../environment';

const thread1Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3f9');
const thread2Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3fa');
const thread3Id = new mongoose.Types.ObjectId('5cf1eb9720a6a06be995c3f4');
const thread4Id = new mongoose.Types.ObjectId('5cf1eb9420a6a06be995c3f4');
const thread5Id = new mongoose.Types.ObjectId('5cf1eb9420a6a06b5995c3f4');
const thread6Id = new mongoose.Types.ObjectId('5cf1eb9420a6a06a5995c3f4');

let threads = [
    {
        _id: thread1Id,
        title: `Project thread #1`,
        entityId: adminProjectId,
        entityType: entityTypes.PROJECT.value,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 11, 33).toISOString(),
        updatedAt: new Date(2019, 4, 27, 11, 33).toISOString(),
    },
    {
        _id: thread2Id,
        title: `Public thread #1`,
        entityId: testProjectId,
        entityType: entityTypes.PROJECT.value,
        createdBy: adminUserId,
        createdAt: new Date(2019, 6, 31, 11, 33).toISOString(),
        updatedAt: new Date(2019, 6, 31, 11, 33).toISOString(),
    },
    {
        _id: thread3Id,
        title: `Project thread #2`,
        entityId: adminProjectId,
        entityType: entityTypes.PROJECT.value,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 12, 23).toISOString(),
        updatedAt: new Date(2019, 4, 27, 12, 23).toISOString(),
    },
    {
        _id: thread4Id,
        title: `This tool is awesome!`,
        entityId: phccpShinyToolExample._id,
        entityType: entityTypes.TOOL.value,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 12, 23).toISOString(),
        updatedAt: new Date(2019, 4, 27, 12, 23).toISOString(),
    },
    {
        _id: thread5Id,
        title: `This catalog is awesome!`,
        entityId: sageCkanCatalog._id,
        entityType: entityTypes.DATA_CATALOG.value,
        createdBy: adminUserId,
        createdAt: new Date(2019, 4, 27, 12, 23).toISOString(),
        updatedAt: new Date(2019, 4, 27, 12, 23).toISOString(),
    },
    {
        _id: thread6Id,
        title: `This portal is awesome!`,
        entityId: appId,
        entityType: entityTypes.APP.value,
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
    thread4Id
};
