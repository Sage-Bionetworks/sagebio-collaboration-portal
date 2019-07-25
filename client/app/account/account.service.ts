import { Injectable } from '@angular/core';
// import User from '../../../server/api/user/user.model';

@Injectable()
export class AccountService {
    static parameters = [];
    constructor() {}

    updateUser(userData) {
        return new Promise((resolve) => {
            // WIP #170 - Implement updateUser
            console.log(`AccountService updateUser invoked with userData: ${JSON.stringify(userData, null, 2)}`);

            /**
                AccountService updateUser invoked with user: {
                "info": "<More Info>",
                "industry": "<Industry>",
                "location": "<Location>",
                "role": "user",
                "position": "<Current Position>",
                "orcid": "https://orcid.org/0000-0002-8242-9462",
                "_id": "5cb7acea2d718614d81cc97e",
                "provider": "local",
                "name": "Test User",
                "username": "test",
                "email": "test@sagebase.org",
                "createdBy": "5cb7acea2d718614d81bb97f",
                "createdAt": "2019-07-24T22:01:04.098Z"
                }
                */

            // let currentUser = async () => await User.findOne({ email: userData.email }).exec();
            const updatedUser = Object.assign({}, userData)

            // Make sure we are updating an existing user
            // if (!currentUser) throw new Error(`ERROR: Attempting to update user ${userData.email} that does not exist.`)

            // Apply the changes
            // const user = new User(Object.assign(currentUser, userData)).save();
            return resolve(updatedUser);
        });
    }
}
