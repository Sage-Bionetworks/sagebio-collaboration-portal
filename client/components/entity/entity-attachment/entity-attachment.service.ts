import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
// import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stringifyQuery } from 'components/util';
// // import { EntityAttachments } from 'models/entities/entity.model';
// import { Project } from 'models/entities/project.model';
// import { Insight } from 'models/entities/insights/insight.model';
// import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
// import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';
// import { EntityService } from 'components/entity/entity.service';
import { QueryListResponse } from 'models/query-list-response.model';
// import { ShareSidenavComponent } from 'components/share/share-sidenav/share-sidenav.component';
// import { Entity } from 'models/entities/entity.model';
// import { Patch } from 'models/patch.model';
import { EntityAttachment } from 'models/entities/entity-attachment.model';
import { EntityService } from '../entity.service';
import { Entity } from 'models/entities/entity.model';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class EntityAttachmentService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) {}

    query(query?: {}): Observable<EntityAttachment[]> {
        return this.httpClient.get<EntityAttachment[]>(`/api/entity-attachments${stringifyQuery(query)}`);
    }
}
