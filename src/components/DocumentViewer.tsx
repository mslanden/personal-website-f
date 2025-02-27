import React, { useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from "./DocumentViewer.module.css";

interface DocumentViewerProps {
  contentType: string | null;
  content: string | null;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  content,
  contentType,
  onClose,
}) => {
  console.log('DocumentViewer Received:', { contentType, content });
    
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={styles.documentViewerContainer} onClick={onClose}>
      <div className={styles.documentViewer} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton}>
          X
        </button>
        {contentType?.toLowerCase() === 'markdown' ? (
          <ReactMarkdown
            children={content || ''}
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }: any) => (
                <img {...props} className={styles.mdImage} alt={props.alt || ''} loading="lazy" />
              ),
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content || "" }} />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
