import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import MarkdownRenderer from "./MarkdownRenderer";
import FileBubble from "./FileBubble";
import TypewriterMarkdown from "./TypewriterMarkdown";
import ChatInput from "./ChatInput";
import { landingPagePlaceholder } from "../utils/variables";
import { usePageContext } from "../context/PageContext";
import { summaryAnimationDone } from "../redux/slices/aiSlice";
import BrieflyWellcome from "./BrieflyWellcome";
import logo from "../assets/logo_Briefly.png"

function ChatWindow() {
  const dispatch = useDispatch();
  const currentChat = useSelector((state) => state.ai?.currentChat);
  const temporalFile = useSelector((state) => state.ai?.temporalFile);
  const isNewSummary = useSelector((state) => state.ai?.isNewSummary);
  const temporalQuery = useSelector((state) => state.ai?.temporalQuery);
  const isWaitingForResponse = useSelector((state) => state.ai?.isWaitingForResponse);
  const [animatingIds, setAnimatingIds] = useState(new Set());
  const prevIdsRef = useRef([]);
  const firstRender = useRef(true);
  const { isLandingPage } = usePageContext();

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const messageIds = currentChat?.message?.map((m) => m._id) || [];
    if (firstRender.current) {
      firstRender.current = false;
      prevIdsRef.current = messageIds;
      return;
    }
    const newIds = messageIds.filter((id) => !prevIdsRef.current.includes(id));
    if (newIds.length > 0) {
      setAnimatingIds((prev) => {
        const next = new Set(prev);
        newIds.forEach((id) => next.add(id));
        return next;
      });
    }
    prevIdsRef.current = messageIds;
  }, [currentChat?.message]);

  const handleMessageDone = (id) => {
    setAnimatingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [
    currentChat?.message,
    temporalQuery,
    isWaitingForResponse,
    currentChat?.summary,
  ]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-end pb-1 pr-5 gap-2 items-center mt-4">
        <img
          src={logo}
          alt="Briefly logo"
          className="w-8 h-8 object-cover ml-2"
        />
        <h2 className="text-2xl font-bold text-center tracking-wider">Briefly</h2>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain thin-scrollbar"
      >
        <div className="max-w-2xl mx-auto px-8 py-5 space-y-4">
          {isLandingPage ? (
            <div className="h-full flex flex-col">
              {!temporalFile?.fileName ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h1 className="text-4xl text-center mb-10 max-w-100 max-[430px]:text-3xl">
                    What would you like to summarize?
                  </h1>
                  <BrieflyWellcome />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex justify-end pt-5">
                    <FileBubble fileName={temporalFile.fileName} />
                  </div>
                  <div className="flex justify-start pl-2 mb-4">
                    <span className="inline-flex ml-1 items-center align-middle">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]" />
                      </span>
                    </span>
                  </div>
                  <div className="flex-1" />
                </div>
              )}
            </div>
          ) : (
            <>
              {currentChat?.originalFilename && (
                <div className="flex justify-end mb-4">
                  <FileBubble fileName={currentChat.originalFilename} />
                </div>
              )}

              {currentChat?.summary &&
                (isNewSummary ? (
                  <>
                    <h2 className="text-white/10">Summary</h2>
                    <div className="text-sm md:text-base text-base-content tracking-wide">
                      <TypewriterMarkdown
                        content={currentChat.summary}
                        speed={10}
                        onDone={() => dispatch(summaryAnimationDone())}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-white/50">Summary</h2>
                    <div className="text-sm md:text-base text-base-content tracking-wide">
                      <MarkdownRenderer content={currentChat.summary} />
                    </div>
                  </>
                ))}

              {currentChat?.message?.length > 0 ?
                <h2 className="text-white/50 mt-8">Question And Answer</h2> :
                <h2 className="text-white/50 text-center">No Conversation Start Yet</h2>}

              {currentChat?.message?.map((msg) => (
                <div key={msg._id} className="mb-6">
                  {msg.query && (
                    <div className="flex justify-end mb-2">
                      <div className="max-w-[80%] bg-white/15 text-primary-content px-4 py-2 rounded-xl text-sm md:text-base">
                        {msg.query}
                      </div>
                    </div>
                  )}
                  {msg.response && (
                    <ChatMessage
                      key={msg._id}
                      response={msg.response}
                      isNew={animatingIds.has(msg._id)}
                      onDone={() => handleMessageDone(msg._id)}
                    />
                  )}
                </div>
              ))}
              {temporalQuery && isWaitingForResponse && (
                <div className="mb-2">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] w-fit bg-white/15 text-primary-content px-4 py-2 rounded-2xl text-sm">
                      {temporalQuery || "what is RNNs ?"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="loading loading-dots loading-sm"></span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isLandingPage && (
        <div className="px-4 pb-5 bg-base-100">
          <div className="max-w-2xl mx-auto">
            <ChatInput placeholder={landingPagePlaceholder} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;