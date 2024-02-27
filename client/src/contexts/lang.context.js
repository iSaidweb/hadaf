import { createSlice } from "@reduxjs/toolkit";
import uz from "../langs/uz";
import en from "../langs/en";

const langContext = createSlice({
    name: 'lang',
    initialState: {
        current: !localStorage?.lang || localStorage?.lang === 'uz' ? uz : en
    },
    reducers: {
        updateLang: (state, { paylaod }) => {
            localStorage.setItem('lang', paylaod)
            if (paylaod === 'uz') {
                state.current = uz;
            } else if (paylaod === 'en') {
                state.current = en;
            }
        }
    }
});
export const {updateLang} = langContext.actions;
export default langContext.reducer