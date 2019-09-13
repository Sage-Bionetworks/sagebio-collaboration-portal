import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { Entity } from 'models/entities/entity.model';
import { User } from 'models/auth/user.model';
import { ActivitySidenavComponent } from '../activity-sidenav/activity-sidenav.component';

@Component({
    selector: 'show-activity-button',
    template: require('./show-activity-button.html'),
    styles: [require('./show-activity-button.scss')],
})
export class ShowActivityButtonComponent {
    @Input() private root: Entity | User;
    @Input() private tooltip = 'Show Recent Activity'; // used in html

    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [SecondarySidenavService];
    constructor(private sidenavService: SecondarySidenavService) {}

    showActivity(): void {
        if (this.root) {
            let sidenavContentId = `activity:${this.root._id}`;
            if (this.sidenavService.getContentId() !== sidenavContentId) {
                (<ActivitySidenavComponent>this.sidenavService.loadContentComponent(ActivitySidenavComponent)).setRoot(
                    this.root
                );
                this.sidenavService.setContentId(sidenavContentId);
            }
            this.sidenavService.open();
        }
    }
}
