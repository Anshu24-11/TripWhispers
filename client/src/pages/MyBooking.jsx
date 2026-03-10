import { useEffect, useState } from "react";
import API from "../api/axios.config";

export default function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get("/bookings/mybookings", {
          withCredentials: true,
        });

        setBookings(res.data.bookings);
      } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || "Something went wrong";
        setError(message);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

      {error && <p className="text-red-500">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex gap-4 border rounded-lg p-4 mb-4 shadow-sm"
          >
            {/* Listing Image */}
            <img
              src={booking.listing.image.url}
              alt={booking.listing.title}
              className="w-40 h-28 object-cover rounded"
            />

            {/* Booking Info */}
            <div>
              <h2 className="text-lg font-semibold">{booking.listing.title}</h2>

              <p className="text-gray-600">
                {booking.listing.location}, {booking.listing.country}
              </p>

              <p className="text-sm mt-2">
                Check-in: {new Date(booking.startDate).toLocaleDateString()}
              </p>

              <p className="text-sm">
                Check-out: {new Date(booking.endDate).toLocaleDateString()}
              </p>

              <p className="font-semibold mt-2">Total: ₹{booking.totalPrice}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
