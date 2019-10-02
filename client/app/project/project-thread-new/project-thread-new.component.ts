import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from 'models/entities/project.model';
import { Thread } from 'models/messaging/thread.model';
import { ProjectDataService } from '../project-data.service';
import config from '../../app.constants';

@Component({
    selector: 'project-thread-new',
    template: require('./project-thread-new.html'),
    styles: [require('./project-thread-new.scss')],
})
export class ProjectThreadNewComponent implements OnInit {
    private project$: Observable<Project>;
    private entityType: string;

    static parameters = [Router, ActivatedRoute, ProjectDataService];
    constructor(private router: Router, private route: ActivatedRoute, private projectDataService: ProjectDataService) {
        this.entityType = config.entityTypes.PROJECT.value;
    }

    ngOnInit() {
        this.project$ = this.projectDataService.project();
    }

    onNewThread(thread: Thread): void {
        if (thread) {
            this.router.navigate(['..', thread._id], { relativeTo: this.route });
        }
    }

    onClose(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
