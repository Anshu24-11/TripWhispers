import { BrowserRouter, Routes, Route } from "react-router-dom";
import Listing from "./pages/Listing";
import SingleListing from "./pages/SingleListing";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyBooking from "./pages/MyBooking";
import Chatbot from "./components/Chatbot";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Listing />} />
        <Route path="/listings/search" element={<Search />}></Route>
        <Route path="/listings/:id" element={<SingleListing />} />
        <Route path="/api/users/login" element={<Login />} />
        <Route path="/api/users/signup" element={<SignUp />} />
        <Route path="/listings/newListing" element={<CreateListing />}></Route>
        <Route path="listings/:id/edit" element={<EditListing />}></Route>
        <Route path="/bookings/mybookings" element={<MyBooking />}></Route>
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
