import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { ProjectNewComponent } from '../project-new/project-new.component';
import { Project } from 'models/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { orderBy } from 'lodash/fp';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'project-list',
    template: require('./project-list.html'),
    styles: [require('./project-list.scss')],
})
export class ProjectListComponent implements OnInit, AfterViewInit {
    private projects: Observable<Project[]>;

    @ViewChild(ProjectNewComponent, { static: false }) newProject: ProjectNewComponent;
    private createNewProject = false;

    static parameters = [Router, FormBuilder, PageTitleService, ProjectService,
        NotificationService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private projectService: ProjectService,
        private notificationService: NotificationService) {
        this.projects = this.projectService.getProjects()
            .pipe(
                map(projects => orderBy('name', 'asc', projects))
            );
    }

    ngOnInit() {
        this.pageTitleService.title = 'Projects';
    }

    ngAfterViewInit() { }

    onNewProject(project: Project): void {
        this.createNewProject = false;
        this.notificationService.info('The Project has been successfully created');
    }
}
