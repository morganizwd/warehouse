import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchSupplier = createAsyncThunk('supplier/fetchSupplier', async () => {
    const { data } = await axios.get('/supplier');
    return data;
});

export const fetchSupplierById = createAsyncThunk('supplier/fetchSupplierById', async (id) => {
    const { data } = await axios.get(`/supplier/${id}`);
    return data;
});

export const createSupplier = createAsyncThunk('supplier/createSupplier', async (supplierDate) => {
    const { data } = await axios.post('/supplier/create', supplierDate);
    return data;
});

export const updateSupplier = createAsyncThunk('supplier/updateSupplier', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/supplier/update/${id}`, updatedData);
    return data;
});

export const deleteSupplier = createAsyncThunk('supplier/deleteSupplier', async (id) => {
    await axios.delete(`/supplier/delete/${id}`);
    return id;
});

const initialState = {
    supplier: [],
    currentSupplier: null,
    status: 'idle',
    error: null
};

const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSupplier.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSupplier.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.supplier = action.payload;
            })
            .addCase(fetchSupplier.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSupplierById.pending, (state) => {
                state.currentSupplier = null;
                state.status = 'loading';
            })
            .addCase(fetchSupplierById.fulfilled, (state, action) => {
                state.currentSupplier = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchSupplierById.rejected, (state, action) => {
                state.currentSupplier = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.supplier.push(action.payload);
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                const index = state.supplier.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.supplier[index] = action.payload;
                }
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.supplier = state.supplier.filter(employee => employee._id !== action.payload);
            });
    }
});

export const supplierReducer = supplierSlice.reducer;