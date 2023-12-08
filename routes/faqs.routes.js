const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqs.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /faqs
 * @group faqs
 * @param {object} object.body - Form to add faq - e.g. {"question":"question...", "description": "blablabla", "image": "image.jpg", "categories": ["a", "b", "c"], "userCreated": "admin"}
 * @returns {object} 201 - New faq created successfully!
 * @returns {Error} 400 - Missing data
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.post('/',
    [
        body('question').notEmpty().escape(),
        body('description').notEmpty().escape(),
        body('categories').notEmpty().escape(),
        body('user').notEmpty().escape(),
    ], utilities.validateToken, async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            faqController.create(req, res);
        } else {
            res.status(404).json({
                errors: errors.array()
            });
        }
    })

/**
 * @route GET /faqs
 * @group faqs
 * @returns {object} 200 - List of faqs - e.g. [{"question":"question...", "description": "blablabla", "categories": ["a", "b", "c"], "userCreated": "admin", "createdFaq": "2023-12-07"}, {...}]
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/', (req, res) => {
    faqController.getAll(req, res);
})

/**
 * @route GET /faqs/:faqID
 * @group faqs
 * @param {object} id.patch - faq ID
 * @returns {object} 200 - faq searched by id - ex: {"question":"question...", "description": "blablabla", "image": "image.jpg", "categories": ["a", "b", "c"], "userCreated": "admin", "createdFaq": "2023-12-07", "answers": [{"user": "user", comment": "blablabla", "votes": 5}]}
 * @returns {Error} 404 - faq does not exist/found
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/:faqID', utilities.validateToken, (req, res) => {
    faqController.findFaq(req, res);
})

/**
 * @route PUT /faqs/:faqID
 * @group faqs
 * @param {object} object.body - Change the faq name - e.g. {"answers": [{"user": "user", comment": "blablabla", "votes": 5}} 
 * @param {object} id.patch - faq ID
 * @returns {object} 200 - faq changed
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - faq does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.put('/:faqID', utilities.validateToken, (req, res) => {
    faqController.update(req, res);
})

/**
 * @route DELETE /faqs/:faqID
 * @group faqs
 * @param {object} id.patch - faq ID
 * @returns {object} 204 - faq deleted
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - faq does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.delete('/:faqID', utilities.validateToken, (req, res) => {
    faqController.delete(req, res);
})

module.exports = router;