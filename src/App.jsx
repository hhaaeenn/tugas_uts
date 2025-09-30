import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllNews from "./pages/AllNews";
import Detail from "./pages/Detail";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all" element={<AllNews />} />
            <Route path="/detail" element={<Detail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
