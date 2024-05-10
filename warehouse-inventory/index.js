import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    allRolesAuth,
    adminOnlyAuth,
    handleValidationErrors,
    logRequestData,
    logValidationResults,
} from './utils/index.js';

import {
    userController,
    checkController,
    reviewController,
    productController,
    categoryContoller,
    supplierController,
    wareHouseController,
    storageLocationController,
} from './controllers/index.js';

import {
    loginValidation,
    registerValidation,
    createWareHouseValidation,
    updateWareHouseValidation,
    createSupplierValidation,
    updateSupplierValidation,
    createStorageLocationValidation,
    updateStorageLocationValidation,
    createReviewValidation,
    updateReviewValidation,
    createProductValidation,
    updateProductValidation,
    createCheckValidation,
    updateCheckValidation,
    createCategoryValidation,
    updateCategoryValidation,
} from './validations.js'

mongoose
    .connect('mongodb+srv://admin:Hesus2016@cluster0.vgtv5yo.mongodb.net/WareHouse')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

// mongoose
//     .connect('mongodb+srv://dimacarikov:hehehe@cluster0.orkhxfy.mongodb.net/WareHouse')
//     .then(() => console.log('DB OK'))
//     .catch((err) => console.log('DB ERROR', err));


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// media upload pathes
app.post('/upload', adminOnlyAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//auth
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', allRolesAuth, userController.getMe);
app.get('/user/:userId', allRolesAuth, userController.getUserById);

//warehouse
app.post('/warehouse/create', adminOnlyAuth, createWareHouseValidation, handleValidationErrors, wareHouseController.create)
app.get('/warehouse', allRolesAuth, wareHouseController.getAll);
app.get('/warehouse/:id', allRolesAuth, wareHouseController.getOne);
app.patch('/warehouse/update/:id', adminOnlyAuth, updateWareHouseValidation, wareHouseController.update);
app.delete('/warehouse/delete/:id', adminOnlyAuth, wareHouseController.remove);

//supplier
app.post('/supplier/create', adminOnlyAuth, createSupplierValidation, handleValidationErrors, supplierController.create);
app.get('/supplier', allRolesAuth, supplierController.getAll);
app.get('/supplier/:id', allRolesAuth, supplierController.getOne);
app.patch('/supplier/update/:id', adminOnlyAuth, updateSupplierValidation, handleValidationErrors, supplierController.update);
app.delete('/supplier/delete/:id', adminOnlyAuth, supplierController.remove);   

//storage location
app.post('/storage-location/create', adminOnlyAuth, createStorageLocationValidation, handleValidationErrors, storageLocationController.create);
app.get('/storage-location', allRolesAuth, storageLocationController.getAll);
app.get('/storage-location/:id', allRolesAuth, storageLocationController.getOne);
app.patch('/storage-location/update/:id', adminOnlyAuth, updateStorageLocationValidation, handleValidationErrors, storageLocationController.update);
app.delete('/storage-location/delete/:id', adminOnlyAuth, storageLocationController.remove);

//reviews
app.post('/review/create', allRolesAuth, createReviewValidation, handleValidationErrors, reviewController.create);
app.delete('/review/delete/:id', adminOnlyAuth, reviewController.remove);
app.get('/check/:id/reviews', allRolesAuth, reviewController.getAll);
app.patch('/review/update/:id', adminOnlyAuth, updateReviewValidation, handleValidationErrors, reviewController.update);

//prodocts  
app.post('/products/create', allRolesAuth, createProductValidation, handleValidationErrors, productController.create);
app.patch('/products/update/:id', allRolesAuth, updateProductValidation, handleValidationErrors, productController.update);
app.delete('/products/delete/:id', allRolesAuth, productController.remove);
app.get('/products/:id', allRolesAuth, productController.getOne);
app.get('/products', allRolesAuth, productController.getAll)
app.get('/products/category/:categoryId', allRolesAuth, productController.getByCategory);

//check
app.post('/check/create', allRolesAuth, createCheckValidation, handleValidationErrors, checkController.create);
app.get('/check', allRolesAuth, checkController.getAll);
app.get('/check/:id', allRolesAuth, checkController.getOne);
app.patch('/check/update/:id', allRolesAuth, updateCheckValidation, handleValidationErrors, checkController.update);
app.delete('/check/delete/:id', allRolesAuth, checkController.remove);

//categories
app.post('/categories/create', adminOnlyAuth, createCategoryValidation, handleValidationErrors, categoryContoller.create);
app.patch('/categories/update/:id', adminOnlyAuth, updateCategoryValidation, handleValidationErrors, categoryContoller.update);
app.delete('/categories/delete/:id', adminOnlyAuth, categoryContoller.remove);
app.get('/categories/:id', allRolesAuth, categoryContoller.getOne);
app.get('/categories', allRolesAuth, categoryContoller.getAll); 

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});