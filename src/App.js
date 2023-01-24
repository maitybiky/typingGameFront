import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Meet from "./pages/Meet";
import { Toaster } from "react-hot-toast";
import TypingRoom from "./pages/TypingRoom";
import Score from "./pages/Score";
import Game from "./pages/Game";
import Header from "./common/Header";
import NavPage from "./common/NavPage";
import HomeSlash from "./common/HomeSlash";

function App() {
  return (
    <div className="App">
      <Router>
        <Toaster />
        <Routes>
          <Route element={<NavPage/>}>
          <Route path="/" element={<HomeSlash />} />
          {/* <Route path="/chat" element={<Home />} /> */}
          <Route path="/game" element={<Game />} />
          {/* <Route path="/score" element={<Score />} /> */}

          </Route>
          <Route path="/meet" element={<Meet />} />
          <Route path="/type-room" element={<TypingRoom />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
