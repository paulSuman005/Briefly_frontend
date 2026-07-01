import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import Loader from "../components/Loader";
import { getCurrentChat, removeTemporalFile } from "../redux/slices/aiSlice";
import { chatPagePlaceholder } from "../utils/variables";

function ChatPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const currentChat = useSelector((state) => state.ai?.currentChat);
  const temporalFile = useSelector((state) => state.ai?.temporalFile);

  const [loading, setLoading] = useState(() => {
    return !(currentChat && currentChat._id === id);
  });

  useEffect(() => {
    if(temporalFile.fileName) dispatch(removeTemporalFile());
    if (currentChat && currentChat._id === id) {
      return;
    }

    const helper = async () => {
      setLoading(true);
      await dispatch(getCurrentChat({ docId: id })).finally(() => {
        setLoading(false);
      });
    };
    helper();
  }, [dispatch, id, currentChat]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          key="content"
          className="flex-1 flex flex-col min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ChatWindow />

          <ChatInput placeholder={chatPagePlaceholder} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatPage;