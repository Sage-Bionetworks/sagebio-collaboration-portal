import { EntityAttachmentService } from './../entity-attachment.service';
import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
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
import { remove, pull } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'entity-attachment-list',
    template: require('./entity-attachment-list.html'),
    styles: [require('./entity-attachment-list.scss')],
    providers: [ProjectService, DataCatalogService, ToolService, ResourceService, InsightService],
    encapsulation: ViewEncapsulation.None,
})
export class EntityAttachmentListComponent<E extends Entity> implements OnInit {
    @Input() entity: E;
    @Input() entityService: EntityService<E>;
    @Input() isReadOnly = true;

    private attachments: BehaviorSubject<AttachmentBundle[]> = new BehaviorSubject<AttachmentBundle[]>([]);
    private attachmentsDownloadProgress = 0;

    private attachmentForm: FormGroup;

    private entityTypes: any;
    private attachmentTypes: any;

    static parameters = [
        Router,
        FormBuilder,
        EntityAttachmentService,
        ProjectService,
        DataCatalogService,
        ToolService,
        ResourceService,
        InsightService,
    ];
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private attachmentService: EntityAttachmentService,
        private projectService: ProjectService,
        private dataCatalogService: DataCatalogService,
        private toolService: ToolService,
        private resourceService: ResourceService,
        private insightService: InsightService
    ) {
        this.entityTypes = config.entityTypes;
        this.attachmentForm = this.formBuilder.group({
            attachmentType: [this.entityTypes.INSIGHT.value, [Validators.required]],
        });
    }

    ngOnInit() {
        this.attachmentTypes = Object.values(this.entityTypes);

        const getAttachmentBundle = attachment =>
            of(attachment).pipe(
                switchMap(attachment_ =>
                    forkJoin({
                        attachment: of(attachment_),
                        entity: this.getEntityService(attachment_.entityType).get(attachment_.entityId),
                    })
                )
            );

        if (this.entity) {
            const getAttachments = this.attachmentService
                .query({
                    parentEntityId: this.entity._id,
                })
                .pipe(
                    map(attachments => attachments.map(attachment => getAttachmentBundle(attachment))),
                    switchMap(bundles => forkJoinWithProgress(bundles))
                );

            getAttachments
                .pipe(
                    switchMap(([finalResult, progress]) =>
                        merge(
                            progress.pipe(
                                tap(value => {
                                    console.log(`${value} completed`);
                                    this.attachmentsDownloadProgress = value;
                                }),
                                ignoreElements()
                            ),
                            finalResult
                        )
                    )
                )
                .subscribe(
                    (attachments: AttachmentBundle[]) => {
                        this.attachments.next(attachments);
                        console.log('attachments', attachments);
                        // this.invites = invites;
                        // if (this.invites.length < 1) {
                        //     this.sidenavService.close();
                        // }
                    },
                    err => console.error(err)
                );
        }
    }

    // ngOnDesotry() {
    //     console.log('DESTROYING LIST OF ATTACHMENTS');
    // }

    getEntityTypeAndSubType(attachment: AttachmentBundle): string {
        const entityType = attachment.attachment.entityType;
        const entitySubType = this.getEntityService(entityType).getEntitySubType(attachment.entity);
        return entitySubType ? entitySubType : entityType; // `${entityType} > ${entitySubType}`
    }

    removeAttachment(event, attachment: AttachmentBundle): void {
        event.stopPropagation();
        let attachments = this.attachments.getValue();
        this.attachments.next(pull(attachments, attachment));
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

    /**
     * Navigates to the page of the entity specified.
     * @param entity
     * @param entityType
     */
    getEntityLink(entity: Entity, entityType: string) {
        if (entity && entityType) {
            const entityService = this.getEntityService(entityType);
            return entityService.getRouterLink(entity);
        }
    }
}
