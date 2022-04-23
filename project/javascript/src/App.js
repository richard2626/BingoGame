import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

// import Admin from "./pages/Admin";
import Game from "./pages/Games"
import Home from "./pages/Home"
import { useEffect, useState } from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket"
import { v4 as uuidv4 } from "uuid"
import Nav from "./components/nav"

import { useDispatch, useSelector } from "react-redux";
import { updateName, updateUUID, updateBingoList, updateBingoSelected, updateMessages, updateMyTurn, updateOnlineMember } from "./redux/actions"
import { store } from "./redux/store";

const client = new W3CWebSocket("ws://127.0.0.1:1234")

export function App() {
  // unique uuid
  const dispatch = useDispatch()
  const [username, setUsername] = useState(useSelector(state => state.profile.name))
  const [mode, setMode] = useState(useSelector(state => state.profile.gamemode)) // ["picking"|"gaming"|"changing"]
  const [myTurn, setMyTurn] = useState(useSelector(state => state.profile.myTurn))

  const [sendMessage, setSendMessage] = useState("")
  const [buttonValue, setButtonValue] = useState("0")

  store.subscribe(() => {
    setMode(store.getState().profile.mode)
    setMyTurn(store.getState().profile.myTurn)
    setUsername(store.getState().profile.username)
  })

  //檢查賓果條數 & 是否已按過
  const checkBingoList = new Array(25)
  for (i = 0; i < 25; i++) {
    checkBingoList[i] = new Array(2)
  }

  //發送訊息給Server
  const sendMsg = (data) => {
    console.log(data)
    client.send(JSON.stringify(data))
  }

  //處理Server發來的訊息
  const handleMessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message)
    let sender;
    let new_message = ""
    console.log("Hi")
    dispatch(updateOnlineMember({
      online: message["online"]
    }))
    switch (message["type"]) {
      case "system":
        console.log("system")
        sender = "系統訊息"
        new_message = `SYSTEM: ${message["content"]}`
        console.log(`player ${typeof (player)}`)
        if (message["player"] === uid) {
          // it's my turn
          dispatch(updateMyTurn(
            { myTurn: true }
          ))
          console.log("myturn!!")
        }
        break;
      case "user":
        console.log("user")
        sender = message["from"]
        new_message = `${sender}: ${message["content"]}`
        break;
      case "handshake":
        const name = uuidv4().substring(0, 7);
        dispatch(updateUUID({
          uid: name
        }))
        console.log(name)
        sendMsg({
          type: "login",
          content: name,
        })
        return;
      case "login":
        //new_message = `${message["content"]} 已加入`
        break;
      case "logout":
        new_message = `${message["content"]} 離開了遊戲`
        break;
      case "player_send_number":
        new_message = `${message["content"]}`
        break;
      case "change_name":
        //new_message = `${message["from"]} changed to ${message["to"]}`
        new_message = `${message["to"]} 已加入`
        break;
      case "reject":
        alert("遊戲不開放")
        break;
    }
    dispatch(updateMessages({
      message: new_message
    }))
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
    if (sendMessage !== "") {
      sendMsg({
        type: "send",
        content: sendMessage
      })
    }
    setSendMessage("")
  }, [sendMessage])

  useEffect(() => {
    if (buttonValue !== "0") {
      if (myTurn) {
        sendMsg({
          type: "sendnumber",
          content: buttonValue,
        })
      }
    }
  }, [buttonValue])

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
          {/*
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
          */}
          <Route path="/games">
            <Game pack={{
              sendMessage: sendMessage,
              setSendMessage: setSendMessage,
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