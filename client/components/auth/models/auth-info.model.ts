import { User } from 'models/auth/user.model';

export class AuthInfo {
    constructor(public user: User) { }

    isLoggedIn() {
        return !!(this.user && this.user._id);
    }
}
