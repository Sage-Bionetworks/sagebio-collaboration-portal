import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { AuthGuard } from './auth-guard.service';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionDataService } from './user-permission-data.service';

@NgModule({
    providers: [
        AuthService,
        UserService,
        TokenService,
        AuthGuard,
        UserPermissionDataService,
        UserPermissionService
    ]
})
export class AuthModule { }
