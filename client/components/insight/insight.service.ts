import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stringifyQuery } from 'components/util';
import { Project } from 'models/project.model';
import { Insight } from 'models/entities/insights/insight.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';

@Injectable()
export class InsightService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    query(project: Project, query?: {}): Observable<Insight[]> {
        return this.httpClient.get<Insight[]>(`/api/insights/entity/${project._id}${stringifyQuery(query)}`);
    }

    getAll(query?: {}): Observable<Insight[]> {
        return this.httpClient.get<Insight[]>(`/api/insights${stringifyQuery(query)}`);
    }

    getInsight(insightId: string): Observable<Insight> {
        return this.httpClient.get<Insight>(`/api/insights/${insightId}`);
    }

    create(insight: Insight): Observable<Insight> {
        return this.httpClient.post<Insight>('/api/insights', insight);
    }

    updateInsightDescription(insight: Insight, description: string): Observable<Insight> {
        return this.httpClient.patch<Insight>(`/api/insights/${insight._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    updateStateDescription(insight: Insight, description: string): Observable<Insight> {
        return this.httpClient.patch<Insight>(`/api/states/${insight._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    showActivity(insight: Insight): void {
        let sidenavContentId = `activity:${insight._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>this.secondarySidenavService
                .loadContentComponent(ActivitySidenavComponent))
                .setRoot(insight);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
