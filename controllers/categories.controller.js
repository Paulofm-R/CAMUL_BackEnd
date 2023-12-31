const Categories = require('../models/categories.model.js');

exports.create = async (req, res) => {
    const categorie = new Categories({
        name: req.body.name,
    })

    try {
        await categorie.save()
        return res.status(201).json({
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
        return res.status(200).json({
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

exports.findCategory = async (req, res) => {
    try {
        const categorie = await Categories.findById(req.params.categoryID).exec();

        if (categorie === null) {
            return res.status(404).json({
                success: false,
                msg: `Unable to find any category with the ID ${req.params.categoryID}`
            })
        }

        return res.json({
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
                msg: `Error retrieving category with ID ${req.params.categoryID}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const categorie = await Categories.findByIdAndUpdate(req.params.categoryID, req.body).exec();

        if (!categorie) {
            return res.status(404).json({
                message: `Cannot update category with id=${req.params.categoryID}. Please check if this already exists.`
            });
        }

        return res.status(200).json({
            message: `Category updated successfully!`
        });

        return
    } catch (err) {
        return res.status(500).json({ err });
    }
}

exports.delete = async (req, res) => {
    try {
        const categorie = await Categories.findByIdAndRemove(req.params.categoryID).exec()

        if (!categorie) {
            return res.status(404).json({
                message: `It is not possible to delete the Category with id=${req.params.categoryID} as it does not exist.`
            });
        } else {
            return res.status(200).json({
                message: `Category with id=${req.params.categoryID} was successfully deleted!`
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: `Error deleting Category with id=${req.params.categoryID}`
        });
    };
}