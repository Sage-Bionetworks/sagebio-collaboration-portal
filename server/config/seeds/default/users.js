import { adminUserId } from './constants';
import config from '../../environment';

// Notes:
// - Users must have the property _id.

let users = [
    {
        _id: adminUserId,
        provider: 'local',
        role: config.userRoles.ADMIN.value,
        name: 'Admin',
        username: 'admin',
        email: config.init.admin.email,
        password: config.init.admin.password,
        position: 'Research Scientist',
        orcid: 'https://orcid.org/0000-0002-8242-9462',
        createdBy: adminUserId,
    },
];

export { users, adminUserId };
