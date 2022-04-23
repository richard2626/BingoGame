import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Admin from "./pages/Admin";
import Game from "./pages/Games"
import Home from "./pages/Home"
import { useEffect, useState } from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket"
import { v4 as uuidv4 } from "uuid"
import Nav from "./components/nav"

const client = new W3CWebSocket("ws://127.0.0.1:1234")

export function App() {
  // unique uuid
  const [uid, setUid] = useState("undefined")
  const [username, setUsername] = useState("anonymous")
  const [messages, setMessages] = useState([])
  const [sendMessage, setSendMessage] = useState("")
  const [online, setOnline] = useState(0)
  const [mode, setMode] = useState("picking") // ["picking"|"gaming"|"changing"]
  const [buttonValue, setButtonValue] = useState("0")

  //const [temp,setTemp] = useState([]) // it could be anything
  const array = new Array(25)
  const [bingoList,setBingoList] = useState(array.fill(0, 0, 25))

  //發送訊息給Server
  const sendMsg = (data) => {
    console.log(data)
    client.send(JSON.stringify(data))
  }
  //處理Server發來的訊息
  const handleMessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message)
    let sender, user_name, name_list, change_type;
    let new_message = ""
    console.log("Hi")
    setOnline(message["online"])
    switch (message["type"]) {
      case "system":
        console.log("system")
        sender = "系統訊息"
        new_message = `SYSTEM: ${message["content"]}`
        break;
      case "user":
        console.log("user")
        sender = message["from"]
        new_message = `${sender}: ${message["content"]}`
        break;
      case "handshake":
        const name = uuidv4().substring(0, 7);
        setUid(name)
        console.log(name)
        sendMsg({
          type: "login",
          content: name,
        })
        return;
      case "login":
        console.log("Someone is here")
        new_message = `${message["content"]} is here`
        break;
      case "logout":
        new_message = `${message["content"]} left us QAQ`
        //new_message = "QAQ"
        break;
      case "player_send_number":
        new_message = `${message["content"]}`
        break;
      case "change_name":
        new_message = `${message["from"]} changed to ${message["to"]}`
        break;
      case "reject":
        alert("game started already")
        break;
    }
    setMessages(messages => [...messages, new_message])
  }

  const handleWindowClose = async (event) => {
    event.preventDefault()
    event.returnValue = ""
  }

  useEffect(() => {
    client.onopen = () => {
      console.log("websocket connected")
    }
    client.onmessage = (message) => { handleMessage(message) }
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose)
    }
  }, [])

  useEffect(() => {
    console.log(`uid: ${uid}`)
  }, [uid])

  useEffect(() => {
    if (sendMessage !== "") {
      sendMsg({
        type: "send",
        content: sendMessage
      })
    }
  }, [sendMessage])
  
  useEffect(() => {
    if (buttonValue !== "0"){
      sendMsg({
        type: "sendnumber",
        content: buttonValue,
      })
    }
  },[buttonValue])

  useEffect(() => {
    if (username !== "anonymous") {
      sendMsg({
        type: "update_name",
        content: username
      })
    }
  }, [username])

  useEffect(() => {
    if (mode === "gaming") {
      sendMsg({
        "type": "ready",
        "content": bingoList,
      })
    }
  }, [mode])

  return (
    <div className="bg-blue-200">
      <Router>
        <header className="text-center text-4xl font-bold">
          <Link to="/">
            <h1>Bingooo</h1>
          </Link>
        </header>
        <Nav />

        {/* Routes */}
        <Switch>
          <Route path="/admin">
            <Admin pack={
              {
                messages:messages,
                sendMessage :sendMessage,
                setSendMessage :setSendMessage,
                username : username,
                setUsername: setUsername,
                online : online,
                mode: mode,
                setMode :setMode,
                
                
              }
            }/>
          </Route>
          <Route path="/games">
            <Game pack={{
              messages: messages,
              sendMessage: sendMessage,
              setSendMessage: setSendMessage,
              online: online,
              username: username,
              setUsername: setUsername,
              mode: mode,
              setMode: setMode,
              bingoList: bingoList,
              setBingoList: setBingoList,
              buttonValue: buttonValue,
              setButtonValue: setButtonValue,
            }} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};