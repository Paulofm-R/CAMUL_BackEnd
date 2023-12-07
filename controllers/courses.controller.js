const Courses = require('../models/courses.model.js');

exports.create = async (req, res) => {
    const course = new Courses(req.body)

    try {
        await course.save()
        return res.status(201).json({
            success: true,
            msg: "New course created successfully!",
            URL: `/courses/${course._id}`
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while creating the new course."
            })
        }
    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await Courses
            .find()
            .select('title units description categories time')
            .exec();
        return res.status(200).json({
            success: true,
            courses: data
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while retrieving the courses."
            })
        }
    }
}

exports.findCourse = async (req, res) => {
    try {
        const course = await Courses.findById(req.params.courseID).exec();

        if (course === null) {
            return res.status(404).json({
                success: false,
                msg: `Unable to find any course with the ID ${req.params.courseID}`
            })
        }

        return res.json({
            success: true,
            course: course
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: `Error retrieving course with ID ${req.params.courseID}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const course = await Courses.findByIdAndUpdate(req.params.courseID, req.body).exec();

        if (!course) {
            return res.status(404).json({
                message: `Cannot update course with id=${req.params.courseID}. Please check if this already exists.`
            });
        }

        return res.status(200).json({
            message: `course updated successfully!`
        });

        return
    } catch (err) {
        return res.status(500).json({ err });
    }
}

exports.delete = async (req, res) => {
    try {
        const course = await Courses.findByIdAndRemove(req.params.courseID).exec()

        if (!course) {
            return res.status(404).json({
                message: `It is not possible to delete the course with id=${req.params.courseID} as it does not exist.`
            });
        } else {
            return res.status(200).json({
                message: `Course with id=${req.params.courseID} was successfully deleted!`
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: `Error deleting course with id=${req.params.courseID}`
        });
    };
}