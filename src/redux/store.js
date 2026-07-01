import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import aiReducer from "./slices/aiSlice.js";


const store = configureStore({
    reducer: {
        auth: authReducer,
        ai: aiReducer
    },

    devTools: true
});

export default store;