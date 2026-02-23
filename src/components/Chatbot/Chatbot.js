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
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Line breaks
    .replace(/\n/g, '<br/>');
};

// Get time-based context
const getTimeContext = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.toLocaleDateString('en-IN', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  let mealTime = '';
  let mealSuggestion = '';

  if (hour >= 6 && hour < 11) {
    mealTime = 'breakfast';
    mealSuggestion = 'Great time for our South Indian breakfast! Idly, Panniyaram, or Dosa are perfect morning picks.';
  } else if (hour >= 11 && hour < 15) {
    mealTime = 'lunch';
    mealSuggestion = 'Lunch hour! Our dosas and burgers are great picks. Pair with a refreshing mojito!';
  } else if (hour >= 15 && hour < 18) {
    mealTime = 'snack time';
    mealSuggestion = 'Perfect time for evening snacks! Try our French Fries, Chicken Pops, or Momos.';
  } else if (hour >= 18 && hour < 22) {
    mealTime = 'dinner';
    mealSuggestion = 'Dinner time! Go all in — try our Mutton Keema Dosa or Cheesy Chicken Dosa paired with a Strawberry Mojito.';
  } else {
    mealTime = 'late night';
    mealSuggestion = 'Late night cravings? Our sandwiches and fries are quick and satisfying!';
  }

  return { hour, day, dateStr, timeStr, mealTime, mealSuggestion };
};

// Get the logged-in user's name
const getUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.email?.split('@')[0] || null;
  } catch {
    return null;
  }
};

// Build the smart system prompt
const buildSystemPrompt = () => {
  const time = getTimeContext();
  const userName = getUserName();

  return `You are "Zhaa Assist" 🍽️ — the smart, friendly, and witty AI assistant for our restaurant.

CURRENT CONTEXT:
- Current time: ${time.timeStr}
- Current day: ${time.day}, ${time.dateStr}
- Meal period: ${time.mealTime}
- Suggestion for now: ${time.mealSuggestion}
${userName ? `- Customer name: ${userName} (greet them by name when appropriate!)` : '- Customer is a guest (not logged in)'}

FULL MENU:

**🥬 VEGETARIAN (₹80-180):**
- Tomato Soup ₹150 — Hot and aromatic. Perfect comfort food.
- French Fries ₹100 — Crispy golden fried potatoes. A classic!
- Loaded French Fries ₹180 — French fries loaded with toppings and sauces.
- Veg Sandwich ₹120 — Fresh vegetable sandwich with our special sauce.
- Lotus Biscoff Sandwich ₹140 — Sweet biscoff spread sandwich. Kids absolutely love this!
- Paneer Burger ₹180 — Crispy paneer patty burger. Our bestselling veg item!

**🍗 NON-VEGETARIAN (₹100-240):**
- Chicken Pops ₹220 — Crispy chicken fritters. Spicy and crunchy!
- Chicken Loaded Fries ₹240 — Loaded fries with chicken and toppings. A meal in itself.
- Chicken Sandwich ₹200 — Tender chicken sandwich.
- Chicken Momos ₹180 — Steamed chicken momos with spicy sauce.
- Plain Dosa ₹100 — Crispy plain dosa. Simple and satisfying.
- Egg Dosa ₹130 — Dosa with egg filling.
- Egg Cheese Dosa ₹160 — Dosa with egg and melty cheese.
- Chicken Dosa ₹200 — Dosa with shredded chicken.
- Cheesy Chicken Dosa ₹230 — Chicken dosa loaded with melted cheese. A fan favorite!
- Mutton Keema Dosa ₹240 — Dosa with mutton keema filling. Our premium pick!

**🏛️ SOUTH INDIAN SPECIALS (₹80-120):**
- Idly Plain ₹80 — Soft steamed rice cakes. Light and healthy.
- Idly Sambar ₹100 — Idly with flavorful sambar curry.
- Idly Podi ₹100 — Idly with spicy podi powder. For spice lovers!
- Panniyaram Cheese ₹120 — Soft panniyaram balls with cheese.
- Panniyaram Nei Podi ₹120 — Panniyaram with ghee and spices. Authentic taste!

**🍹 REFRESHING MOJITOS (₹150-180):**
- Strawberry Mojito ₹180 — Fresh strawberry mojito. Sweet and refreshing!
- Litchi Mojito ₹180 — Sweet litchi mojito. Tropical vibes.
- Lime Mojito ₹150 — Classic lime and mint mojito. Budget-friendly refreshment!

PERSONALITY & BEHAVIOR:
- Be casual, warm, friendly, and a little witty (like a cool waiter who knows their stuff)
- Use emojis naturally but don't overdo it
- ALWAYS be aware of the current time and proactively suggest meals based on the time of day
- If someone asks "what should I eat?" or is confused, give a confident personalized recommendation based on the time
- Know the menu inside out — compare dishes, explain what's popular, suggest combos
- Suggest drink pairings with food naturally (e.g., "That'd go great with a Lime Mojito! 🍹")
- For groups, suggest a variety: mix of veg + non-veg + drinks
- If asked about items NOT on menu, say so politely but always pivot to what we DO have
- Use food enthusiasm — "Oh, you HAVE to try the Cheesy Chicken Dosa, it's unreal! 🤤"
- If someone says budget, help them find the best value combos
- If asked about the restaurant (location, hours, reservations), say "I'm just the menu expert! But you can contact the restaurant directly for that info 😊"
- Keep responses concise — no walls of text. Use bullet points for lists.

SMART SUGGESTIONS:
- Budget combo (under ₹250): Plain Dosa + Idly Sambar + Lime Mojito
- Premium combo: Cheesy Chicken Dosa + Loaded Fries + Strawberry Mojito
- Kids combo: Lotus Biscoff Sandwich + French Fries + Litchi Mojito
- Spice lovers: Idly Podi + Chicken Pops + Mutton Keema Dosa
- Quick bites: Chicken Momos + French Fries
- Date night: Paneer Burger + Chicken Sandwich + 2 Mojitos

IMPORTANT: Always respond in a way that makes the customer feel welcomed and excited about the food!`;
};

