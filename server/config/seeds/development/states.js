import mongoose from 'mongoose';
import { adminUserId } from './users';

let states = [{
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99e'),
    title: 'PCA on TCGA breast cancer dataset',
    description: 'plop',
    description: `{\"ops\":[{\"insert\":\"Plot of breast cancer classes based on the first 2 principal components of the cancer features.\\n\\n\"}]}`,
    data: 'some data',
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99f'),
    title: `Diff express cancer indication breast/NSCLC w/ smoking history
        Description`,
    description: `{\"ops\":[{\"insert\":\"Differential expression & GSEA\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"2 filters:\"},{\"insert\":\"\\n- Atezo tx\\n- cancer indication (breast & NSCLC)\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"test covariate\"},{\"insert\":\": cancer indication\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"numerator\"},{\"insert\":\": breast\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"denominator\"},{\"insert\":\": NSCLC\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Batch covariate\"},{\"insert\":\": Smoking history\\n\"}]}`,
    data: 'some data',
    createdBy: adminUserId
}];

export {
    states
};
