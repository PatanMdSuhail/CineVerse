import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/user";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered.");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-[40%] mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-teal-400 text-center mb-2">
          Register
        </h1>

        <form
          onSubmit={submitHandler}
          className="w-[100%] mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <div className="my-[2rem]">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-teal-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="h-[65rem] w-[45%] xl:block md:hidden sm:hidden rounded-lg"
      />
    </div>
  );
};
export default Register;

{
  /* <div className="flex justify-center items-center w-full h-screen bg-black">
  <div className="w-[40%] mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-teal-400 text-center mb-6">Register</h2>
    <form onSubmit={submitHandler}>
      <div className="mb-4">
        <label className="block text-white mb-2">Name</label>
        <input type="text" placeholder="Enter name" className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"/>
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Email Address</label>
        <input type="email" placeholder="Enter email" className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"/>
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Password</label>
        <input type="password" placeholder="Enter password" className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"/>
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Confirm Password</label>
        <input type="password" placeholder="Confirm Password" className="p-3 bg-gray-700 text-white rounded-md border border-gray-600 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"/>
      </div>
      <button className="w-full mt-4 bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition duration-200">
        Register
      </button>
    </form>
    <div className="mt-4 text-center">
      <p className="text-gray-600">
        Already have an account?{" "}
        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-teal-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  </div>
</div> */
}
