import "./index.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Success from "./pages/Success";
import Counter from "./contexts/Counter";
import Header from "./pages/Header";
import CreatePosts from "./pages/CreatePosts";
import Compilation from "./pages/Compilation";

function App() {
  return (
    <Router>
      <Counter>
        <div className="flex app-container">
          <Header />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/compilation" element={<Compilation />} />
              <Route path="/success" element={<Success />} />
              <Route path="/createposts" element={<CreatePosts />} />
            </Routes>
          </div>
        </div>
      </Counter>
    </Router>
  );
}

export default App;
