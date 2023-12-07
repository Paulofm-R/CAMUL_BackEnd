const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    question: { type: String, required: [true, 'The question is missing!'] },
    description: { type: String, required: [true, 'The description is missing!'] },
    image: { type: String, default: '' },
    categories: { type: Array, required: [true, 'You must have at least one categorie'] },
    userCreated: { type: String, required: [true, 'User created is missing!'] },
    createdFaq: { type: Date, required: [true, 'A createdFaq is missing!'] },
    answers: { type: Array, default: [] },
});
const Faq = mongoose.model("Faqs", schema);

module.exports = Faq;