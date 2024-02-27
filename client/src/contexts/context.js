import { configureStore } from "@reduxjs/toolkit";
import configContext from "./config.context";
import langContext from "./lang.context";

export default configureStore({
    reducer: {
        config: configContext,
        lang: langContext
    }
})