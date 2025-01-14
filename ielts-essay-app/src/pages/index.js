import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  // Fetch data using GET
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/data");
      setMessage(response.data.message);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Send data using POST and fetch data automatically
  const sendData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/data", {
        name: "Next.js User",
      });
      setMessage(response.data.message); // Update message with response from POST

      // Automatically fetch data after sending data
      fetchData();
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div>
      <h1>Connect Next.js to Python Backend</h1>
      <button onClick={sendData}>Send Data</button>
      <h2>Response: {message}</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
