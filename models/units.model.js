const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String, required: [true, 'The title is missing!'] },
    video: { type: String, default: ''},
    slide: { type: String, default: ''},
    image: { type: String, default: '' },
    description: { type: String, required: [true, 'The description is missing!'] },
    exercises: { type: Array, default: [] },
});
const Unit = mongoose.model("Units", schema);

module.exports = Unit;