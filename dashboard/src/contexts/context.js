import { configureStore } from "@reduxjs/toolkit";
import userContext from "./user.context";
import configContext from "./config.context";

export default configureStore({
    reducer: {
        user: userContext,
        config: configContext
    }
})