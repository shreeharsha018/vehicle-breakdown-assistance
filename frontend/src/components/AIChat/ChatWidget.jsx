import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import geminiService from '../../services/geminiService';
import './ChatWidget.css';

export default function ChatWidget({ mode = 'diagnostic', problemData = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            initializeChat();
        }
    }, [isOpen]);

    const initializeChat = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let welcomeMessage;

            if (mode === 'solution' && problemData) {
                welcomeMessage = await geminiService.startSolutionChat(problemData);
            } else {
                const vehicleType = problemData?.vehicleType || null;
                welcomeMessage = await geminiService.startDiagnosticChat(vehicleType);
            }

            setMessages([welcomeMessage]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            message: inputMessage,
            isAI: false,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setError(null);

        try {
            const aiResponse = await geminiService.sendMessage(inputMessage);
            setMessages(prev => [...prev, aiResponse]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleQuickAction = (question) => {
        setInputMessage(question);
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const quickActions = mode === 'solution'
        ? [
            "What tools do I need for this repair?",
            "What if this step doesn't work?",
            "Can you explain step-by-step?",
            "Are there any safety precautions?"
        ]
        : [
            "My vehicle won't start",
            "Strange noise when driving",
            "Dashboard warning lights",
            "Brake problems"
        ];

    return (
        <div className="chat-widget">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>🤖 AI Assistant</h3>
                        <button
                            className="chat-header-close"
                            onClick={toggleChat}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.length === 0 && !isLoading ? (
                            <div className="chat-empty-state">
                                <div className="chat-empty-state-icon">🤖</div>
                                <h4>AI Diagnostic Assistant</h4>
                                <p>Ask me anything about vehicle problems!</p>

                                <div className="quick-actions">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            className="quick-action-button"
                                            onClick={() => handleQuickAction(action)}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.isAI ? 'ai' : 'user'}`}>
                                        <div className="message-avatar">
                                            {msg.isAI ? '🤖' : '👤'}
                                        </div>
                                        <div>
                                            <div className="message-content">
                                                {msg.message}
                                            </div>
                                            {msg.timestamp && (
                                                <div className="message-timestamp">
                                                    {formatTime(msg.timestamp)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}

                        {error && (
                            <div className="chat-error">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="chat-input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="chat-send-button"
                            disabled={isLoading || !inputMessage.trim()}
                            aria-label="Send message"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            <button
                className={`chat-button ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '×' : '🤖'}
            </button>
        </div>
    );
}

ChatWidget.propTypes = {
    mode: PropTypes.oneOf(['diagnostic', 'solution']),
    problemData: PropTypes.shape({
        vehicleType: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }),
};
