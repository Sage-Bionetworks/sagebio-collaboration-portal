import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, from, forkJoin } from 'rxjs';
import { mergeMap, tap, switchMap, map as rxMap, concatAll, mergeAll, reduce } from 'rxjs/operators';
import { UserPermission } from '../../../shared/interfaces/user-permission.model';
import { AuthService } from '../../components/auth/auth.service';
import { SocketService } from '../../components/socket/socket.service';
import { UserPermissionService } from './user-permission.service';
import { flow, keyBy, mapValues, values, find, orderBy } from 'lodash/fp';

export class UserPermissions {

    constructor(private permissions: UserPermission[]) { }

    public canCreateTool() {
        return !!find({ 'value': 'createTool' }, this.permissions);
    }

    public canEditTool() {
        return !!find({ 'value': 'editTool' }, this.permissions);
    }

    public canDeleteTool() {
        return !!find({ 'value': 'deleteTool' }, this.permissions);
    }
}

@Injectable()
export class UserPermissionDataService implements OnDestroy {
    static UNKNOWN_PERMISSIONS = new UserPermissions([]);
    private _permissions: BehaviorSubject<UserPermissions> =
        new BehaviorSubject<UserPermissions>(UserPermissionDataService.UNKNOWN_PERMISSIONS);
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
                console.log('permission', new UserPermissions(permissions));
                this._permissions.next(new UserPermissions(permissions));
                // this.socketService.syncArraySubject('userPermission', this._permissions);  // backend not implemented yet
            });
        // }
        // }, err => console.log(err));
    }

    ngOnDestroy() {
        // this.authInfoSub.unsubscribe();
    }

    /**
     * Returns the permissions of the user.
     * @return {Observable<UserPermissions>}
     */
    getPermissions(): Observable<UserPermissions> {
        return this._permissions.asObservable();
    }
}
