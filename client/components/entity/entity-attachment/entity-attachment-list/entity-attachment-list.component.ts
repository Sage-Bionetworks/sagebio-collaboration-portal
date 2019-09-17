import { EntityAttachmentService } from './../entity-attachment.service';
import { Component, OnInit, Input, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Insight } from 'models/entities/insights/insight.model';
// import config from '../../../app/app.constants';
import { Entity } from 'models/entities/entity.model';
import { EntityService } from 'components/entity/entity.service';
import { BehaviorSubject, from, forkJoin, of, merge, combineLatest, Observable } from 'rxjs';
import { EntityAttachment } from 'models/entities/entity-attachment.model';
import config from '../../../../app/app.constants';
import { ProjectService } from '../../../../app/project/project.service';
import { DataCatalogService } from '../../../../app/data-catalog/data-catalog.service';
import { ToolService } from '../../../../app/tool/tool.service';
import { ResourceService } from 'components/resource/resource.service';
import { InsightService } from 'components/insight/insight.service';
import {
    mergeMap,
    switchMap,
    map,
    flatMap,
    tap,
    ignoreElements,
    debounceTime,
    distinctUntilChanged,
    filter,
    take,
} from 'rxjs/operators';
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
export class EntityAttachmentListComponent<E extends Entity> implements OnInit, AfterViewInit {
    @Input() entity: E;
    @Input() entityService: EntityService<E>;
    @Input() isReadOnly = true;

    private attachments: BehaviorSubject<AttachmentBundle[]> = new BehaviorSubject<AttachmentBundle[]>([]);
    private attachmentsDownloadProgress = 0;

    private attachmentForm: FormGroup;
    private attachmentTypes: any[];
    private attachmentPictureSize = 40;
    private attachmentSearchResults: AttachmentBundle[];
    private errors = {
        attachmentForm: undefined,
    };

    private entityTypes: any;

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
            attachment: [''],
        });
    }

    ngOnInit() {
        // this.attachmentTypes = Object.values(this.entityTypes);
        this.attachmentTypes = [
            // TODO Must be provided as @Input()
            config.entityTypes.INSIGHT,
            config.entityTypes.RESOURCE,
            config.entityTypes.PROJECT,
            config.entityTypes.DATA_CATALOG,
            config.entityTypes.TOOL,
        ];

        const getAttachmentBundle = attachment =>
            of(attachment).pipe(
                switchMap(attachment_ =>
                    forkJoin({
                        attachment: of(attachment_),
                        entity: this.getEntityService(attachment_.entityType).get(attachment_.entityId),
                    })
                )
            );

        // const createAttachmentBundle = (entity: Entity) =>

        if (this.entity) {
            const getAttachments = this.entityService
                .getAttachments(this.entity)
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
                                    // console.log(`${value} completed`);
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
                    },
                    err => console.error(err)
                );
        }
    }

    ngAfterViewInit() {
        merge(
            of(this.attachmentForm.get('attachmentType').value),
            this.attachmentForm.controls.attachmentType.valueChanges
        )
            .pipe(
                switchMap(entityType => {
                    const entityService = this.getEntityService(entityType);
                    if (entityService) {
                        return entityService.searchByTerms(this.attachmentForm.controls.attachment.valueChanges);
                    }
                    return of(null);
                }),
                map(response => {
                    if (response && response.count > 0) {
                        return response.results.map(entity => ({
                            attachment: {
                                entityId: entity._id,
                                entityType: this.attachmentForm.get('attachmentType').value,
                                entitySubType: this.getEntityService(
                                    this.attachmentForm.get('attachmentType').value
                                ).getEntitySubType(entity),
                                parentEntityId: null,
                            },
                            entity,
                        }));
                    }
                    return [];
                })
            )
            .subscribe((attachments: AttachmentBundle[]) => {
                this.attachmentSearchResults = attachments;
            });
    }

    public getAttachments(): Observable<AttachmentBundle[]> {
        return this.attachments.asObservable().pipe(take(1));
    }

    public createAttachments(entity: E): Observable<EntityAttachment[]> {
        if (entity && this.entityService) {
            let attachments = this.attachments.getValue().map(attachment => {
                let atta = attachment.attachment;
                atta.parentEntityId = entity._id;
                return atta;
            });
            return this.entityService.createAttachments(entity, attachments);
        }
    }

    getEntityTypeAndSubType(attachment: AttachmentBundle): string {
        const entityType = attachment.attachment.entityType;
        const entitySubType = this.getEntityService(entityType).getEntitySubType(attachment.entity);
        return entitySubType ? entitySubType : entityType; // `${entityType} > ${entitySubType}`
    }

    addAttachment(attachment: AttachmentBundle): void {
        if (attachment) {
            let attachments = this.attachments.getValue();
            attachments.push(attachment);
            this.attachments.next(attachments);
            this.attachmentForm.get('attachment').setValue('');
        }
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

    getAttachmentPictureStyle(): {} {
        return {
            width: `${this.attachmentPictureSize}px`,
            'min-width': `${this.attachmentPictureSize}px`,
            height: `${this.attachmentPictureSize}px`,
            margin: '0 0 0 0',
            'border-radius': '50%',
        };
    }
}
