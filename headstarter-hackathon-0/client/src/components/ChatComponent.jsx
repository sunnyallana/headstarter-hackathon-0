import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(
    `Prepare me a time table to finish Portfolio Website task that starts on 28 july 10 pm and ends on 29 july 10 pm`
  );
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput("");

      try {
        setLoading(true);
        const result = await model.generateContentStream([input]);

        let botResponse = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          botResponse += chunkText;
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && !lastMessage.user) {
              lastMessage.text += chunkText;
              return [...prevMessages.slice(0, -1), lastMessage];
            } else {
              return [...prevMessages, { text: chunkText, user: false }];
            }
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error sending message:", error);
        setLoading(false);
        setMessages([
          ...newMessages,
          { text: "Error: Could not get response from AI", user: false },
        ]);
      }
    }
  };

  return (
    <section id="ai">
      <div className="d-flex justify-content-center align-items-center bgcolor">
        <motion.div
          initial={{ y: 90, scale: 0.7 }}
          whileInView={{ y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="container w-50 rounded h-100 bgColor"
          style={{ margin: "10rem 0" }}
        >
          <h1 className="fw-bold text-light text-center mt-4">Chat Now</h1>
          <div className="bg-white w-100 shadow-lg rounded overflow-hidden">
            <div className="p-4 h-50 overflow-auto mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${
                    msg.user ? "justify-content-end" : "justify-content-start"
                  } mb-2`}
                >
                  <div
                    className={`rounded p-2 shadow-md overflow-hidden d-flex flex-wrap ${
                      msg.user ? "bgColor text-light" : "bg-dark gradientText"
                    }`}
                  >
                    <ReactMarkdown>{msg.text.slice(0, 1000)}</ReactMarkdown>
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
            <div
              className="p-3 border-top d-flex"
              style={{ borderColor: "gray" }}
            >
              <input
                type="text"
                className="form-control flex-grow-1"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
    </section>
  );
}
