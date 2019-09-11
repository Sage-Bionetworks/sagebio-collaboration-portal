import { Injectable } from '@angular/core';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ShareSidenavComponent } from 'components/share/share-sidenav/share-sidenav.component';
import { Entity } from 'models/entities/entity.model';

@Injectable()
export class ShareService {
    static parameters = [SecondarySidenavService];
    constructor(private secondarySidenavService: SecondarySidenavService) { }

    shareEntity(entity: Entity, entityType: string): void {
        let sidenavContentId = `${entityType}:${entity._id}`;

        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ShareSidenavComponent>this.secondarySidenavService.loadContentComponent(ShareSidenavComponent))
                .setEntity(entity, entityType);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
