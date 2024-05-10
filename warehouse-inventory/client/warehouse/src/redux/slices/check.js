import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchChecks = createAsyncThunk('checks/fetchChecks', async () => {
    const { data } = await axios.get('/check');
    return data;
});

export const fetchChecksById = createAsyncThunk('checks/fetchChecksById', async (id) => {
    const { data } = await axios.get(`/check/${id}`);
    return data;
});

export const createCheck = createAsyncThunk('checks/createCheck', async (checksData) => {
    const { data } = await axios.post('/check/create', checksData);
    return data;
});

export const updateCheck = createAsyncThunk('checks/updateCheck', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/check/update/${id}`, updatedData);
    return data;
});

export const deleteCheck = createAsyncThunk('checks/deleteCheck', async (id) => {
    await axios.delete(`/check/delete/${id}`);
    return id;
});

const initialState = {
    checks: [],
    currentCheck: null,
    status: 'idle',
    error: null
};

const checksSlice = createSlice({
    name: 'checks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChecks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChecks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.checks = action.payload;
            })
            .addCase(fetchChecks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchChecksById.pending, (state) => {
                state.currentCheck = null;
                state.status = 'loading';
            })
            .addCase(fetchChecksById.fulfilled, (state, action) => {
                state.currentCheck = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchChecksById.rejected, (state, action) => {
                state.currentCheck = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createCheck.fulfilled, (state, action) => {
                state.checks.push(action.payload);
            })
            .addCase(updateCheck.fulfilled, (state, action) => {
                const index = state.checks.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.checks[index] = action.payload;
                }
            })
            .addCase(deleteCheck.fulfilled, (state, action) => {
                state.checks = state.checks.filter(employee => employee._id !== action.payload);
            });
    }
});

export const checksReducer = checksSlice.reducer;