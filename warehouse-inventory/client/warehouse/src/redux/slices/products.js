import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const { data } = await axios.get('/products');
    return data;
});

export const fetchProductsById = createAsyncThunk('products/fetchProductsById', async (id) => {
    const { data } = await axios.get(`/products/${id}`);
    return data;
});

export const fetchProductsByCategoryId = createAsyncThunk('products/fetchProductsByCategoryId', async (id) => {
    const { data } = await axios.get(`/products/category/${id}`);
    return data;
});

export const createProducts = createAsyncThunk('products/createProducts', async (productsData) => {
    const { data } = await axios.post('/products/create', productsData);
    return data;
});

export const updateProducts = createAsyncThunk('products/updateProducts', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/products/update/${id}`, updatedData);
    return data;
});

export const deleteProducts = createAsyncThunk('products/deleteProducts', async (id) => {
    await axios.delete(`/products/delete/${id}`);
    return id;
});

const initialState = {
    products: [],
    currentproducts: null,
    status: 'idle',
    error: null
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchProductsById.pending, (state) => {
                state.currentproducts = null;
                state.status = 'loading';
            })
            .addCase(fetchProductsById.fulfilled, (state, action) => {
                state.currentproducts = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchProductsById.rejected, (state, action) => {
                state.currentproducts = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchProductsByCategoryId.pending, (state) => {
                state.currentproducts = null;
                state.status = 'loading';
            })
            .addCase(fetchProductsByCategoryId.fulfilled, (state, action) => {
                state.currentproducts = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchProductsByCategoryId.rejected, (state, action) => {
                state.currentproducts = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createProducts.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProducts.fulfilled, (state, action) => {
                const index = state.products.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProducts.fulfilled, (state, action) => {
                state.products = state.products.filter(employee => employee._id !== action.payload);
            });
    }
});

export const productsReducer = productsSlice.reducer;