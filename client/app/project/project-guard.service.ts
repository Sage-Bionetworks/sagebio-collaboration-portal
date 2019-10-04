import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectAuthorizationService } from './project-authorization.service';
import { EntityGuard } from 'components/authorization/entity-guard.service';

@Injectable()
export class ProjectGuard extends EntityGuard {
    static parameters = [Router, ProjectAuthorizationService];
    constructor(protected router: Router, protected authorizationService: ProjectAuthorizationService) {
        super(router, authorizationService);
    }

    falsyRedirectUrl(): string[] {
        return ['/', 'projects'];
    }
}
