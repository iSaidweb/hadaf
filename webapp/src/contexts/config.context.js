import { createSlice } from "@reduxjs/toolkit";

const configContext = createSlice({
    name: 'config',
    initialState: {
        loading: false,
        refresh: false,
    },
    reducers: {
        runLoad: (state)=>{
            state.loading = true;
        },
        stopLoad: (state)=>{
            state.loading = false;
        },
        runRefresh: (state)=>{
            state.refresh = !state.refresh;
        }
    }
});
export const {runLoad, runRefresh, stopLoad} = configContext.actions;
export default configContext.reducer