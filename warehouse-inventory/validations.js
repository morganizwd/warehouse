import { body, param } from 'express-validator';

//auth validation
export const loginValidation = [
    body('phoneNumber', 'Invalid phone number format').notEmpty(),
    body('password', 'Password shoud be at least 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
    body('phoneNumber', 'Invalid phone number format').notEmpty(),
    body('password', 'Password should be at least 8 symbols').isLength({ min: 8 }),
    body('name', 'Name is too short').isLength({ min: 2 }),
    body('role', 'Invalid role').custom((value) => {
        const roles = ['manager', 'admin'];
        if (!roles.includes(value)) {
            throw new Error('Invalid role');
        }
        return true;
    }),
];

export const createWareHouseValidation = [
    body('name', 'Name is required and should not exceed 32 characters').notEmpty().isLength({ max: 32 }),
    body('address', 'Address is required and should not exceed 32 characters').notEmpty().isLength({ max: 32 }),
    body('imageUrl', 'Invalid URL format for image').optional(),
];

export const updateWareHouseValidation = [
    body('name', 'Name should not exceed 32 characters').optional().isLength({ max: 32 }),
    body('address', 'Address should not exceed 32 characters').optional().isLength({ max: 32 }),
    body('imageUrl', 'Invalid URL format for image').optional(),
];

export const createSupplierValidation = [
    body('companyName', 'Company name is required and should not exceed 32 characters').notEmpty().isLength({ max: 132 }),
    body('address', 'Address is required and should not exceed 32 characters').notEmpty().isLength({ max: 132 }),
    body('phoneNumber', 'Invalid phone number format').notEmpty(),
    body('imageUrl', 'Invalid URL format for image').optional(),
];

export const updateSupplierValidation = [
    body('companyName', 'Company name should not exceed 32 characters').optional().isLength({ max: 132 }),
    body('address', 'Address should not exceed 32 characters').optional().isLength({ max: 132 }),
    body('phoneNumber', 'Invalid phone number format').optional().notEmpty(),
    body('imageUrl', 'Invalid URL format for image').optional(),
];

export const createStorageLocationValidation = [
    body('shelfNumber', 'Shelf number is required and must be a number').notEmpty().isNumeric(),
    body('warehouse', 'Warehouse ID must be a valid MongoID').isMongoId(),
];

export const updateStorageLocationValidation = [
    body('shelfNumber', 'Shelf number must be a number').optional().isNumeric(),
    body('warehouse', 'Warehouse ID must be a valid MongoID').optional().isMongoId(),
];

export const createReviewValidation = [
    body('check', 'Invalid check ID').isMongoId(),
    body('text', 'Review text is required').notEmpty(),
];

export const updateReviewValidation = [
    body('text', 'Review text must be a string').optional().isString(),
];

export const createProductValidation = [
    body('name', 'Product name is required').notEmpty(),
    body('description', 'Product description is required').notEmpty(),
    body('price', 'Product price must be a valid number').isNumeric(),
    body('amount', 'Product amount must be a valid number').isNumeric(),
    body('storageLocation', 'Storage location ID must be a valid MongoID').optional().isMongoId(),
    body('suplier', 'Supplier ID must be a valid MongoID').optional().isMongoId(),
    body('wareHouse', 'Warehouse ID must be a valid MongoID').optional().isMongoId(),
    body('imageUrl', 'Invalid URL format for image').optional(),
    body('categories', 'Categories must be an array').optional().isArray(),
    body('categories.*', 'Invalid category ID').optional().isMongoId(),
];

export const updateProductValidation = [
    body('name', 'Product name is required').optional().notEmpty(),
    body('description', 'Product description is required').optional().notEmpty(),
    body('price', 'Product price must be a valid number').optional().isNumeric(),
    body('amount', 'Product amount must be a valid number').optional().isNumeric(),
    body('storageLocation', 'Storage location ID must be a valid MongoID').optional().isMongoId(),
    body('suplier', 'Supplier ID must be a valid MongoID').optional().isMongoId(),
    body('wareHouse', 'Warehouse ID must be a valid MongoID').optional().isMongoId(),
    body('imageUrl', 'Invalid URL format for image').optional(),
    body('categories', 'Categories must be an array').optional().isArray(),
    body('categories.*', 'Invalid category ID').optional().isMongoId(),
];

export const createCheckValidation = [
    body('products', 'Products are required and must be an array')
        .exists().withMessage('Products field is required')
        .isArray().withMessage('Products field must be an array')
        .notEmpty().withMessage('Products array must not be empty'),
    body('products.*', 'Each product must be a valid MongoID')
        .isMongoId().withMessage('Invalid product ID format'),
];

export const updateCheckValidation = [
    body('products', 'Products must be an array')
        .optional()
        .isArray().withMessage('Products field must be an array'),
    body('products.*', 'Each product must be a valid MongoID')
        .optional()
        .isMongoId().withMessage('Invalid product ID format'),
];

export const createCategoryValidation = [
    body('name', 'Category name is required and should not be empty')
        .notEmpty().withMessage('Name field is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('description', 'Description is required and should not be empty')
        .notEmpty().withMessage('Description field is required')
        .isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters'),
];

export const updateCategoryValidation = [
    body('name', 'Name must be between 2 and 50 characters')
        .optional()
        .notEmpty().withMessage('Name field, if provided, cannot be empty')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('description', 'Description must be between 5 and 200 characters')
        .optional()
        .notEmpty().withMessage('Description field, if provided, cannot be empty')
        .isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters'),
];