import './App.css';
import { useState, useEffect, useRef } from 'react'
import io from "socket.io-client"
import { nanoid } from 'nanoid'
import moment from "moment"
const socket = io("http://localhost:5000")


function App() {
  const userName = nanoid(4)

  // Established the connection between backend

  // console.log(socket)

  // All States 
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // Send Chat

  const sendChat = (e) => {
    e.preventDefault()
    const time = moment()
    socket.emit("chat", { message: message, userName: userName, time: time })
    setMessage("")
  }

  console.log(chat)

  // Update the chat array

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat]);

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload])
    });
  })
  return (
    <div className="App">
      <div>
        <div className="notice">
          <h1>Enormous Chat App</h1>
          <h3>Note : </h3>
          <ul>
            <li>Message is not recorded anywhere.</li>
            <li>Fill free to chat</li>
          </ul>
        </div>
        <div className="chat">
          <div className="messageSender">
            <form onSubmit={sendChat}>
              <input
                type="text"
                name="chat"
                placeholder="send text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
          {chat.map((payload, index) => {
            return (
              <div key={index} className="message" style={{ justifyContent: payload.userName == userName ? "right" : "left" }}>
                <h4>{payload.userName}</h4>
                <p>{payload.message}</p>
                <p className="time">{moment(payload.time).calendar()}</p>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

      </div>

    </div>
  );
}

export default App;
