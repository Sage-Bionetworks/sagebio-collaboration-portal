import { Injectable } from '@angular/core';
import { User } from 'models/auth/user.model';

@Injectable()
export class AccountService {
    static parameters = [];
    constructor() {}

    updateUser(user: User): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // WIP #170 - Implement updateUser
            console.log(`** NOT YET IMPLEMENTED ** updateUser invoked with user: ${JSON.stringify(user, null, 2)}`);
            return resolve(true);
        })
    }
}
