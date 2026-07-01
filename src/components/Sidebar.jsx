import { useEffect, useState, memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatHistory, removeCurrentChat } from "../redux/slices/aiSlice";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../context/PageContext";
import HistoryItem from "./HistoryItem";
import { useMediaQuery } from 'react-responsive';
import { CirclePlus, LogOut, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";
import { logoutUser } from "../redux/slices/authSlice";

function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLandingPage } = usePageContext();

    const isMobile = useMediaQuery({ maxWidth: 768 }, undefined, false);
    const isMeddium = useMediaQuery({ query: "(max-width: 850px)" });

    const currentChatId = useSelector((state) => state.ai?.currentChat?._id);
    const history = useSelector((state) => state.ai.history);
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [isLogouting, setIsLogouting] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    console.log("user: ", user);

    const [open, setOpen] = useState(false);
    useEffect(() => {
        (() => {
            setOpen(!isMobile);
        })();
    }, [isMobile]);


    useEffect(() => {
        async function getHistory() {
            setLoading(true);
            await dispatch(getChatHistory());
            setLoading(false);
        }
        getHistory();
    }, [dispatch]);

    useEffect(() => {
        if (isLandingPage) {
            dispatch(removeCurrentChat());
        }
    }, [isLandingPage, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showPopup && popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPopup]);

    const handleClick = (id) => {
        if (isMobile) setOpen(false);
        if (currentChatId && currentChatId === id) return;
        navigate(`/chat/${id}`);
    };

    const handleLogout = async () => {
        try {
            setIsLogouting(true);
            await dispatch(logoutUser()).unwrap();
        } catch (err) {
            console.log("logout error : ", err);
        } finally {
            setIsLogouting(false);
            setShowPopup(false);
        }
    }

    const handleNewChat = async () => {
        if (isLandingPage) return;
        if (isMobile) setOpen(false);
        dispatch(removeCurrentChat());
        navigate("/");
    };

    return (
        <>
            {isMobile && !open && (
                <button
                    className="fixed top-3 left-4 z-50 btn btn-sm btn-circle" //btn-primary
                    onClick={() => setOpen(true)}
                    aria-label="Open sidebar"
                >
                    <PanelLeftOpen />
                </button>
            )}

            {isMobile && open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 "
                    onClick={() => setOpen(false)}
                />
            )}

            <div
                className={`
                    flex flex-col bg-base-100
                    ${isMobile
                        ? `fixed top-0 left-0 h-full w-72 z-50 shadow-lg transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`
                        : `h-screen border-r ${open ? (isMeddium ? 'w-60' : 'w-72') : 'w-16'} transition-all duration-300`
                    }
                `}
            >
                <div className={`flex items-center ${open ? "justify-between" : "justify-center"} p-3`}>
                    {open && (
                        <button
                            onClick={handleNewChat}
                            className="btn btn-sm btn-circle"
                            title="New Chat"
                        >
                            <CirclePlus />
                        </button>
                    )}
                    <button
                        className="btn btn-sm btn-circle"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle sidebar"
                    >
                        {open ? <PanelLeftClose /> : <PanelLeftOpen />}
                    </button>
                </div>

                {open && (
                    <>
                        <div className="px-3 flex flex-col flex-1 overflow-hidden">
                            <h2 className="font-bold mb-4 mt-2">History</h2>

                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="skeleton h-10 w-full rounded-lg bg-white/40 mb-2 flex items-center justify-start"
                                    >
                                        <div className="skeleton h-[50%] w-[70%] rounded-lg bg-white/50 ml-5" />
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-2 pr-1 thin-scrollbar">
                                    {history?.length > 0 &&
                                        history.map((ele) => (
                                            <HistoryItem
                                                key={ele._id}
                                                item={ele}
                                                isActive={currentChatId === ele._id}
                                                onSelect={handleClick}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className="px-3 py-3 border-t border-base-300 flex-shrink-0">
                            <div
                                ref={popupRef}
                                className="relative flex items-center gap-3 w-full hover:cursor-pointer"
                            >
                                <button
                                    className="flex items-center gap-5 w-full hover:cursor-pointer justify-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPopup(!showPopup);
                                    }}
                                >
                                    <div className="avatar placeholder cursor-pointer">
                                        <div className="w-8 rounded-full bg-white/20 text-neutral-content flex justify-center items-center">
                                            <span className="text-md font-medium text-white/80">{user.name.slice(0, 1)}</span>
                                        </div>
                                    </div>

                                    <span className="text-md font-medium text-white/80">
                                        {user.email}
                                    </span>
                                </button>


                                {showPopup && (
                                    <div className="absolute bottom-full left-1/3 -translate-x-1/2 mb-2 w-48 p-2 bg-base-200 backdrop-blur-sm rounded-lg shadow-lg border border-white/50 z-50 cursor-default">

                                        <div
                                            className="flex w-full px-1 py-2 text-white justify-start font-medium cursor-default"
                                        >
                                            <span className="mr-1.5"><User className="w-5 h-5" /></span>{user.name}
                                        </div>


                                        <button
                                            className="flex btn btn-md w-full text-white hover:bg-white/20 justify-start pl-1"
                                            onClick={handleLogout}
                                            disabled={isLogouting}
                                        >
                                            {isLogouting ?
                                                <>
                                                    <span className="loading loading-spinner loading-md"></span> Logouting 
                                                </> : <><span><LogOut className="w-5 h-5" /></span> Logout</>}
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default memo(Sidebar);