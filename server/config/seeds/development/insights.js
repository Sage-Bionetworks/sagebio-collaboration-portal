import mongoose from 'mongoose';

let insights = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Initial Insight',
    description: `# Title 1
    - item1
    - item2`
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Inisght Test',
    description: `# Title 1
    - item3
    - item4`
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'AI-driven drug-target identication in SEA07 data',
    description: `# Title 1
    - item5
    - item6`
}];

export {
    insights
};
