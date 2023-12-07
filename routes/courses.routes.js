const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /courses
 * @group courses
 * @param {object} object.body - Form to add course - e.g. {"title":"course name"}
 * @returns {object} 201 - New course created successfully!
 * @returns {Error} 400 - Missing data
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.post('/',
    [
        body('title').notEmpty().escape(),
        body('units').notEmpty().escape(),
        body('categories').notEmpty().escape(),
        body('description').notEmpty().escape(),
        body('certificate').notEmpty().escape(),
        body('time').notEmpty().escape(),
    ], utilities.validateToken, async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            coursesController.create(req, res);
        } else {
            res.status(404).json({
                errors: errors.array()
            });
        }
    })

/**
 * @route GET /courses
 * @group courses
 * @returns {object} 200 - List of courses - e.g. [{name: "Geriatrics"}, {...}]
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/', (req, res) => {
    coursesController.getAll(req, res);
})

/**
 * @route GET /courses/:courseID
 * @group courses
 * @param {object} id.patch - course ID
 * @returns {object} 200 - course searched by id - ex: {name: "Geriatrics"}
 * @returns {Error} 404 - course does not exist/found
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/:courseID', utilities.validateToken, (req, res) => {
    coursesController.findCourse(req, res);
})

/**
 * @route PUT /courses/:courseID
 * @group courses
 * @param {object} object.body - Change the course name - e.g. {"name":"course name"} 
 * @param {object} id.patch - course ID
 * @returns {object} 200 - course changed
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - course does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.put('/:courseID', utilities.validateToken, (req, res) => {
    coursesController.update(req, res);
})

/**
 * @route DELETE /courses/:courseID
 * @group courses
 * @param {object} id.patch - course ID
 * @returns {object} 204 - course deleted
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - course does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.delete('/:courseID', utilities.validateToken, (req, res) => {
    coursesController.delete(req, res);
})

module.exports = router;