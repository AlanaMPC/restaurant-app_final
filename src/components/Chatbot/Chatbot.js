import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Simple markdown to HTML converter
const formatMessage = (text) => {
  if (!text) return '';

  return text
    // Bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*(?!\*)(.*?)\*/g, '<em>$1</em>')
    .replace(/_(?!_)(.*?)_/g, '<em>$1</em>')
    // Bullet points: * item or - item
    .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Line breaks
    .replace(/\n/g, '<br/>');
};

// Menu data for context
const menuContext = `
You are a friendly, casual restaurant assistant for our restaurant. Here's our full menu:

**VEGETARIAN (₹80-180):**
- Tomato Soup ₹150 - Hot and aromatic tomato soup
- French Fries ₹100 - Crispy golden fried potatoes
- Loaded French Fries ₹180 - French fries with toppings and sauces
- Veg Sandwich ₹120 - Fresh vegetable sandwich with special sauce
- Lotus Biscoff Sandwich ₹140 - Sweet biscoff spread sandwich (Kids' Favorite!)
- Paneer Burger ₹180 - Crispy paneer patty burger

**NON-VEGETARIAN (₹100-240):**
- Chicken Pops ₹220 - Crispy chicken fritters
- Chicken Loaded Fries ₹240 - Loaded fries with chicken and toppings
- Chicken Sandwich ₹200 - Tender chicken sandwich
- Chicken Momos ₹180 - Steamed chicken momos with sauce
- Plain Dosa ₹100 - Crispy plain dosa
- Egg Dosa ₹130 - Dosa with egg filling
- Egg Cheese Dosa ₹160 - Dosa with egg and cheese
- Chicken Dosa ₹200 - Dosa with shredded chicken
- Cheesy Chicken Dosa ₹230 - Chicken dosa with melted cheese
- Mutton Keema Dosa ₹240 - Dosa with mutton keema filling

**SOUTH INDIAN (₹80-120):**
- Idly Plain ₹80 - Soft steamed rice cakes
- Idly Sambar ₹100 - Idly with sambar curry
- Idly Podi ₹100 - Idly with spicy podi powder
- Panniyaram Cheese ₹120 - Soft panniyaram with cheese
- Panniyaram Nei Podi ₹120 - Panniyaram with ghee and spices

**MOJITOS (₹150-180):**
- Strawberry Mojito ₹180 - Fresh strawberry mojito
- Litchi Mojito ₹180 - Sweet litchi mojito
- Lime Mojito ₹150 - Classic lime and mint mojito

PERSONALITY GUIDELINES:
- Be casual, warm, and friendly (use emojis occasionally 😊)
- Keep responses concise but helpful
- If asked about items not on menu, politely say we don't have it but suggest alternatives
- For dietary questions, clearly distinguish veg vs non-veg
- If asked about spicy food, recommend: Idly Podi, Chicken Pops, Mutton Keema Dosa
- For kids, suggest: Lotus Biscoff Sandwich, French Fries, Plain Idly
- Budget-friendly picks (under ₹120): French Fries, Veg Sandwich, Idly varieties, Plain Dosa
`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey there! 👋 I'm here to help you with our menu. Ask me anything - what are you in the mood for today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Retry logic with exponential backoff
    const makeRequest = async (retryCount = 0) => {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('API key not configured');
      }

      // Build conversation history for context
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add system context as the first message
      const contents = [
        {
          role: 'user',
          parts: [{ text: menuContext }]
        },
        {
          role: 'model',
          parts: [{ text: "Got it! I'm ready to help customers with our menu. I'll be casual, friendly, and use emojis occasionally! 😊" }]
        },
        ...conversationHistory
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      // Handle rate limit with retry
      if (response.status === 429 && retryCount < 3) {
        const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return makeRequest(retryCount + 1);
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('RATE_LIMIT');
        }
        throw new Error('Failed to get response');
      }

      return response.json();
    };

    try {
      const data = await makeRequest();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Oops, I had a little hiccup! Could you try asking again? 😅";

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Chatbot error:', error);

      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏";

      if (error.message === 'RATE_LIMIT') {
        errorMessage = "Whoa, I'm getting too many questions! 😅 Give me about 30 seconds to catch my breath, then try again!";
      } else if (error.message === 'API key not configured') {
        errorMessage = "Oops! My connection isn't set up properly. Please check the API configuration.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar">🍽️</span>
            <div>
              <h3>Menu Assistant</h3>
              <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && <span className="message-avatar">🍽️</span>}
              {msg.role === 'assistant' ? (
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              ) : (
                <div className="message-content">{msg.content}</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <span className="message-avatar">🍽️</span>
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about our menu..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6L18 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
