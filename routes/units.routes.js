const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/units.controller.js')
const { validationResult, body } = require('express-validator')
const utilities = require('../utilities/utilities.js');

/**
 * @route POST /units
 * @group Units
 * @param {object} object.body - Form to add units - e.g. {"title":"unit name", "video": "video.mp4", "slide": "unitslides.pdf", "description": "blablabla", "exercises": [{
        "Group": 1,
        "questions": [{
            "question": "blabla",
            "response": "bla:)",
            "alternatives": ["a", "b", "c", "d"]
        }, {
            "question": "blabla",
            "response": "bla:)",
            "alternatives": ["a", "b", "c", "d"]
        }]
    }, {
        "Group": 2,
        "questions": [{
            "question": "blabla",
            "response": "bla:)"
        }, {
            "question": "blabla",
            "response": "bla:)"
        }]
    }]}
 * @returns {object} 201 - New units created successfully!
 * @returns {Error} 400 - Missing data
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.post('/',
    utilities.validateToken,
    [
        body('title').notEmpty().escape(),
        body('description').notEmpty().escape(),
    ], (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            unitsController.create(req, res);
        } else {
            res.status(404).json({
                errors: errors.array()
            });
        }
    })
    
/**
 * @route GET /units/:unitID
 * @group Units
 * @param {object} id.patch - Unit ID
 * @returns {object} 200 - Unit searched by id e.g. {"title":"unit name", "video": "video.mp4", "slide": "unitslides.pdf", "description": "blablabla", "exercises": [{
        "Group": 1,
        "questions": [{
            "question": "blabla",
            "response": "bla:)",
            "alternatives": ["a", "b", "c", "d"]
        }, {
            "question": "blabla",
            "response": "bla:)",
            "alternatives": ["a", "b", "c", "d"]
        }]
    }, {
        "Group": 2,
        "questions": [{
            "question": "blabla",
            "response": "bla:)"
        }, {
            "question": "blabla",
            "response": "bla:)"
        }]
    }]}
 * @returns {Error} 404 - Unit does not exist/found
 * @returns {Error} 500 - Something wrong happened
 */
router.get('/:unitID', utilities.validateToken, (req, res) => {
    unitsController.findUnit(req, res);
})

/**
 * @route PUT /units/:unitID
 * @group Units
 * @param {object} object.body - Change the unit
 * @param {object} id.patch - Unit ID
 * @returns {object} 200 - Unit changed
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - Unit does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.put('/:unitID', utilities.validateToken, (req, res) => {
    unitsController.update(req, res);
})

/**
 * @route DELETE /units/:unitID
 * @group Units
 * @param {object} id.patch - Unit ID
 * @returns {object} 204 - Unit deleted
 * @returns {Error} 401 - You need to be authenticated
 * @returns {Error} 403 - User without permission
 * @returns {Error} 404 - Unit does not exist/ was not found
 * @returns {Error} 500 - Something wrong happened
 * @security Bearer
 */
router.delete('/:unitID', utilities.validateToken, (req, res) => {
    unitsController.delete(req, res);
})

module.exports = router;