import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Admin from "./pages/Admin";
import Game from "./pages/Games"
import Home from "./pages/Home"

import { useEffect, useState } from "react";

export function App() {
  // username is unique uuid
  const [username, setUsername] = useState("undefined")
  const [connection, setConnection] = useState()

  const handleMessage = (event) => {
    const message = JSON.parse(event.data)
    let sender, user_name, name_list, change_type;

    switch (message.type) {
      case "system":
        sender = "系統訊息";
        break;
      case "user":
        sender = `使用者訊息: ${message.from}`
        break;
      case "handshake":
        let user_info = {
          type: "login",
          content: username,
        }
        sendMessage(user_info)
        return;
      case "logout":
        user_name = message.content;
        user_list = message.user_list;
        change_type = message.type;
        dealUser(user_name, change_type, name_list);
        return;
    }
    listMessage(`${sender}${message.content}`)
  }

  /* Sending message */
  const sendMsg = (msg) =>{
    console.log(`sending message`)
    WSH.send(JSON.stringify(msg))
  }

  useEffect(() => {
    setConnection(new WebSocket("ws://127.0.0.1:1234"))
    const name = setRandomUUID(8,16)
    setUsername(name)
    console.log(`my uuid: ${username}`)
    console.log(connection)
    connection.onopen = ()=>{
      console.log("connected")
    }
    connection.onmessge = (event) => {handleMessage(event)}
    connection.onerror = (event) => { console.log(`Something went wrong ${event}`) }
    return () => {
      sendMsg({
        type: "logout",
        content: username,
      })
      connection.close()
    }
  }, [])

  return (
    <div>
      <Router>
        <header>
          <Link to="/">
            <h1>Bingooo</h1>
          </Link>
        </header>
        <nav>
          <Link to="/game">
            開始遊戲
          </Link>
        </nav>

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


const setRandomUUID = (len, radix) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; ++i) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}