import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const searchProfiles = createAsyncThunk(
    'search/searchProfiles',
    async (params, { rejectWithValue }) => {
        try {
            const { criteria, page = 0, size = 20 } = params;
            const response = await api.post(`/profiles/search?page=${page}&size=${size}`, criteria);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const searchByProfileId = createAsyncThunk(
    'search/searchByProfileId',
    async (profileId, { rejectWithValue }) => {
        try {
            const response = await api.post('/profiles/search', { profileId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        results: [],
        totalPages: 0,
        totalElements: 0,
        page: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearResults: (state) => {
            state.results = [];
            state.totalPages = 0;
            state.totalElements = 0;
            state.page = 0;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload.content || [];
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
                state.page = action.payload.number;
            })
            .addCase(searchProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchByProfileId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchByProfileId.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload.content || action.payload; // Handle both page or list if needed
            })
            .addCase(searchByProfileId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;