// Smart greeting based on time
const getGreeting = () => {
  const time = getTimeContext();
  const userName = getUserName();
  const nameGreet = userName ? ` ${userName}` : '';

  const greetings = {
    'breakfast': `Good morning${nameGreet}! ☀️ Ready for a delicious breakfast? Our South Indian specials are calling your name!`,
    'lunch': `Hey${nameGreet}! 🍽️ Hungry for lunch? I've got some amazing picks for you. What's the vibe — light or filling?`,
    'snack time': `Hey there${nameGreet}! 🍟 Snack o'clock, am I right? Our Fries and Momos are perfect right about now!`,
    'dinner': `Good evening${nameGreet}! 🌙 Time for a proper dinner! Want me to suggest something special?`,
    'late night': `Hey${nameGreet}, still up? 🌃 Late night cravings hit different! Let me hook you up with something good.`
  };

  return greetings[time.mealTime] || `Hey there${nameGreet}! 👋 What can I get for you today?`;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: getGreeting() }
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

      // Build fresh system prompt with current time
      const systemPrompt = buildSystemPrompt();

      // Add system context as the first message
      const contents = [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: "Got it! I'm Zhaa Assist, your smart restaurant assistant. I know the menu, the current time, and I'm ready to give great recommendations! Let's do this! 😊🍽️" }]
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
              temperature: 0.8,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      // Handle rate limit with retry
      if (response.status === 429 && retryCount < 3) {
        const waitTime = Math.pow(2, retryCount) * 1000;
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

  // Quick suggestion chips
  const quickSuggestions = [
    "What's good right now?",
    "Veg options",
    "Under ₹150",
    "Suggest a combo"
  ];

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar">🍽️</span>
            <div>
              <h3>Zhaa Assist</h3>
              <span className="chatbot-status">Online • Knows the menu</span>
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

        {/* Quick Suggestions - show only when there are few messages */}
        {messages.length <= 2 && !isLoading && (
          <div className="chatbot-suggestions">
            {quickSuggestions.map((text, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => {
                  setInput(text);
                }}
              >
                {text}
              </button>
            ))}
          </div>
        )}

        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything about our menu..."
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
