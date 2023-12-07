const FAQs = require('../models/faqs.model.js');

exports.create = async (req, res) => {
    const newFaq = {
        question: req.body.question,
        description: req.body.description ,
        image: req.body.image || '',
        categories: req.body.categories,
        userCreated: req.body.user,
        createdFaq: new Date()
    }

    const faq = new FAQs(newFaq)

    try {
        await faq.save()
        return res.status(201).json({
            success: true,
            msg: "New faq created successfully!",
            URL: `/faqs/${faq._id}`
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while creating the new faq."
            })
        }
    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await FAQs
            .find()
            .select('question description categories createdFaq answers')
            .exec();


        const faqData = [];

        // handle the values to be returned by the API
        for (let i = 0; i < data.length; i++) {

            const newData = {
                _id: data[i]._id,
                question: data[i].question,
                description: data[i].description,
                categories: data[i].categories,
                createdFaq: data[i].createdFaq.toISOString().split("T")[0], // search only the value of the date
                answers: data[i].answers.length,
            }

            faqData.push(newData)
        }

        return res.status(200).json({
            success: true,
            faqs: faqData
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: err.message || "An error occurred while retrieving the faqs."
            })
        }
    }
}

exports.findFaq = async (req, res) => {
    try {
        const faq = await FAQs.findById(req.params.faqID).exec();

        if (faq === null) {
            return res.status(404).json({
                success: false,
                msg: `Unable to find any faq with the ID ${req.params.faqID}`
            })
        }

        return res.json({
            success: true,
            faq: faq
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({
                success: false,
                msg: `Error retrieving faq with ID ${req.params.faqID}.`
            })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const faq = await FAQs.findByIdAndUpdate(req.params.faqID, req.body).exec();

        if (!faq) {
            return res.status(404).json({
                message: `Cannot update faq with id=${req.params.faqID}. Please check if this already exists.`
            });
        }

        return res.status(200).json({
            message: `faq updated successfully!`
        });

        return
    } catch (err) {
        return res.status(500).json({ err });
    }
}

exports.delete = async (req, res) => {
    try {
        const faq = await FAQs.findByIdAndRemove(req.params.faqID).exec()

        if (!faq) {
            return res.status(404).json({
                message: `It is not possible to delete the faq with id=${req.params.faqID} as it does not exist.`
            });
        } else {
            return res.status(200).json({
                message: `faq with id=${req.params.faqID} was successfully deleted!`
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: `Error deleting faq with id=${req.params.faqID}`
        });
    };
}