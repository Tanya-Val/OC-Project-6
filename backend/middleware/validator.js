const {body, validationResult} = require('express-validator');
const saucePropertyInputs = () => {
    return [
        body('name').trim().escape(),
        body('manufacturer').trim().escape(),
        body('description').trim().escape(),
        body('mainPepper').trim().escape()
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = {
    saucePropertyInputs,
    validate,
};