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
    catchError,
} from 'rxjs/operators';
import { forkJoinWithProgress } from 'components/rxjs/util';
import { AttachmentBundle } from '../models/attachment-bundle.model';
import { remove, pull, difference, clone } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'components/notification/notification.service';
import { AttachmentUpdateResult } from '../models/attachment-update-result.model';

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
    private _attachmentTypes: any[];

    private attachments: BehaviorSubject<AttachmentBundle[]> = new BehaviorSubject<AttachmentBundle[]>([]);
    private attachmentsBackup: AttachmentBundle[] = [];
    private attachmentsDownloadProgress = 0;

    private entityTypes: any;
    private attachmentForm: FormGroup;
    private attachmentPictureSize = 40;
    private attachmentSearchResults: AttachmentBundle[];
    private errors = {
        attachmentForm: undefined,
    };

    static parameters = [
        Router,
        FormBuilder,
        EntityAttachmentService,
        ProjectService,
        DataCatalogService,
        ToolService,
        ResourceService,
        InsightService,
        NotificationService,
    ];
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private attachmentService: EntityAttachmentService,
        private projectService: ProjectService,
        private dataCatalogService: DataCatalogService,
        private toolService: ToolService,
        private resourceService: ResourceService,
        private insightService: InsightService,
        private notificationService: NotificationService
    ) {
        this.entityTypes = config.entityTypes;
        this._attachmentTypes = this.entityTypes;
        this.attachmentForm = this.formBuilder.group({
            attachmentType: [this.entityTypes.INSIGHT.value, [Validators.required]],
            attachment: [''],
        });
    }

    ngOnInit() {
        const getAttachmentBundle = attachment =>
            of(attachment).pipe(
                switchMap(attachment_ =>
                    forkJoin({
                        attachment: of(attachment_),
                        entity: this.getEntityService(attachment_.entityType)
                            .get(attachment_.entityId)
                            .pipe(
                                catchError(err => {
                                    // TODO Review what to do with entities the user has not access to or
                                    // that are no longer available (removed).
                                    console.error(err);
                                    this.notificationService.error(`Unable to get attachment ${attachment_.entityId}`);
                                    return of(<Entity>{});
                                })
                            ),
                    })
                )
            );

        if (this.entity) {
            const getAttachments = this.entityService.getAttachments(this.entity).pipe(
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
                        this.attachmentsBackup = clone(attachments);
                    },
                    err => console.error(err)
                );
        }
    }

    ngAfterViewInit() {
        // search entities to attach
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
                                parentEntityId: this.entity._id,
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

    get attachmentTypes(): any[] {
        return this._attachmentTypes;
    }

    @Input()
    set attachmentTypes(attachmentTypes: any[]) {
        this._attachmentTypes = attachmentTypes;
        if (attachmentTypes.length > 0) {
            this.attachmentForm.get('attachmentType').setValue(attachmentTypes[0].value);
        }
    }

    /**
     * Returns the attachments.
     */
    public getAttachments(): Observable<AttachmentBundle[]> {
        return this.attachments.asObservable().pipe(take(1));
    }

    /**
     * Adds the attachments to the entity specified.
     * @param entity
     */
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

    /**
     * Saves the attachments to the server.
     */
    public updateAttachments(): Observable<AttachmentUpdateResult> {
        const addAttachments = this.attachments.pipe(
            take(1),
            map(bundles => {
                let current = bundles.map(bundle => bundle.attachment);
                let backup = this.attachmentsBackup.map(bundle => bundle.attachment);
                return difference(current, backup);
            }),
            switchMap(attachments =>
                attachments.length > 0
                    ? this.entityService.createAttachments(this.entity, attachments)
                    : of(<EntityAttachment[]>[])
            )
        );

        const removeAttachments = this.attachments.pipe(
            take(1),
            map(bundles => {
                let current = bundles.map(bundle => bundle.attachment);
                let backup = this.attachmentsBackup.map(bundle => bundle.attachment);
                return difference(backup, current);
            }),
            map(attachments =>
                attachments.map(attachment => this.entityService.removeAttachment(this.entity, attachment))
            ),
            switchMap(attachments => (attachments.length > 0 ? forkJoin(attachments) : of(<EntityAttachment[]>[])))
        );

        return forkJoin({
            added: addAttachments,
            removed: removeAttachments,
        });
    }

    /**
     * Returns the sub-type of an entity attached. If null, the primary entity type is returned.
     * @param attachment
     */
    getEntityTypeAndSubType(attachment: AttachmentBundle): string {
        const entityType = attachment.attachment.entityType;
        const entitySubType = this.getEntityService(entityType).getEntitySubType(attachment.entity);
        return entitySubType ? entitySubType : entityType;
    }

    /**
     * Adds an attachment to the list of attachments (client-side only).
     * @param attachment
     */
    addAttachment(attachment: AttachmentBundle): void {
        if (attachment) {
            let attachments = this.attachments.getValue();
            attachments.push(attachment);
            this.attachments.next(attachments);
            this.attachmentForm.get('attachment').setValue('');
        }
    }

    /**
     * Removes an attachment from the list of attachments (client-side only).
     * @param event
     * @param attachment
     */
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

    /**
     * Sets the style of the picture of an attachment.
     */
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
