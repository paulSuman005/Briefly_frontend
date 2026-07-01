import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteDoc, rename } from "../redux/slices/aiSlice";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../context/PageContext";
import { useMediaQuery } from "react-responsive";
import { Pen, Trash2 } from "lucide-react";

function HistoryItem({ item, isActive, onSelect }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isMeddium = useMediaQuery({ query: "(max-width: 850px)" });

    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.title);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const { isLandingPage } = usePageContext();


    const menuRef = useRef(null);
    const inputRef = useRef(null);

    console.log("is active : ", isActive);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    // Auto-focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Cancel editing
    const cancelEdit = () => {
        setIsEditing(false);
        setEditValue(item.title);
    };

    // Save new name
    const saveEdit = async () => {
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== item.title) {
            try {
                setIsLoading(true);
                const res = await dispatch(rename({ docId: item._id, title: trimmed })).unwrap();
                console.log("rename result : ", res);
                setIsEditing(false);
            } catch (error) {
                cancelEdit();
                setIsLoading(false);
                console.log(error);
            }
        }
        setIsEditing(false);
        setIsLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveEdit();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancelEdit();
        }
    };

    // Trigger delete confirmation
    const handleDeleteClick = () => {
        setMenuOpen(false);
        setShowDeleteConfirm(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            const res = await dispatch(deleteDoc({ docId: item._id })).unwrap();
            console.log("result : ", res);
            setIsLoading(false);
            setShowDeleteConfirm(false);
            navigate("/", { replace: true });
        } catch (err) {
            console.log("error : ", err);
            setIsLoading(false);
        }
    };

    // Cancel delete
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <>
            {isLoading ? (<div
                className="skeleton h-10 w-full rounded-lg bg-white/40 mb-2 flex items-center justify-start"
            >
                <div className="skeleton h-[50%] w-[70%] rounded-lg bg-white/50 ml-5" />
            </div>) : (<div ref={menuRef} key={item._id} className="relative group">
                {/* Main area: button or input */}
                {!isEditing ? (
                    <button
                        title={item.title}
                        onClick={() => onSelect(item._id)}
                        className={`w-full ${isMeddium ? "text-sm" : "text-base"} text-left p-2 group-hover:pr-8 rounded-lg hover:bg-white/10 group-hover:bg-white/10 transition-colors truncate ${(isActive && !isLandingPage) ? "bg-white/30" : ""
                            }`}
                    >
                        {item.title}
                    </button>
                ) : (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={cancelEdit}
                        className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:border-blue-400"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}

                {/* Three-dot menu */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 py-2 px-2 rounded-full 
                               opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity
                               text-gray-400 hover:text-white text-lg leading-none font-bold"
                >
                    ⋮
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                    <div className="absolute -right-1 top-full mt-1 w-36 bg-base-200 border rounded-xl shadow-lg z-10 py-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                                setEditValue(item.title);
                                setMenuOpen(false);
                            }}
                            className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-white/10"
                        >
                            <Pen className="w-4 h-4 mr-1" /> Rename
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick();
                            }}
                            className="flex w-full text-left px-3 py-2 text-sm hover:bg-white/10 text-red-400 items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                    </div>
                )}
            </div>)}

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
                    onClick={cancelDelete}
                >
                    <div className="bg-base-200 border rounded-2xl shadow-xl max-w-sm w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-2">Delete Chat</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            This chat can’t be recovered.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
                            >
                                {isLoading ?
                                    <span className="loading loading-spinner loading-md"></span>
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HistoryItem;