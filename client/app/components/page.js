"use client";
import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { logout } from "../Firebase/auth";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState(null);
  const [history, setHistory] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        300
      )}px`;
    }
  }, [prompt]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const sendPrompt = () => {
    if (prompt.trim()) {
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
          newSocket.send(JSON.stringify({ prompt }));
          setHistory((prevHistory) => [
            ...prevHistory,
            { prompt, response: "" },
          ]);
          setPrompt("");
          setResponse("");
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
                const lastEntry = { ...updatedHistory[updatedHistory.length - 1] }; // Create a new object
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
        setHistory((prevHistory) => [...prevHistory, { prompt, response: "" }]);
        setPrompt("");
        setResponse("");
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="app-container">
        <nav className="w-full bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
          {/* ✅ Logo / Title */}
          <h1 className="text-xl font-bold ml-4">IELTS</h1>

          {/* ✅ Logout Button */}
          <button
            className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 mr-4"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
        <div className="content-container">
          {history.map((entry, index) => (
            <div key={index} className="history-entry">
              <div className="user-prompt">{entry.prompt}</div>
              <div className="tokens-container">
                {entry.response.split("\n").map((line, lineIndex, arr) => (
                  <React.Fragment key={lineIndex}>
                    {line.startsWith("#") || line.startsWith("*") ? (
                      <>
                        {lineIndex > 0 && <br />}
                        <strong>{line.substring(1).trim()}</strong>
                      </>
                    ) : line.startsWith("-") ? (
                      // Check if the line matches specific keywords (e.g., Strengths, Vocabulary, Grammar)
                      line.includes("Strengths:") || line.includes("Vocabulary:") || line.includes("Grammar:")  || line.includes("Areas for improvement:") ? (
                        <>
                          {lineIndex > 0 && <br />}
                          <strong>{line.trim()}</strong>
                        </>
                      ) : (
                        <>
                          <ul>
                            <li>{line.substring(1).trim()}</li>
                          </ul>
                        </>
                      )
                    ) : (
                      line
                    )}
                    {lineIndex < arr.length - 1 && !line.startsWith("-") && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <div className="textarea-wrapper">
            <textarea
              id="promptInput"
              ref={textareaRef}
              rows="3"
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              id="sendButton"
              onClick={sendPrompt}
              disabled={!prompt.trim()}
            >
              📩
            </button>
          </div>
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
            justify-content: flex-start;
            overflow-y: auto;
            padding: 10px;
          }

          .input-container {
            width: 90%;
            max-width: 700px;
            margin-top: 0px;
          }

          .textarea-wrapper {
            position: relative;
            width: 100%;
          }

          textarea {
            width: 80%;
            min-height: 80px;
            max-height: 150px;
            resize: none;
            padding: 10px;
            padding-bottom: 45px; /* Creates space for button inside */
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .history-entry {
            width: 90%;
            max-width: 700px;
            margin-bottom: 40px;
          }

          .user-prompt {
            padding: 10px;
            border-radius: 8px;
            width: 90%;
            margin-left: auto;  
            dispaly: block;
            background-color: #444;
            border: 1px solid #555;
            color: rgb(140, 179, 188);
            font-size: 15px;
            word-wrap: break-word;
            text-align: start;
          }

          .tokens-container {
            margin-top: 40px;
            white-space: pre-wrap;
            word-wrap: break-word;
            text-align: start;
            font-size: 15px;
            color: #ddd;
          }

          .tokens-container ul {
            list-style: disc outside none;
            text-align: justify;
            margin-top: 7px;
            margin-bottom: 2px;
            padding-left: 50px; /* Adjust this value as needed */
            // text-indent: -24.5px; /* Adjust this to fine-tune bullet position */
            font-size: 1rem;
            color: #ddd;
            line-height: 1.5;
          }

          #promptInput {
            width: 100%;
            min-height: 30px;
            padding: 10px;
            margin-top: 20px;
            border: 1px solid #555;
            border-radius: 8px;
            font-size: 15px;
            background-color: #222;
            color: #fff;
            overflow-y: auto;
          }

          #sendButton {
            position: absolute;
            bottom: 9px;
            right: 3px;
            height: 30px;
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
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