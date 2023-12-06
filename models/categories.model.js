const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: [true, 'The name is missing!'] },
});
const Categorie = mongoose.model("Categories", schema);

module.exports = Categorie;