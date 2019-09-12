import { EntityAttachmentService } from './../entity-attachment.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Insight } from 'models/entities/insights/insight.model';
// import config from '../../../app/app.constants';
import { Entity } from 'models/entities/entity.model';
import { EntityService } from 'components/entity/entity.service';
import { BehaviorSubject, from, forkJoin, of, merge } from 'rxjs';
import { EntityAttachment } from 'models/entities/entity-attachment.model';
import config from '../../../../app/app.constants';
import { ProjectService } from '../../../../app/project/project.service';
import { DataCatalogService } from '../../../../app/data-catalog/data-catalog.service';
import { ToolService } from '../../../../app/tool/tool.service';
import { ResourceService } from 'components/resource/resource.service';
import { InsightService } from 'components/insight/insight.service';
import { mergeMap, switchMap, map, flatMap, tap, ignoreElements } from 'rxjs/operators';
import { forkJoinWithProgress } from 'components/rxjs/util';
import { AttachmentBundle } from '../models/attachment-bundle.model';



@Component({
    selector: 'entity-attachment-list',
    template: require('./entity-attachment-list.html'),
    styles: [require('./entity-attachment-list.scss')],
    providers: [ProjectService, DataCatalogService, ToolService, ResourceService, InsightService],
})
export class EntityAttachmentListComponent<E extends Entity> implements OnInit {
    @Input() entity: E;
    @Input() entityService: EntityService<E>;

    private attachments: BehaviorSubject<AttachmentBundle[]> = new BehaviorSubject<AttachmentBundle[]>([]);

    private entityTypes: any;

    static parameters = [
        EntityAttachmentService,
        ProjectService,
        DataCatalogService,
        ToolService,
        ResourceService,
        InsightService,
    ];
    constructor(
        private attachmentService: EntityAttachmentService,
        private projectService: ProjectService,
        private dataCatalogService: DataCatalogService,
        private toolService: ToolService,
        private resourceService: ResourceService,
        private insightService: InsightService
    ) {}

    ngOnInit() {
        this.entityTypes = config.entityTypes;

        const getAttachmentBundle = attachment =>
            of(attachment).pipe(
                switchMap(attachment_ =>
                    forkJoin({
                        attachment: of(attachment_),
                        entity: this.getEntityService(attachment_.entityType).get(attachment_.entityId),
                    })
                )
            );

        const getAttachments = this.attachmentService
            .query({
                parentEntityId: this.entity._id,
            })
            .pipe(
                map(attachments => attachments.map(attachment => getAttachmentBundle(attachment))),
                switchMap(bundles => forkJoinWithProgress(bundles))
            );

        if (this.entity) {

            getAttachments
            .pipe(
                switchMap(([finalResult, progress]) => merge(
                    progress.pipe(
                        // tap((value) => console.log(`${value} completed`)),
                        ignoreElements()
                    ),
                    finalResult
                ))
            ).subscribe((attachments: AttachmentBundle[]) => {
                this.attachments.next(attachments);
                console.log('attachments', attachments);
                // this.invites = invites;
                // if (this.invites.length < 1) {
                //     this.sidenavService.close();
                // }
            }, err => console.error(err));



            // this.attachmentService
            //     .query({
            //         parentEntityId: this.entity._id,
            //     })
            //     .pipe(
            //         tap(attachments => console.log('SOURCE', attachments)),
            //         flatMap(
            //             attachments => from(attachments)
            //             // .pipe(
            //             //     switchMap(attachment => forkJoin({
            //             //         attachment: of(attachment),
            //             //         entity: this.getEntityService(attachment.entityType).get(attachment.entityId)
            //             //     }))
            //             // )
            //         )
            //     )
            //     .subscribe(attachments => {
            //         console.log('attachment', attachments);
            //         // this.attachments.next(attachments);
            //     });
        }
    }

    /**
     * Returns the service associated to the Entity type specified.
     * @param entityType
     */
    getEntityService(entityType: string): EntityService<Entity> {
        if (entityType === this.entityTypes.PROJECT.value) {
            return this.projectService;
        } else if (entityType === this.entityTypes.DATA_CATALOG.value) {
            return this.dataCatalogService;
        } else if (entityType === this.entityTypes.TOOL.value) {
            return this.toolService;
        } else if (entityType === this.entityTypes.RESOURCE.value) {
            return this.resourceService;
        } else if (entityType === this.entityTypes.INSIGHT.value) {
            return this.insightService;
        }
        return null;
    }
}
