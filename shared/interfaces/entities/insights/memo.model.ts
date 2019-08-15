import { Insight } from './insight.model';

export interface Memo extends Insight {
    attachments: Insight[];
}
