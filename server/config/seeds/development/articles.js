import mongoose from 'mongoose';
import {
    adminUserId
} from '../default/users';

let articles = [{
    _id: new mongoose.Types.ObjectId('5d41074d1233ee2c08977867'),
    title: 'Systematic identification of mutations and copy number alterations associated with cancer patient prognosis',
    description: `{\"ops\":[{\"insert\":\"Smith JC, Sheltzer JM. Systematic identification of mutations and copy number
    alterations associated with cancer patient prognosis. Elife. 2018 Dec 11;7. pii:
    e39217. doi: 10.7554/eLife.39217. PubMed PMID: 30526857; PubMed Central PMCID:
    PMC6289580.
    \\n\\n\"}]}`,
    url: 'http://go.roche.com/flatironapp',
    createdBy: adminUserId
}];

export {
    articles
};
