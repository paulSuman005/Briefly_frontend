import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getChatHistory, removeCurrentChat } from "../redux/slices/aiSlice";
import HistoryItem from "./HistoryItem";
import { useNavigate } from "react-router-dom";



function History() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const history = useSelector((state) => state.ai.history);
  const [loading, setLoading] = useState(false);

  const currentChatId = useSelector((state) => state.ai?.currentChat?._id, shallowEqual);


  useEffect(() => {
    async function getHistory() {
      setLoading(true);
      await dispatch(getChatHistory());
      setLoading(false);
    }
    getHistory();
  }, [dispatch]);


  const handleClick = ((id) => {
    // if (isMobile) setOpen(false);
    if (currentChatId && currentChatId === id) return;
    dispatch(removeCurrentChat());
    navigate(`/chat/${id}`);
  })

  return (
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
  )
}

export default React.memo(History);