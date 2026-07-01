import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    authChecked: false,
};

export const createAccount = createAsyncThunk("auth/signup", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/auth/user/signup", data);

        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (response) => {
                return response?.data?.message
            },
            error: "Failed to create your account"
        })

        return (await res).data;
    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

export const verifyUserEmail = createAsyncThunk("auth/verifyEmail", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/auth/user/verifyEmail", data);

        toast.promise(res, {
            loading: "Wait! otp is verifing",
            success: (response) => {
                return response.data?.message;
            },
            error: "Failed to verify"
        })

        return (await res).data;
    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

export const resendOtpToVerifyEmail = createAsyncThunk("auth/resendOtp", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/auth/user/resendOTP", data);

        toast.promise(res, {
            loading: "Wait! new otp is sending to your email",
            success: (response) => {
                return response.data?.message;
            },
            error: "Failed to resend otp please try again"
        })

        return (await res).data;
    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

export const userlogin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/auth/user/signin", data);

        toast.promise(res, {
            loading: "Wait! login to your account",
            success: (response) => {
                return response?.data?.message;
            },
            error: "Failed to login"
        })

        return (await res).data
    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }

})

export const getUserData = createAsyncThunk("user/details", async (_, { rejectWithValue }) => {
    try {
        const res = axiosInstance.get("auth/user/getUser");

        return (await res).data;
    } catch (err) {
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const res = axiosInstance.get("/auth/user/logout");

        toast.promise(res, {
            loading: "Wait! logout in processing...",
            success: (response) => {
                return response.data?.message;
            },
            error: "Failed to logout, Please try again"
        })

    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

export const forgetPassword = createAsyncThunk("user/forgetPassword", async(data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/auth/user/forgetPassword", data);

        toast.promise(res, {
            loading: "Wait! forget password in processing...",
            success: (response) => {
                return response.data?.message;
            },
            error: "Failed to forget password, Please try again"
        })

    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

export const resetPassword = createAsyncThunk("user/resetPassword", async(data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/auth/user/resetPassowrd", data);

        toast.promise(res, {
            loading: "Wait! reset password in processing...",
            success: (response) => {
                return response.data?.message;
            },
            error: "Failed to reset password, Please try again"
        })

    } catch (err) {
        toast.error(err.response?.data?.message);
        return rejectWithValue({
            message: err.response?.data?.message,
            status: err.response?.status
        });
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.fulfilled, (state, action) => {
                state.user = action.payload?.data;
                localStorage.setItem("userData", JSON.stringify(action.payload?.data));
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyUserEmail.fulfilled, (state, action) => {
                state.user = action.payload?.data;
                state.isLoggedIn = true;
                state.authChecked = true;
                localStorage.setItem("userData", JSON.stringify(action.payload?.data));
                state.loading = false;
                state.error = null;
            })
            .addCase(userlogin.fulfilled, (state, action) => {
                state.user = action.payload?.data;
                state.isLoggedIn = true;
                state.authChecked = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                if (!action?.payload?.data) return;
                console.log("user data: ", action.payload.data);
                state.isLoggedIn = true;
                state.user = action?.payload?.data;
                state.loading = false;
                state.error = null;
                state.authChecked = true;
            })
            .addCase(getUserData.rejected, (state) => {
                if (!state.isLoggedIn) {
                    state.isLoggedIn = false;
                    state.user = null;
                }
                state.loading = false;
                state.error = null;
                state.authChecked = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem("userData");
                state.isLoggedIn = false;
                state.loading = false;
                state.error = null;
            })
    }
})

export default authSlice.reducer;