"use client";

import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "./ProtectedRoute";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(""); // Store the response as a single string
  const [socket, setSocket] = useState(null);
  const [history, setHistory] = useState([]); // Store prompt and response history
  const textareaRef = useRef(null);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300 // maxHeight
      )}px`;
    }
  }, [prompt]);

  // Cleanup the WebSocket connection when the component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const sendPrompt = () => {
    if (prompt.trim()) {
      // Attempt to connect WebSocket if not already connected
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        const newSocket = new WebSocket(
          "wss://ray-champion-crow.ngrok-free.app/stream/"
        );
        setSocket(newSocket);

        const timeout = setTimeout(() => {
          if (newSocket.readyState !== WebSocket.OPEN) {
            alert("Unable to connect to the server. Please try again.");
            setSocket(null);
          }
        }, 5000);

        newSocket.onopen = () => {
          clearTimeout(timeout);
          console.log("WebSocket is open, sending prompt...");
          newSocket.send(JSON.stringify({ prompt })); // Send the prompt
          setHistory((prevHistory) => [
            ...prevHistory,
            { prompt, response: "" }, // Add new prompt to history with empty response
          ]);
          setPrompt("");
          setResponse(""); // Clear previous response
        };

        newSocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.token && message.token.trim() !== "") {
              console.log("Token received:", message.token); // Debugging
              setResponse((prevResponse) => prevResponse + message.token);

              // Update the response in the history correctly
              setHistory((prevHistory) => {
                const updatedHistory = [...prevHistory];
                const lastEntry = {
                  ...updatedHistory[updatedHistory.length - 1],
                }; // Create a new object
                lastEntry.response += message.token; // Append token safely
                updatedHistory[updatedHistory.length - 1] = lastEntry; // Update the last entry
                return updatedHistory;
              });
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        newSocket.onerror = () => {
          clearTimeout(timeout);
          alert(
            "There was an error connecting to the server. Please try again."
          );
          setSocket(null);
        };

        newSocket.onclose = () => {
          console.log("WebSocket connection closed.");
          setSocket(null);
        };
      } else {
        socket.send(JSON.stringify({ prompt }));
        setHistory((prevHistory) => [
          ...prevHistory,
          { prompt, response: "" }, // Add new prompt to history with empty response
        ]);
        setPrompt("");
        setResponse(""); // Clear previous response
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="app-container">
        <h1>IELTS</h1>
        <div className="content-container">
          {history.map((entry, index) => (
            <div key={index} className="history-entry">
              <div className="user-prompt">{entry.prompt}</div>
              <div className="tokens-container">
                {entry.response.split("\n").map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < entry.response.split("\n").length - 1 && (
                      <br />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <textarea
            id="promptInput"
            ref={textareaRef}
            rows="1"
            placeholder="Type your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              minHeight: "100px",
              maxHeight: "200px",
              resize: "none",
            }}
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
            justify-content: center;
            height: 100vh;
            width: 100%;
            overflow: hidden;
          }

          .content-container {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start; /* Align history entries to the top */
            overflow-y: auto;
            padding: 10px;
          }

          .input-container {
            width: 80%;
            max-width: 600px;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          h1 {
            font-size: 22px;
            color: #fff;
            margin-bottom: 20px;
            text-align: center;
          }

          .history-entry {
            width: 80%;
            max-width: 600px;
            margin-bottom: 20px;
          }

          .user-prompt {
            padding: 10px;
            border-radius: 8px;
            background-color: #444;
            border: 1px solid #555;
            color: rgb(140, 179, 188);
            font-size: 15px;
            word-wrap: break-word;
            text-align: start;
          }

          .tokens-container {
            margin-top: 10px;
            white-space: pre-wrap;
            word-wrap: break-word;
            text-align: start;
            font-size: 15px;
            color: #ddd;
          }

          #promptInput {
            width: 100%;
            min-height: 30px;
            padding: 10px;
            margin-top: 20px;
            border: 1px solid #555;
            border-radius: 8px;
            font-size: 16px;
            background-color: #222;
            color: #fff;
            overflow-y: auto;
          }

          #sendButton {
            width: 100%;
            padding: 12px;
            margin-top: 12px;
            background-color: #4caf50;
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
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
// Compare this snippet from client/app/%28root%29/_app.jsx:
