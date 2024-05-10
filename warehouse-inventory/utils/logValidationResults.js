import { validationResult } from 'express-validator';

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
    } else {
        console.log('No validation errors.');
    }
    next();
};
