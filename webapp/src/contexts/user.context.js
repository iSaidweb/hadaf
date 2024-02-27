import { createSlice } from "@reduxjs/toolkit";
import uz from "../langs/uz";
import ru from "../langs/ru";
import en from "../langs/en";
import cy from "../langs/cy";
const userContext = createSlice({
    name: 'user',
    initialState: {
        lang: uz,
    },
    reducers: {
        updateLang: (state, { payload }) => {
            state.lang = payload === 'uz' ? uz : payload === 'ru' ? ru : payload === 'en' ? en : cy;
        }
    }
});
export const { updateLang } = userContext.actions;
export default userContext.reducer