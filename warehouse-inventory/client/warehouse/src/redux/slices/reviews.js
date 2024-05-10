import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Асинхронные действия
export const fetchReviewsById = createAsyncThunk('reviews/fetchReviews', async (id) => {
    const { data } = await axios.get(`/check/${id}/reviews`);
    return data;
});

export const createReview = createAsyncThunk('reviews/createReview', async (reviewData) => {
    const { data } = await axios.post('/review/create', reviewData);
    return data;
});

export const updateReview = createAsyncThunk('reviews/updateReview', async ({ id, updatedData }) => {
    const { data } = await axios.patch(`/review/update/${id}`, updatedData);
    return data;
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id) => {
    await axios.delete(`/review/delete/${id}`);
    return id;
});

const initialState = {
    review: [],
    currentReview: null,
    status: 'idle',
    error: null
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewsById.pending, (state) => {
                state.currentReview = null;
                state.status = 'loading';
            })
            .addCase(fetchReviewsById.fulfilled, (state, action) => {
                state.currentReview = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchReviewsById.rejected, (state, action) => {
                state.currentReview = null;
                state.status = 'failed';
                state.error = action.error.message;
            })
            
            .addCase(createReview.fulfilled, (state, action) => {
                state.review.push(action.payload);
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.review.findIndex(employee => employee._id === action.payload._id);
                if (index !== -1) {
                    state.review[index] = action.payload;
                }
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.review = state.review.filter(employee => employee._id !== action.payload);
            });
    }
});

export const reviewReducer = reviewSlice.reducer;