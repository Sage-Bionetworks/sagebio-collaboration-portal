import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';
import { SocketService } from './socket.service';

@NgModule({
    imports: [
        CommonModule,
        AuthModule
    ],
    providers: [
        SocketService
    ]
})
export class SocketModule { }
