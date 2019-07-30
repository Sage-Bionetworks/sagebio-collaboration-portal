import mongoose from 'mongoose';
import {
    adminUserId
} from '../default/users';

let dashboards = [{
    _id: new mongoose.Types.ObjectId('5d3fca86fdf2999583f5f5f5'),
    resourceType: 'Dashboard',
    title: 'Flatiron Dashboard',
    description: `{\"ops\":[{\"insert\":\"Explore first touch descriptive information of Flatiron DataMarts and extract quick numbers out of a specific data release.\\n\\n\"}]}`,
    url: 'http://go.roche.com/flatironapp',
    createdBy: adminUserId
}];

export {
    dashboards
};
