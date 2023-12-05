const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: [true, 'The name is missing!'] },
    email: { type: String, required: [true, 'Your email is missing!'], unique: true },
    password: { type: String, required: [true, 'A password is missing!'] },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    type: { type: String, enum: { values: ['user', 'admin'], message: '{VALUE} is not supported' }, default: 'user' },
    active: { type: Boolean, default: true },
    completedCourses: { type: Array, default: [] },
    coursesInProgress: { type: Array, default: [] },
    createdUser: { type: Date, required: [true, 'A password is missing!']}
});
const User = mongoose.model("Users", schema);

module.exports = User;