import mongoose from 'mongoose';
import {
    adminUserId
} from './users';

let dashboards = [{
    title: 'Flatiron Dashboard',
    description: `Explore first touch descriptive information of Flatiron
      DataMarts and extract quick numbers out of a specific data release.`,
    url: 'http://go.roche.com/flatironapp',
    createdBy: adminUserId
}];

export {
    dashboards
};
