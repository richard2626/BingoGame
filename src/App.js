import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import SearchParams from "./SearchParams";
import Details from "./Details";
import Admin from "./Admin";

const App = () => {
  return (
    <div>
      <Router>
        <header>
          <Link to="/">
            <h1>Bingo</h1>
          </Link>
        </header>
        <Switch>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <SearchParams />
          </Route>
          <Route path="/details/:id">
            <Details />
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
