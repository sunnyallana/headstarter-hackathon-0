import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Chat.css';
import { motion } from 'framer-motion';
import CoverImageComponent from '../CoverImageComponent';
import { useUser } from '../context/UserContext';

export default function ChatNow() {
  const { user } = useUser();

  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(`Tell me about  ${user.enquiry} in MedTech in few words?`);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=API_KEY_WO_QUOTES',
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
        const botResponse = response.data.candidates[0].content.parts[0].text.slice(0,1000);
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
    <>
        <CoverImageComponent image="HealthCareCoverImage.jpg" title="Chat with Experts to Know About MedTech"/>
<div className='d-flex justify-content-center align-items center'>

    <motion.div
    initial={{ y:90 ,scale:0.7}}
    whileInView={{y:0,scale:1}}
    transition={{ duration: 1}} className="container w-50 rounded h-100 bgColor" style={{margin:"10rem 0"}}>
      {user ? (
        <h2 className='text-center text-light fw-bold pt-3'>Welcome, {user.fullName}! How can we assist you today?</h2>
      ) : (
        <p>Welcome! Please register to start chatting.</p>
      )}
      <h1 className=" fw-bold text-light text-center mt-4">Chat Now</h1>
    
      <div className=" bg-white w-100 shadow-lg rounded overflow-hidden" >
        <div className=" p-4 h-50 overflow-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`d-flex  ${msg.user ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
              <div className={`rounded p-2 shadow-md overflow-hidden d-flex flex-wrap ${msg.user ? 'bgColor text-light' : 'bg-dark gradientText'}`}>
                <ReactMarkdown>
                  {msg.text.slice(0,1000)}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center mt-2 mb-4">
              <div className="spinner-border gradientText" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-top d-flex" style={{borderColor:"gray"}}>
          <input
            type="text"
            className="form-control flex-grow-1"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
          
            className="btn btn-primary ml-2"
            onClick={handleSendMessage}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </motion.div>
    

</div>
    </>
  );
}