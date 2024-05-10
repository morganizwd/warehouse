import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchStorageLocation = createAsyncThunk('storage-location/fetchStorageLocation', async () => {
    const { data } = await axios.get('/storage-location');
    return data;
});

export const fetchStorageLocationById = createAsyncThunk('storage-location/fetchStorageLocationById', async (id) => {
    const { data } = await axios.get(`/storage-location/${id}`);
    return data;
});

export const createStorageLocation = createAsyncThunk('storage-location/createStorageLocation', async (storageLocationData) => {
    const { data } = await axios.post('/storage-location/create', storageLocationData);
    return data;
});

export const updateStorageLocation = createAsyncThunk('storage-location/updateStorageLocation', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/storage-location/update/${id}`, updatedData);
    return data;
});

export const deleteStorageLocation = createAsyncThunk('storage-location/deleteStorageLocation', async (id) => {
    await axios.delete(`/storage-location/delete/${id}`);
    return id;
});

const initialState = {
    storageLocation: [],
    currentStorageLocation: null,
    status: 'idle',
    error: null
};

const storageLocationSlice = createSlice({
    name: 'storageLocation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStorageLocation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStorageLocation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.storageLocation = action.payload;
            })
            .addCase(fetchStorageLocation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchStorageLocationById.pending, (state) => {
                state.currentStorageLocation = null;
                state.status = 'loading';
            })
            .addCase(fetchStorageLocationById.fulfilled, (state, action) => {
                state.currentStorageLocation = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchStorageLocationById.rejected, (state, action) => {
                state.currentStorageLocation = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createStorageLocation.fulfilled, (state, action) => {
                state.storageLocation.push(action.payload);
            })
            .addCase(updateStorageLocation.fulfilled, (state, action) => {
                const index = state.storageLocation.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.storageLocation[index] = action.payload;
                }
            })
            .addCase(deleteStorageLocation.fulfilled, (state, action) => {
                state.storageLocation = state.storageLocation.filter(employee => employee._id !== action.payload);
            });
    }
});

export const storageLocationReducer = storageLocationSlice.reducer;