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
utilities.isAdmin,
[
    body('name').notEmpty().escape(),
], (req, res) => {
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
 * @returns {object} 200 - List of techniques - e.g. [{name: "Geriatrics"}, {...}]
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/', (req, res) => {
    categoriesController.getAll(req, res);
})

/**
 * @route GET /categories/:categorieID
 * @group Categories
 * @param {object} id.patch - Category ID
 * @returns {object} 200 - Category searched by id - ex: {name: "Geriatrics"}
 * @returns {Error} 404 - Categorie does not exist/found
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/:categorieID', (req, res) => {
    categoriesController.findCategorie(req, res);
})

/**
 * @route PUT /categories/:categorieID
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
router.put('/:categorieID', utilities.isAdmin, (req, res) => {
    categoriesController.update(req, res);
})

/**
 * @route DELETE /categories/:categorieID
 * @group Categories
 * @param {object} id.patch - Category ID
 * @returns {object} 204 - Category deleted
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - Category does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.delete('/:categorieID', utilities.isAdmin, (req, res) => {
    categoriesController.delete(req, res);
})

module.exports = router;