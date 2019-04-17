import { DiscoursePost } from './discourse-post.model';

// @flow
export interface DiscourseLatestPostsResponse {
    latest_posts: DiscoursePost[];
}
