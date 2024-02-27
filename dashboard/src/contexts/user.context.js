import { createSlice } from "@reduxjs/toolkit";

const userContext = createSlice({
    name: 'user',
    initialState: {
        name: '',
        phone: '',
        _id: '',
        role: ''
    },
    reducers: {
        updateUser: (state, { payload }) => {
            state._id = payload?._id;
            state.name = payload?.name;
            state.phone = payload?.phone;
            state.role = payload?.role;
        },
        clearUser: (state)=>{
            state.name = '';
            state.phone = '';
            state._id = '';
            state.role = '';
        }
    }
});
export const {updateUser, clearUser} = userContext.actions;
export default userContext.reducer