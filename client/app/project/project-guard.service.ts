import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'models/entities/project.model';
import { EntityGuard } from 'components/authorization/entity-guard.service';
import { ProjectAuthorizationService } from './project-authorization.service';

@Injectable()
export class ProjectGuard extends EntityGuard<Project> {
    static parameters = [Router, ProjectAuthorizationService];
    constructor(protected router: Router, protected authorizationService: ProjectAuthorizationService) {
        super(router, authorizationService);
    }

    falsyRedirectUrl(): string[] {
        return ['/', 'projects'];
    }
}
