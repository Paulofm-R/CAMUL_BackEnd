const Units = require('../models/units.model.js');

exports.create = async (req, res) => {
    const unit = new Units(req.body)

    try {
        await unit.save()
        return res.status(201).json({
            success: true,
            msg: "New unit created successfully!",
            URL: `/units/${unit._id}`
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while creating the new unit."
            })
        }
    }
}

exports.findUnit = async (req, res) => {
    try {
        const unit = await Units.findById(req.params.unitID).exec();

        if (unit === null) {
            return res.status(404).json({
                success: false,
                msg: `Unable to find any unit with the ID ${req.params.unitID}`
            })
        }

        return res.json({
            success: true,
            unit: unit
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: `Error retrieving unit with ID ${req.params.unitID}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const unit = await Units.findByIdAndUpdate(req.params.unitID, req.body).exec();

        if (!unit) {
            return res.status(404).json({
                message: `Cannot update unit with id=${req.params.unitID}. Please check if this already exists.`
            });
        }

        return res.status(200).json({
            message: `Unit updated successfully!`
        });

        return
    } catch (err) {
        return res.status(500).json({ err });
    }
}

exports.delete = async (req, res) => {
    try {
        const unit = await Units.findByIdAndRemove(req.params.unitID).exec()

        if (!unit) {
            return res.status(404).json({
                message: `It is not possible to delete the unit with id=${req.params.unitID} as it does not exist.`
            });
        } else {
            return res.status(200).json({
                message: `Unit with id=${req.params.unitID} was successfully deleted!`
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: `Error deleting unit with id=${req.params.unitID}`
        });
    };
}