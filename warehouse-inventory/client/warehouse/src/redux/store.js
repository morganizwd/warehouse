import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { supplierReducer } from './slices/supplier';
import { warehouseReducer } from './slices/warehouse';
import { storageLocationReducer } from './slices/storageLocation';
import { reviewReducer } from './slices/reviews';
import { productsReducer } from './slices/products';
import { checksReducer } from './slices/check';
import { categoriesReducer } from './slices/categories';

const store = configureStore({
    reducer: {
        auth: authReducer,
        supplier: supplierReducer,
        warehouse: warehouseReducer,
        storageLocation: storageLocationReducer,
        review: reviewReducer,
        products: productsReducer,
        checks: checksReducer,
        categories: categoriesReducer,
    }
});

export default store;