"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState(""); // State to store the user prompt
  const [tokens, setTokens] = useState([]);
  const [socket, setSocket] = useState(null);
  const [tokensVisible, setTokensVisible] = useState(false);

  const sendPrompt = () => {
    if (prompt.trim() && socket) {
      // Wait until WebSocket is open
      if (socket.readyState === WebSocket.OPEN) {
        // Send the prompt if the socket is open
        socket.send(JSON.stringify({ prompt }));
        setUserPrompt(prompt); // Set the userPrompt to the current input
        setPrompt(""); // Clear the prompt
        setTokensVisible(true);
        setTokens([]); // Clear tokens on new prompt
      } else {
        // If not open yet, wait for the WebSocket to open and then send the prompt
        socket.onopen = () => {
          console.log("WebSocket is open, sending prompt...");
          socket.send(JSON.stringify({ prompt }));
          setUserPrompt(prompt); // Set the userPrompt to the current input
          setPrompt(""); // Clear the prompt
          setTokensVisible(true);
          setTokens([]); // Clear tokens on new prompt
        };
      }
    }
  };      

  return (
    <div className="app-container">
      <h1>WebSocket Token Display</h1>
      <div className="content-container">
        {tokensVisible && (
          <>
            <div id="userPrompt" className="user-prompt">
              {userPrompt}
            </div>
            <div id="tokensContainer" className="tokens-container">
              {tokens.map((token, index) =>
                token === "\n" ? (
                  <br key={index} />
                ) : (
                  <span key={index}>{token}</span>
                )
              )}
            </div>
          </>
        )}
      </div>
      <div className="input-container">
        <textarea
          id="promptInput"
          rows="4"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          id="sendButton"
          onClick={sendPrompt}
          disabled={!prompt.trim()} // Disable the button if the prompt is empty
        >
          Send
        </button>
      </div>
      <style jsx>{`
        .app-container {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #1e1e1e;
          color: #ddd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        h1 {
          font-size: 22px;
          color: #fff;
          margin-bottom: 20px;
          text-align: center;
        }

        .content-container {
          width: 100%;
          height: calc(100vh - 160px); /* Remaining height after title and input */
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .user-prompt {
          margin-top: 20px;
          padding: 10px;
          border-radius: 8px;
          background-color: #444;
          border: 1px solid #555;
          color: #fff;
          width: 80%;
          max-width: 490px;
          font-size: 16px;
          word-wrap: break-word;
          margin-left: 15%; /* Shift the user prompt box to the right */
        }

        .tokens-container {
          margin-top: 20px;
          width: 80%;
          max-width: 600px;
          min-height: 100px;
          max-height: 400px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .input-container {
          width: 80%;
          max-width: 600px;
          margin-top: 20px;
        }

        #promptInput {
          width: 100%;
          min-height: 40px;
          padding: 10px;
          margin-top: 20px;
          border: 1px solid #555;
          border-radius: 8px;
          font-size: 16px;
          background-color: #222;
          color: #fff;
        }

        #sendButton {
          width: 100%;
          padding: 12px;
          margin-top: 12px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        #sendButton:hover {
          background-color: #45a049;
        }

        #sendButton:disabled {
          background-color: #808080;
          cursor: not-allowed;
        }

        /* Flexbox for centralizing layout */
        .app-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        #promptInput, #sendButton {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
