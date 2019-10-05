import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToolAuthorizationService } from './tool-authorization.service';
import { EntityGuard } from 'components/authorization/entity-guard.service';
import { Tool } from 'models/entities/tool.model';

@Injectable()
export class ToolGuard extends EntityGuard<Tool> {
    static parameters = [Router, ToolAuthorizationService];
    constructor(protected router: Router, protected authorizationService: ToolAuthorizationService) {
        super(router, authorizationService);
    }

    falsyRedirectUrl(): string[] {
        return ['/', 'tools'];
    }
}
