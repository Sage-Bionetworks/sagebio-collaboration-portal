import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { AuthGuard } from './auth-guard.service';

@NgModule({
    providers: [
        AuthService,
        UserService,
        TokenService,
        AuthGuard
    ]
})
export class AuthModule {
    // public static forRoot(): ModuleWithProviders {
    //   return {
    //     ngModule: AuthModule,
    //     providers: [
    //       AuthService,
    //       UserService,
    //       TokenService,
    //       AuthGuard
    //     ]
    //   };
    // }
}
