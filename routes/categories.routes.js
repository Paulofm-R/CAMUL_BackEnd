const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /categories
 * @group Categories
 * @param {object} object.body - Form to add category - e.g. {"name":"category name"}
 * @returns {object} 201 - New category created successfully!
 * @returns {Error} 400 - Missing data
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.post('/', 
[
    body('name').notEmpty().escape(),
], async (req, res) => {
    await utilities.isAdmin;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        categoriesController.create(req, res);
    } else {
        res.status(404).json({
            errors: errors.array()
        });
    }
})

/**
 * @route GET /categories
 * @group Categories
 * @returns {object} 200 - List of categories - e.g. [{name: "Geriatrics"}, {...}]
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/', (req, res) => {
    categoriesController.getAll(req, res);
})

/**
 * @route GET /categories/:categoryID
 * @group Categories
 * @param {object} id.patch - Category ID
 * @returns {object} 200 - Category searched by id - ex: {name: "Geriatrics"}
 * @returns {Error} 404 - Categorie does not exist/found
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/:categoryID', (req, res) => {
    categoriesController.findCategory(req, res);
})

/**
 * @route PUT /categories/:categoryID
 * @group Categories
 * @param {object} object.body - Change the category name - e.g. {"name":"category name"} 
 * @param {object} id.patch - Category ID
 * @returns {object} 200 - Category changed
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - Category does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.put('/:categoryID', async (req, res) => {
    await utilities.isAdmin;
    categoriesController.update(req, res);
})

/**
 * @route DELETE /categories/:categoryID
 * @group Categories
 * @param {object} id.patch - Category ID
 * @returns {object} 204 - Category deleted
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - Category does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.delete('/:categoryID', async (req, res) => {
    await utilities.isAdmin;
    categoriesController.delete(req, res);
})

module.exports = router;