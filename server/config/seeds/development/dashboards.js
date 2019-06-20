import mongoose from 'mongoose';
import { adminUserId } from './users';

let dashboards = [{
    title: 'CGDB Dashboard',
    description: 'A description',
    url: 'https://rsconnect.roche.com/connect/#/apps/656/access',
    createdBy: adminUserId
}];

export {
    dashboards
};
