import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import TruthLife from "./pages/TruthLife"; // Home page
import CommunityPage from "./pages/Community";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Footer from "./pages/Footer";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

function App() {

    const isLoggedIn = localStorage.getItem("isLoggedIn");
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<TruthLife />} />
          <Route path="/community" element={<CommunityPage />} />
            <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
            <Route
          path="/dashboard"
          element={isLoggedIn === "true" ? <Dashboard /> : <Login />}
          
        />
          
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
        
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;