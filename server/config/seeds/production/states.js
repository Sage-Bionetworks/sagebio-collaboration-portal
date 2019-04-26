import mongoose from 'mongoose';

let states = [{
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99e'),
    name: 'PCA on TCGA breast cancer dataset',
    description: `Plot of breast cancer classes based on the first 2 principal
        components of the cancer features.`,
    data: 'some data'
}, {
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99f'),
    name: `Diff express cancer indication breast/NSCLC w/ smoking history
        Description`,
    description: `### Differential expression & GSEA
 2 filters:

- Atezo tx

- cancer indication (breast & NSCLC),

**test covariate**: cancer indication

**numerator**: breast

**denominator**: NSCLC

**Batch covariate**: Smoking history`,
    data: 'some data'
}];

export {
    states
};
