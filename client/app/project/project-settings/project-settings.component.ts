import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from 'models/auth/user-profile.model';
import { AuthService } from 'components/auth/auth.service';
import { Project } from 'models/project.model';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-settings',
    template: require('./project-settings.html'),
    styles: [require('./project-settings.scss')]
})
export class ProjectSettingsComponent implements OnDestroy {
    private project: Observable<Project>;
    private user: UserProfile;
    private authInfoSub: Subscription;

    static parameters = [ProjectDataService, AuthService];
    constructor(private projectDataService: ProjectDataService,
        private authService: AuthService) {

        this.project = this.projectDataService.project();
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => this.user = authInfo.user);
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
