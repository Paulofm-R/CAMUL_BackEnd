const Categories = require('../models/categories.model.js');

exports.create = async (req, res) => {
    const categorie = new Categories({
        name: req.body.name,
    })

    try {
        await categorie.save()
        res.status(201).json({
            success: true,
            msg: "New category created successfully!",
            URL: `/categories/${categorie._id}`
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while creating the new category."
            })
        }
    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await Categories
            .find()
            .select('name')
            .exec();
        res.status(200).json({
            success: true,
            categories: data
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while retrieving the categories."
            })
        }
    }
}

exports.findCategorie = async (req, res) => {
    try {
        const categorie = await Categories.findById(req.params.categorieID).exec();

        if (categorie === null) {
            res.status(404).json({
                success: false,
                msg: `Unable to find any category with the ID ${req.params.categorieID}`
            })
        }

        res.json({
            success: true,
            categorie: categorie
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: `Error retrieving category with ID ${req.params.categorieID}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const categorie = await Categories.findByIdAndUpdate(req.params.categorieID, req.body).exec();
        console.log(categorie);

        if (!categorie) {
            return res.status(404).json({
                message: `Cannot update category with id=${req.params.categorieID}. Please check if this already exists.`
            });
        }
        res.status(200).json({
            message: `Category updated successfully!`
        });
    } catch (err) {
        res.status(500).json({
            message: `Error updating category.`
        });
    }
}

exports.delete = async (req, res) => {
    try {
        const categorie = await Categories.findByIdAndRemove(req.params.categorieID).exec()

        if (!categorie) {
            res.status(404).json({
                message: `It is not possible to delete the technique with id=${req.params.categorieID} as it does not exist.`
            });
        } else {
            res.status(200).json({
                message: `Technique with id=${req.params.categorieID} was successfully deleted!`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error deleting technique with id=${req.params.categorieID}`
        });
    };
}