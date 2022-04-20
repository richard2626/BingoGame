import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Admin from "./pages/Admin";
import Game from "./pages/Games"
import Home from "./pages/Home"

import WebSocket from "ws"
import { useEffect } from "react/cjs/react.production.min";


export function App() {
  const [username,setUsername] = useState("undefined")
  const ws = new WebSocket("ws://127.0.0.1:1234")

  useEffect(()=>{
    
  },[])

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
            <Admin ws={ws}/>
          </Route>
          <Route path="/games">
            <Game ws={ws}/>
          </Route>
          <Route path="/">
            <Home ws={ws}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

