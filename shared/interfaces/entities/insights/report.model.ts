import { Insight } from './insight.model';

export interface Report extends Insight {
    attachments: Insight[];
}
