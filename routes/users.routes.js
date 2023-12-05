const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js')

/**
 * @route POST /users/login
 * @group Users
 * @param {object} object.body - User credentials - ex. {"email":"admin@email.com" "password":"12345"}
 * @returns {object} 200 - Bearer Token
 * @returns {Error} 400 - Missing credentials
 * @returns {Error} 401 - Incorrect credentials
 * @returns {Error} 500 - Something went wrong
 */
router.post('/login', (req, res) => {
    userController.login(req, res)
})

/**
 * @route POST /users/register
 * @group Users
 * @param {object} object.body - Form to create user - ex. {"name":"admin", "email": "user@example.com", "password":"1234"} 
 * @returns {object} 201 - New User created successfully.
 * @returns {Error} 400 - Missing data
 * @returns {Error} 500 - Something went wrong
 */
router.post('/register', [
    body('name').notEmpty().escape(),
    body('password').notEmpty().escape(),
    body('email').notEmpty().isEmail(),
], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userController.register(req, res);
    } else {
        res.status(404).json({ errors: errors.array() });
    }
})

/**
 * @route GET /users/
 * @group Users
 * @returns {object} 200 - User list - ex. [{"name":"admin", "type":"admin", "completedCourses": 10, "creationUser": "2023-11-29", "actived": "true"}, {...}]
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 500 - Something went wrong
 * @security Bearer
 */
router.get('/', utilities.isAdmin, (req, res) => {
    userController.getAll(req, res);
})

/**
 * @route GET /users/:userID
 * @group Users
 * @param {object} id.path - User ID
 * @returns {object} 200 - User information searched by id - ex. {tratar depois} 
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - User does not exist/found
 * @returns {Error} 500 - Something went wrong
 * @security Bearer
 */
router.get('/:userID', utilities.validateToken, (req, res) => {
    userController.findUser(req, res);
})

/**
 * @route PUT /users/:userID
 * @group Users
 * @param {object} object.body - Altera as informações do utilizador - ex. {"password": "123456", "email": "adim@example.com", "image": "image.jpg", "description": "blablablablabla", "type": "admin"}
 * @param {object} id.path - User ID
 * @returns {object} 200 - User changed
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - User does not exist/found
 * @returns {Error} 500 - Something went wrong
 * @security Bearer
 */
router.put('/:userID', utilities.validateToken, (req, res) => {
    userController.update(req, res);
})

module.exports = router;