import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const BASE_URL = "http://localhost:8181/api/activitylog";

export const fetchActivityLogs = createAsyncThunk('activityLog/fetchActivityLogs', async (token) => {
    // every logged-in account (admin or user) only fetches its OWN activity
    const authToken = token || localStorage.getItem('token')
    const config = authToken ? { headers: { 'Authorization': authToken } } : undefined
    const response = await axios.get(`${BASE_URL}/my`, config)
    return response.data
})

export const addActivityLog = createAsyncThunk('activityLog/addActivityLog', async (data) => {
    const authToken = data.token || localStorage.getItem('token')
    const config = authToken ? { headers: { 'Authorization': authToken } } : undefined
    const response = await axios.post(`${BASE_URL}/create`, data.log, config)
    return response.data
})

export const updateActivityLog = createAsyncThunk('activityLog/updateActivityLog', async (data) => {
    const authToken = data.token || localStorage.getItem('token')
    const config = authToken ? { headers: { 'Authorization': authToken } } : undefined
    const response = await axios.put(`${BASE_URL}/update/${data.id}`, data.log, config)
    return response.data
})

export const deleteActivityLog = createAsyncThunk('activityLog/deleteActivityLog', async (data) => {
    const authToken = data.token || localStorage.getItem('token')
    const config = authToken ? { headers: { 'Authorization': authToken } } : undefined
    await axios.delete(`${BASE_URL}/delete/${data.id}`, config)
    return data.id
})

const initialState = {
    logs: [],
    status: 'idle',
    error: null
}

export const activityLogSlice = createSlice({

    name: "activityLog",
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(fetchActivityLogs.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.logs = action.payload
            })
            .addCase(fetchActivityLogs.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addActivityLog.fulfilled, (state, action) => {
                // newest entries are shown first, so the new log goes on top
                state.logs.unshift(action.payload)
            })
            .addCase(updateActivityLog.fulfilled, (state, action) => {
                state.logs = state.logs.map(log => log.id === action.payload.id ? action.payload : log)
            })
            .addCase(deleteActivityLog.fulfilled, (state, action) => {
                state.logs = state.logs.filter(log => log.id !== action.payload)
            })

    }
})

export const getAllActivityLogs = (state) => state.activityLogs.logs
export const getActivityLogStatus = (state) => state.activityLogs.status
export const getActivityLogError = (state) => state.activityLogs.error

export default activityLogSlice.reducer
