import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    history: [],
    currentChat: {},
    temporalFile: { fileName: null },
    isNewSummary: false,
    temporalQuery: null,
    isWaitingForResponse: false,
    loading: false,
    error: null,
};

export const getChatHistory = createAsyncThunk(
    "chatHistory",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/api/v1/user/getChats");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const summarize = createAsyncThunk(
    "summarize",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "/api/v1/user/uploadAndSummarize",
                data
            );
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message);
            console.log("console error : ", err)
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const questionAnswer = createAsyncThunk(
    "questionAnswer",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "/api/v1/user/questionAnswer",
                data
            );
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getCurrentChat = createAsyncThunk(
    "getCurrentChat",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "/api/v1/user/getDocument",
                data
            );
            return res.data;
        } catch (err) {
            console.log("console error : ", err)
            toast.error(err.response?.data?.message);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const rename = createAsyncThunk("rename", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.patch("/api/v1/user/updateTitle", data);
        return res.data;
    } catch (err) {
        console.log("console error : ", err)
        toast.error(err.response?.data?.message);
        return rejectWithValue(err.response?.data || err.message);
    }
})

export const deleteDoc = createAsyncThunk("deleteDoc", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete("/api/v1/user/deleteDocument", { data });
        return res.data;
    } catch (err) {
        console.log("console error : ", err)
        toast.error(err.response?.data?.message);
        return rejectWithValue(err.response?.data || err.message);
    }
})

const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        removeCurrentChat: (state) => {
            state.currentChat = {};
        },
        setTemporalFile(state, action) {
            state.temporalFile.fileName = action.payload.fileName;
        },
        removeTemporalFile(state) {
            state.temporalFile.fileName = null;
        },
        summaryAnimationDone(state) {
            state.isNewSummary = false;
        },
        setTemporalQuery: (state, action) => {
            state.temporalQuery = action.payload.query;
            state.isWaitingForResponse = true;
        },
        clearTemporalQuery: (state) => {
            state.temporalQuery = null;
            state.isWaitingForResponse = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChatHistory.fulfilled, (state, action) => {
                state.history = action.payload?.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getChatHistory.rejected, (state, action) => {
                state.history = [];
                state.loading = false;
                state.error = action.payload?.message || action.payload;
            })
            // summarize
            .addCase(summarize.fulfilled, (state, action) => {
                if (!action.payload?.data) return;
                console.log("summarizer payload : ", action.payload);
                const { _id, title, updatedAt } = action.payload.data;
                state.history.unshift({ _id, title, updatedAt });
                state.currentChat = action.payload.data;
                state.isNewSummary = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(summarize.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
                state.temporalFile.fileName = null;
            })
            // questionAnswer
            .addCase(questionAnswer.fulfilled, (state, action) => {
                if (!action.payload.data) return;
                console.log("questio answer payload : ", action.payload.data)
                const { docId } = action.payload.data;
                const index = state.history.findIndex(item => item._id === docId);
                state.history.splice(0, 0, state.history.splice(index, 1)[0]);
                state.currentChat.message.push(action.payload.data.messageResult);
                state.temporalQuery = null;
                state.isWaitingForResponse = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(questionAnswer.rejected, (state, action) => {
                state.temporalQuery = null;
                state.isWaitingForResponse = false;
                state.loading = false;
                state.error = action.payload?.message || action.payload;
            })
            // getCurrentChat
            .addCase(getCurrentChat.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.currentChat = action.payload.data;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(getCurrentChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
            })
            //rename
            .addCase(rename.fulfilled, (state, action) => {
                if (!action.payload.data) return;

                const { _id, title } = action.payload.data;
                const index = state.history.findIndex(item => item._id === _id);
                if (index !== -1) {
                    state.history[index].title = title;
                    const [item] = state.history.splice(index, 1);
                    state.history.unshift(item);
                }
                if (state.currentChat._id === _id) {
                    state.currentChat.title = title;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(rename.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
            })
            //delete
            .addCase(deleteDoc.fulfilled, (state, action) => {
                if (!action.payload.data) return;

                const { _id } = action.payload.data;
                const index = state.history.findIndex(item => item._id === _id);
                if (index !== -1) {
                    state.history.splice(index, 1);
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteDoc.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.payload;
            })
    },
});

export const {
    removeCurrentChat,
    setTemporalFile,
    removeTemporalFile,
    summaryAnimationDone,
    setTemporalQuery,
    clearTemporalQuery
} = aiSlice.actions;

export default aiSlice.reducer;