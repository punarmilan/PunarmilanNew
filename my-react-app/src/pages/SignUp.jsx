import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";

const SignUp = () => {


  const [register, setRegister] = React.useState({
    name: "",
    email: "",
    password: "",
  }
);

  const handleChange = (e) =>{
    setRegister({
      ...register,
      [e.target.name]: e.target.value
    })  
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(register);

     try{
      const response = await axios.post('http://localhost:8080/addUser', register);
      console.log(response.data);
      alert("data added succsefully");
     }catch (error){
      console.log(error);
     }
     
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <UserPlus size={24} /> Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder=" Enter your Full Name"
            value={register.name} onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
             value={register.email}
             onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
             value={register.password}
             onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;