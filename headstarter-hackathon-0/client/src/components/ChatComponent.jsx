import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(`Prepare me a time table to finish Portfolio Website task that starts on 28 July 10 PM and ends on 29 July 10 PM`);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBMhpM4Wc8JCQbMfzU-0iEF0xxbOYWvYiY',
          {
            "contents": [
              {
                "parts": [
                  {
                    "text": input
                  }
                ]
              }
            ]
          }
        );
        console.log(response);
        const botResponse = response.data.candidates[0].content.parts[0].text.slice(0, 1000);
        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  return (
    <section id='ai'>
      <div className='d-flex justify-content-center align-items-center'>
        <motion.div
          initial={{ y: 90, scale: 0.7 }}
          whileInView={{ y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="chat-container"
        >
          <h1 className="chat-header">Chat Now</h1>
          <div className="message-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.user ? 'user' : 'bot'}`}>
                <div className="bubble">
                  <ReactMarkdown>
                    {msg.text.slice(0, 1000)}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center mt-2 mb-4">
                <div className="spinner-border" role="status">
                  <span style={{color: 'black'}} className="sr-only">Loading...</span>
                </div>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
