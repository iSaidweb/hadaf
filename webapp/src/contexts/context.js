import { configureStore } from "@reduxjs/toolkit";
import configContext from "./config.context";
import userContext from "./user.context";

export default configureStore({
    reducer: {
        config: configContext,
        user: userContext
    }
})