import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, from, forkJoin } from 'rxjs';
import { mergeMap, tap, switchMap, map as rxMap, concatAll, mergeAll, reduce } from 'rxjs/operators';
import { UserPermission } from '../../../shared/interfaces/user-permission.model';
import { AuthService } from '../../components/auth/auth.service';
import { SocketService } from '../../components/socket/socket.service';
import { UserPermissionService } from './user-permission.service';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';

export class UserPermissions {

    constructor(private permissions: UserPermission[], private isAdmin: Boolean = false) { }

    public canCreateTool() {
        return this.isAdmin || !!find({ 'value': 'createTool' }, this.permissions);
    }

    public canEditTool() {
        return this.isAdmin || !!find({ 'value': 'editTool' }, this.permissions);
    }

    public canDeleteTool() {
        return this.isAdmin || !!find({ 'value': 'deleteTool' }, this.permissions);
    }
}

@Injectable()
export class UserPermissionDataService implements OnDestroy {
    static UNKNOWN_PERMISSIONS = new UserPermissions([]);
    private _permissions: BehaviorSubject<UserPermissions> =
        new BehaviorSubject<UserPermissions>(UserPermissionDataService.UNKNOWN_PERMISSIONS);
    private authInfoSub: Subscription;
    private isAdmin = false;

    static parameters = [AuthService, SocketService, UserPermissionService];
    constructor(private authService: AuthService,
        private socketService: SocketService,
        private userPermissionService: UserPermissionService) {

        console.log('USER PERMISSION DATA SERVICE');

        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.isAdmin = authInfo.isAdmin();

                this.userPermissionService.getMyPermissions()
                    .subscribe(permissions => {
                        console.log('permission', new UserPermissions(permissions, this.isAdmin));
                        this._permissions.next(new UserPermissions(permissions, this.isAdmin));
                        // this.socketService.syncArraySubject('userPermission', this._permissions);  // backend not implemented yet
                    });
            }, err => console.error(err));
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }

    /**
     * Returns the permissions of the user.
     * @return {Observable<UserPermissions>}
     */
    getPermissions(): Observable<UserPermissions> {
        return this._permissions.asObservable();
    }
}
