import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import SearchParams from "./SearchParams";
import Admin from "./Admin";
import Game from "./pages/Games"

const App = () => {
  return (
    <div>
      <Router>
        <header>
          <Link to="/">
            <h1>Bingooo</h1>
          </Link>
        </header>
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/games">
            <Game />
          </Route>
          <Route path="/">
            <SearchParams />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
