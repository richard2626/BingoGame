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
  // username is unique uuid
  const [username, setUsername] = useState("undefined")

  const sendMsg = (data) => {
    client.send(JSON.stringify(data))
  }

  const handleMessage = (event) => {
    const message = JSON.parse(event.data)
    let sender, user_name, name_list, change_type;

    switch (message.type) {
      case "system":
        sender = "系統訊息"
        break;
      case "user":
        sender = msg.form
        break;
      case "handshake":
        const name = uuidv4().substring(0, 7);
        setUsername(name)
        console.log(name)
        sendMsg({
          type: "login",
          content: name,
        })
        return;
      case "login":
      case "logout":
        user_name = message.content;
        name_list = message.user_list;
        change_type = message.message.type;
        dealUser(user_name, change_type, name_list)
    }

    console.log(`${sender}: ${message.content}`)
  }

  const handleWindowClose = (event) => {
    event.preventDefault()
    event.returnValue = ""

    /*console.log("closing the window")
    var user_info = {
      type: "logout",
      content: username,
    };
    alert(`username: ${username}`)
    sendMsg(user_info);
    console.log(user_info)
    client.close()*/
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
    console.log(`username: ${username}`)
  }, [username])

  const handleLogout = () => {
    console.log("logging out")
    var user_info = {
      type: "logout",
      content: username,
    };
    alert(`username: ${username}`)
    sendMsg(user_info);
    console.log(user_info)
    client.close()
  }

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
            <Admin />
          </Route>
          <Route path="/games">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};