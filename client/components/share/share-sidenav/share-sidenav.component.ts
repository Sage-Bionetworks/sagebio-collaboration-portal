import { Component, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from 'components/socket/socket.service';
import { Entity } from 'models/entities/entity.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObjectValidators } from 'components/validation/object-validators';
import config from '../../../app/app.constants';

// import { User } from 'models/auth/user.model';
// import { combineLatest } from 'rxjs';
// import { flow, keyBy, mapValues, values } from 'lodash/fp';
// import { Filter } from 'components/filters/filter.model';
// import { FiltersComponent } from 'components/filters/filters.component';

@Component({
    selector: 'share-sidenav',
    template: require('./share-sidenav.html'),
    styles: [require('./share-sidenav.scss')],
})
export class ShareSidenavComponent implements OnDestroy, AfterViewInit {
    // @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;
    private entity: Entity;
    private newForm: FormGroup;

    private searchUsersResultCount = 0;
    private searchUsersFetchNotReached = true;
    private users = [{ id: 1, name: 'Carlos Alvarado' }, { id: 2, name: 'Nick Greer' }, { id: 3, name: 'Kevin Thane' }];

    static parameters = [SecondarySidenavService, SocketService, Router, FormBuilder];

    constructor(
        private sidenavService: SecondarySidenavService,
        private socketService: SocketService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(_ => this.close());
        this.newForm = formBuilder.group({
            invitedUsers: ['', [Validators.required]],
            comments: [
                '',
                [
                    Validators.maxLength(config.models.share.comment.maxlength),
                    // ObjectValidators.jsonStringifyMaxLength(config.models.share.comment.maxlength),
                ],
            ],
        });
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        if (this.entity) {
            this.socketService.unsyncUpdates(`insight:${this.entity._id}:entity`);
        }
    }

    setEntity(entity: Entity): void {
        if (entity) {
            this.entity = entity;
        }
    }

    share(): void {
        let ShareDetails = this.newForm.value;
        console.log('ShareDetails: ', ShareDetails);
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
