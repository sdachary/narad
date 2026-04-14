import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Sparkles, Circle, Square, Triangle } from 'lucide-react';

export default function ChatArea({ messages, isProcessing }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative p-8 md:p-12">
      {/* Background Dot Grid */}
      <div className="fixed inset-0 dot-grid -z-10" />

      {/* Background Geometric Decorations */}
      <div className="fixed top-1/4 right-0 w-[400px] h-[400px] opacity-[0.02] -z-10 pointer-events-none">
        <Circle size={400} className="text-black" />
      </div>
      <div className="fixed bottom-1/4 -left-20 w-[300px] h-[300px] opacity-[0.02] rotate-45 -z-10 pointer-events-none">
        <Square size={300} className="text-black" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 pt-24 pb-32">
        {messages.map((message, index) => (
          <div
            key={index}
            data-message-index={index}
            className={`flex flex-col gap-6 animate-bauhaus-snappy ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Header / Avatar */}
            <div className={`flex items-center gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`
                w-12 h-12 flex items-center justify-center border-4 border-black transition-all grayscale hover:grayscale-0
                ${message.role === 'user' ? 'bg-bauhaus-yellow rounded-none' : 'bg-bauhaus-blue rounded-full'}
              `}>
                {message.role === 'user' ? <User size={20} className="text-black" /> : <Sparkles size={20} className="text-white" />}
              </div>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-black">
                {message.role === 'user' ? 'CLIENT_QUERY' : 'SYSTEM_RESPONSE'}
              </span>
            </div>

            {/* Content Card */}
            <div className={`
              w-full md:max-w-[85%] p-8 border-4 border-black relative
              ${message.role === 'user' 
                ? 'bg-white shadow-bauhaus-lg' 
                : 'bg-bauhaus-white shadow-bauhaus-lg border-bauhaus-red'}
            `}>
              {/* Asymmetric Corner Decoration */}
              <div className={`absolute -top-1 -left-1 w-4 h-4 border-l-4 border-t-4 border-black`} />
              
              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black prose-pre:border-black">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
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
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex flex-col items-start gap-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center border-4 border-black bg-bauhaus-red rounded-full animate-bounce">
                <Triangle size={20} className="text-white fill-current" />
              </div>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-black italic">
                CONSTRUCTING_RESPONSE...
              </span>
            </div>
            
            <div className="w-full h-12 bg-gray-100 border-4 border-black relative overflow-hidden">
               <div className="absolute inset-y-0 left-0 bg-bauhaus-yellow animate-[shimmer_2s_infinite] w-1/3" />
            </div>
          </div>
        </div>

        <div ref={scrollRef} />
      </div>
    </div>
  );
}