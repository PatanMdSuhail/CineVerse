import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/user";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-black">
      <div className="w-[40%] mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* <!-- Title Inside the Form --> */}
        <h1 className="text-3xl font-bold text-teal-400 text-center mb-6">
          Sign In
        </h1>

        {/* <!-- Form --> */}
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-white mb-2">
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
          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-4 bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition duration-200"
          >
            {isLoading ? "Signing In ..." : "Sign In"}
          </button>
          {isLoading && <Loader />}
        </form>

        {/* <!-- Text Below Button --> */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-teal-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* <!-- Image --> */}
      <img
        src="https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop"
        alt=""
        className="w-[45%] h-[50rem] rounded-lg object-cover shadow-lg"
      />
    </div>
  );
};

export default Login;
