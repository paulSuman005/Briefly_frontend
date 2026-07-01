import { useState, useRef } from "react";
import { allowedTypes } from "../utils/variables";
import { usePageContext } from "../context/PageContext";
import { useDispatch, useSelector } from "react-redux";
import { questionAnswer, setTemporalFile, setTemporalQuery, summarize } from "../redux/slices/aiSlice";
import { useNavigate } from "react-router-dom";
import { CircleX, Paperclip, Upload } from "lucide-react";
import FileIcon from "./FileIcon";

function ChatInput({ placeholder }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const docId = useSelector((state) => state.ai?.currentChat?._id);

    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const textareaRef = useRef(null);

    const { isLandingPage } = usePageContext();

    const handleChange = (e) => {
        setText(e.target.value);
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        const maxHeight = 300;
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleClick(e);
        }
    };

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Only PDF, DOC, DOCX and TXT files are allowed");
            e.target.value = "";
            return;
        }
        setFile(selectedFile);
    };

    const handleSummarize = async () => {
        if (!file) return;
        const selectedFile = file;

        const formData = new FormData();
        formData.append("file", selectedFile);

        dispatch(setTemporalFile({ fileName: selectedFile.name }));

        setFile(null);
        console.log("file null ", file);
        setLoading(true);

        try {
            const result = await dispatch(summarize(formData)).unwrap();
            console.log("result from chatInput summary : ", result);

            navigate(`/chat/${result.data._id}`, {
                replace: true
            });

        } catch (error) {
            console.log(error);
            console.log("selected file : ", selectedFile)
            setFile(selectedFile);
            console.log(" file not  null ", file);
            console.log("selected file");
        } finally {
            setLoading(false);
        }
    };

    const handleQNA = async () => {
        if (!text || !docId || text.trim() === "") return;
        console.log("qna called");
        const selectedText = text.trim();
        setText("");
        dispatch(setTemporalQuery({ query: selectedText }));
        setLoading(true);
        try {
            await dispatch(questionAnswer({ query: selectedText, docId })).unwrap();
            setText("");
        } catch (error) {
            console.log("error from chatInput : ", error);
            setText(selectedText)
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (isLandingPage && file) handleSummarize();
        else handleQNA();
    };


    return (
        <div className="w-full px-4 pb-5">
            <div className="max-w-2xl mx-auto bg-base-100 border rounded-2xl px-3 py-2 shadow-sm">
                {file && (
                    <div className=" relative flex items-center justify-between w-fit max-w-[250px] bg-base-200 border rounded-xl p-3 mb-2 mt-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileIcon fileName={file.name} />
                            <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="btn btn-xs btn-circle btn-ghost absolute -top-3 -right-3"
                        >
                            <CircleX className="w-4 h-4 md:w-6 md:h-6"/>
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <label
                        title="Select a file to summarize"
                        className={`btn btn-ghost btn-circle ${!isLandingPage ? "pointer-events-none opacity-50" : "cursor-pointer"
                            }`}
                    >
                        <Paperclip className="w-4 h-4 md:w-6 md:h-6" />
                        <input
                            key={file ? file.name : "empty"}
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFile}
                            disabled={!isLandingPage}
                        />
                    </label>

                    <textarea
                        ref={textareaRef}
                        value={text}
                        disabled={isLandingPage || file}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        rows="1"
                        placeholder={
                            isLandingPage && file
                                ? "Click On Upload For Briefly Magic"
                                : placeholder
                        }
                        className="flex-1 bg-transparent outline-none px-2 mb-2 text-sm resize-none overflow-y-auto"
                    />

                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={(isLandingPage && !file) || (!isLandingPage && !text) || loading}
                        className="btn btn-primary btn-sm rounded-lg"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-md"></span>
                        ) : (
                            <Upload className="w-4 h-4 md:w-6 md:h-6" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatInput;
