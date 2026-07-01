import TypewriterMarkdown from "./TypewriterMarkdown";
import MarkdownRenderer from "./MarkdownRenderer";

const ChatMessage = ({ response, isNew, onDone }) => {
  return (
    <div className="text-sm md:text-base text-base-content">
      {isNew ? (
        <TypewriterMarkdown
          content={response}
          speed={30}
          onDone={onDone}
        />
      ) : (
        <div className="text-sm md:text-base text-base-content">
          <MarkdownRenderer content={response} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage