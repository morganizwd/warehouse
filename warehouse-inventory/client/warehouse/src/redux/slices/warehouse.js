import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchWarehouse = createAsyncThunk('warehouse/fetchWarehouse', async () => {
    const { data } = await axios.get('/warehouse');
    return data;
});

export const fetchWarehouseById = createAsyncThunk('warehouse/fetchWarehouseById', async (id) => {
    const { data } = await axios.get(`/warehouse/${id}`);
    return data;
});

export const createWarehouse = createAsyncThunk('warehouse/createWarehouse', async (warehouseDate) => {
    const { data } = await axios.post('/warehouse/create', warehouseDate);
    return data;
});

export const updateWarehouse = createAsyncThunk('warehouse/updateWarehouse', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/warehouse/update/${id}`, updatedData);
    return data;
});

export const deleteWarehouse = createAsyncThunk('warehouse/deleteWarehouse', async (id) => {
    await axios.delete(`/warehouse/delete/${id}`);
    return id;
});

const initialState = {
    warehouse: [],
    currentWarehouse: null,
    status: 'idle',
    error: null
};

const warehouseSlice = createSlice({
    name: 'warehouse',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWarehouse.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWarehouse.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.warehouse = action.payload;
            })
            .addCase(fetchWarehouse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchWarehouseById.pending, (state) => {
                state.currentWarehouse = null;
                state.status = 'loading';
            })
            .addCase(fetchWarehouseById.fulfilled, (state, action) => {
                state.currentWarehouse = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchWarehouseById.rejected, (state, action) => {
                state.currentWarehouse = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createWarehouse.fulfilled, (state, action) => {
                state.warehouse.push(action.payload);
            })
            .addCase(updateWarehouse.fulfilled, (state, action) => {
                const index = state.warehouse.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.warehouse[index] = action.payload;
                }
            })
            .addCase(deleteWarehouse.fulfilled, (state, action) => {
                state.warehouse = state.warehouse.filter(employee => employee._id !== action.payload);
            });
    }
});

export const warehouseReducer = warehouseSlice.reducer;