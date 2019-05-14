export interface DiscoursePost {
    id: number;
    category_id: number;
    deleted_at: any;  // TODO: identify type
    post_number: number;
    reads: number;
    topic_id: number;
    topic_slug: string;
    topic_title: string;
    topic_html_title: string;
    created_at: string;
    reply_count: number;
}
