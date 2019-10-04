import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToolAuthorizationService } from './tool-authorization.service';
import { EntityGuard } from 'components/authorization/entity-guard.service';

@Injectable()
export class ToolGuard extends EntityGuard {
    static parameters = [Router, ToolAuthorizationService];
    constructor(protected router: Router, protected authorizationService: ToolAuthorizationService) {
        super(router, authorizationService);
    }

    falsyRedirectUrl(): string[] {
        return ['/', 'tools'];
    }
}
