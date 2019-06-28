import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, from, forkJoin } from 'rxjs';
import { mergeMap, tap, switchMap, map as rxMap, concatAll, mergeAll, reduce } from 'rxjs/operators';
import { Permission } from '../../../shared/interfaces/permission.model';
import { AuthService } from '../../components/auth/auth.service';
import { SocketService } from '../../components/socket/socket.service';
import { UserPermissionService } from './user-permission.service';

@Injectable()
export class UserPermissionDataService implements OnDestroy {
    private _permissions: BehaviorSubject<Permission[]> = new BehaviorSubject<Permission[]>([]);
    private authInfoSub: Subscription;

    static parameters = [AuthService, SocketService, UserPermissionService];
    constructor(private authService: AuthService,
        private socketService: SocketService,
        private userPermissionService: UserPermissionService) {

        console.log('USER PERMISSION DATA SERVICE');
        // this.authInfoSub = this.authService.authInfo()
        //     .subscribe(authInfo => {
        //         if (authInfo.isLoggedIn()) {
        this.userPermissionService.getMyPermissions()
            .subscribe(permissions => {
                this._permissions.next(permissions);
                this.socketService.syncArraySubject('userPermission', this._permissions);  // backend not implemented yet
            });
        // }
    // }, err => console.log(err));
}

ngOnDestroy() {
    this.authInfoSub.unsubscribe();
}

/**
 * Returns the permissions of the user.
 * @return {Observable<Permission[]>}
 */
getPermissions(): Observable < Permission[] > {
    return this._permissions.asObservable();
}
}
