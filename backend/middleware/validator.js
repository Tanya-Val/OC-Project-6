// Import the necessary modules
const {body, validationResult} = require('express-validator');

// Returns an array of Express validator middleware for validating sauce properties
const saucePropertyInputs = () => {
    return [
        body('name').trim().escape(),
        body('manufacturer').trim().escape(),
        body('description').trim().escape(),
        body('mainPepper').trim().escape()
    ];
};

//Validates the Express request using the validationResult function
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // If there are errors, put errors to an array of objects containing the name and error message
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

// Export the two middleware functions as an object
module.exports = {
    saucePropertyInputs,
    validate,
};

//-----End------