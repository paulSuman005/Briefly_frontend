// import { useState, useEffect, useRef, useMemo } from "react";
// import MarkdownRenderer from "./MarkdownRenderer";

// const TypewriterMarkdown = ({ content, speed = 40, onDone }) => {
//   const [visibleIndex, setVisibleIndex] = useState(0);

//   // Split content into words (stable during this instance)
//   const words = useMemo(() => {
//     if (!content) return [];
//     return content.match(/\S+|\s+/g) || [];
//   }, [content]);

//   // Refs for the latest onDone callback (words never change)
//   const onDoneRef = useRef(onDone);

//   // Sync the ref with the latest onDone prop (runs after every render)
//   useEffect(() => {
//     onDoneRef.current = onDone;
//   });

//   // Start the typewriter interval
//   useEffect(() => {
//     const totalWords = words.length;
//     if (totalWords === 0) return;

//     const interval = setInterval(() => {
//       setVisibleIndex((prev) => {
//         if (prev >= totalWords) {
//           clearInterval(interval);
//           onDoneRef.current?.();   // call the latest onDone
//           return prev;
//         }
//         return prev + 1;
//       });
//     }, speed);

//     return () => clearInterval(interval);
//   }, [speed, words.length]);

//   const partialMarkdown = words.slice(0, visibleIndex).join("");

//   return (
//     <span className="text-sm text-base-content">
//       <MarkdownRenderer content={partialMarkdown} />
//       {visibleIndex < words.length && (
//         <span className="inline-block w-2 h-5 ml-0.5 bg-blue-500 rounded-sm animate-pulse align-middle" />
//       )}
//     </span>
//   );
// };

// export default TypewriterMarkdown;

// import { useState, useEffect, useRef } from "react";
// import MarkdownRenderer from "./MarkdownRenderer";

// const TypewriterMarkdown = ({ content, speed = 30, onDone }) => {
//   const [visibleIndex, setVisibleIndex] = useState(0);
//   const onDoneRef = useRef(onDone);

//   // Always keep the latest onDone callback
//   useEffect(() => {
//     onDoneRef.current = onDone;
//   });

//   useEffect(() => {
//     if (!content) {
//       onDoneRef.current?.();
//       return;
//     }

//     const totalChars = content.length;
//     if (totalChars === 0) {
//       onDoneRef.current?.();
//       return;
//     }

//     const interval = setInterval(() => {
//       setVisibleIndex((prev) => {
//         if (prev >= totalChars) {
//           clearInterval(interval);
//           onDoneRef.current?.();
//           return prev;
//         }
//         return prev + 1;
//       });
//     }, speed);

//     return () => clearInterval(interval);
//   }, [content, speed]);

//   const partialText = content.slice(0, visibleIndex);

//   return (
//     <span className="text-sm text-base-content">
//       <MarkdownRenderer content={partialText} />
//       {visibleIndex < content.length && (
//         <span className="inline-block w-2 h-5 ml-0.5 bg-blue-500 rounded-sm animate-pulse align-middle" />
//       )}
//     </span>
//   );
// };

// export default TypewriterMarkdown;


import { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

const TypewriterMarkdown = ({ content, speed = 30, onDone }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const onDoneRef = useRef(onDone);
  const intervalRef = useRef(null);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    function helper() {
      setVisibleIndex(0);
      if (!content) onDoneRef.current?.();
    }
    helper();
  }, [content]);

  useEffect(() => {
    if (!content) return;
    const totalChars = content.length;
    if (totalChars === 0) {
      onDoneRef.current?.();
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setVisibleIndex((prev) => {
        if (prev >= totalChars) {
          clearInterval(intervalRef.current);
          return totalChars;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [content, speed]);

  useEffect(() => {
    if (content && visibleIndex >= content.length) {
      onDoneRef.current?.();
    }
  }, [visibleIndex, content]);

  const partialText = content ? content.slice(0, visibleIndex) : "";
  const isTyping = visibleIndex < (content?.length || 0);

  return (
    <div className="text-sm md:text-base text-base-content">
      <div className="mb-2 leading-relaxed">
        {isTyping ? (
          <span className="whitespace-pre-wrap">
            {partialText}

            <span className="inline-flex ml-1 items-center align-middle">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]" />
              </span>
            </span>
          </span>
        ) : (
          <MarkdownRenderer content={content} />
        )}
      </div>
    </div>
  );
};

export default TypewriterMarkdown;