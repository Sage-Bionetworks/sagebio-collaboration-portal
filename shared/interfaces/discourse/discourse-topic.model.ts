// @flow
export interface DiscourseTopic {
    id: number;
    category_id: number;
    title: string;
    posts_count: number;
    closed: boolean;
    views: number;
    created_at: string;
    last_posted_at: string;
    reply_count: number;
    like_count: number;
}
