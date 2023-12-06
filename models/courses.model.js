const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String, required: [true, 'The title is missing!'] },
    units: { type: Array, required: [true, 'You must have at least one unit']},
    categories: { type: Array, required: [true, 'You must have at least one categorie']},
    description: { type: String, required: [true, 'The description is missing!'] },
    features: { type: String, default: ''},
    certificate: { type: String, required: [true, 'The certificate is missing!'] },
    comments: { type: Array, default: []},
    moreInfo: { type: String, default: ''},
    rating: { type: Double, default: 0.0},
    time: { type: String, required: [true, 'The time is missing!'] },
});
const Course = mongoose.model("Courses", schema);

module.exports = Course;