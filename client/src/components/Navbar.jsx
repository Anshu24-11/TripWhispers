import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/axios.config";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/listings/search?query=${search}`);
    setSearch("");
  };

  // Check logged-in user
  useEffect(() => {
    API.get("/api/users/currUser", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setCurrentUser(res.data.user);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout", {}, { withCredentials: true });
      setCurrentUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Wanderlust
        </Link>
        {/* Search */}
        <div className="flex items-center">
          <input
            placeholder="search listings"
            className="flex items-center border rounded-xl p-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
          <button
            onClick={handleSearch}
            className="border rounded-lg hover:border-red-500 transition shadow-sm p-2 m-2 hover:bg-red-500 w-16"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Right Side Links */}
        <div className="flex items-center gap-8 text-gray-700 font-medium">
          {currentUser ? (
            <>
              <Link
                to="/bookings/mybookings"
                className="px-5 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition shadow-sm"
              >
                My Bookings
              </Link>
              {/* Your Home */}
              <Link
                to="/listings/newListing"
                className="hover:text-blue-600 transition"
              >
                Your Home
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/api/users/login"
                className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                to="/api/users/signup"
                className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
