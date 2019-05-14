import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiscourseCategory } from '../../../shared/interfaces/discourse/discourse-category.model';
import { DiscourseTopic } from '../../../shared/interfaces/discourse/discourse-topic.model';
import { DiscoursePost } from '../../../shared/interfaces/discourse/discourse-post.model';
import { DiscourseLatestPostsResponse } from '../../../shared/interfaces/discourse/discourse-latest-posts-response.model';
import { stringifyQuery } from '../../components/util';
import { orderBy } from 'lodash/fp';
import { discourse } from '../../app/app.constants';

@Injectable()
export class DiscussionService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getCategories(): Observable<DiscourseCategory[]> {
        let req = `${discourse.apiServerUrl}/categories`;
        return this.httpClient.get<DiscourseCategory[]>(req);
    }

    getLatestPosts(): Observable<DiscoursePost[]> {
        let req = `${discourse.apiServerUrl}/posts`;
        let headers = new HttpHeaders()
            .set('accept', 'application/json');
        return this.httpClient.get<DiscourseLatestPostsResponse>(req, { headers })
            .pipe(
                map(res => res.latest_posts),
                map(posts => orderBy('updated_at', 'desc', posts)),
                tap(posts => console.log('posts', posts))
            );
    }

    // getTopics(query?: {}): Observable<DiscourseTopic[]> {
    //     return this.httpClient.get<DiscourseTopic[]>(`${constants.discourse.apiServerUrl/}`);
    // }

    // getTool(toolId: string): Observable<Tool> {
    //     return this.httpClient.get<Tool>(`/api/tools/${toolId}`);
    // }
}
