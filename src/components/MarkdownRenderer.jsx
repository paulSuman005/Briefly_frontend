import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      components={{
        // Style headings
        h1: ({ node, ...props }) => (
          <h1 className="text-xl font-bold mb-2 mt-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-lg font-semibold mb-1 mt-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-base font-medium mb-1 mt-2" {...props} />
        ),
        // Style paragraphs
        p: ({ node, ...props }) => (
          <p className="mb-2 leading-relaxed" {...props} />
        ),
        // Style unordered lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />
        ),
        // Style ordered lists
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />
        ),
        // Style list items
        li: ({ node, ...props }) => <li className="text-sm" {...props} />,
        // Style bold text
        strong: ({ node, ...props }) => (
          <strong className="font-semibold" {...props} />
        ),
        // Style links
        a: ({ node, ...props }) => (
          <a className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        // Style inline code
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm" {...props} />
          ) : (
            <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto my-2">
              <code className="text-sm" {...props} />
            </pre>
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;