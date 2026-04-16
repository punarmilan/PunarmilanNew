import { LogIn } from "lucide-react";
import { useState } from "react";
import { Await, Link } from "react-router-dom";
import axios from "axios";


const Login = () => {

  const [Password, setPasswordValue] = useState("");
  const [userId, setUserIdValue] = useState("");

const setPassword = (e) =>{
setPasswordValue(e.target.value);
}
const setUserId = (e) =>{
setUserIdValue(e.target.value);
}  
 const handleSubmit = async (e) => {
  e.preventDefault();

  // FIX: Use the state variables, not the function names
  const data = {
    "userId": userId,     // Use the variable 'userId'
    "password": Password // Use the variable 'Password'
  };

  console.log("Sending data:", data);

  try {
    const response = await axios.post("http://localhost:8080/loginUser", data);
    
    // Pro-tip: Check for boolean types or specific status codes
    // if (response.data === false || response.data === "false") {
    //   alert("Invalid User Id or Password");
    // } else {
    //   alert("Login Successful");
    // }
    if (response.data === false || response.data === "false") {
  alert("Invalid User Id or Password");
} else {
  alert("Login Successful");

  // ✅ Save login session
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userId", userId);

  window.location.href = "/dashboard";
}
  } catch (error) {
    console.error("Connection error:", error);
    alert("Could not connect to the server.");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <LogIn size={24} /> Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Enter your user id" 
            value={userId}
            onChange={setUserId}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            placeholder=" enter your Password"
            value={Password}
            onChange={setPassword}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

      
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;