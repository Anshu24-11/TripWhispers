import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios.config";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN || "";

function parseYMD(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}

function SingleListingNew() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookMsg, setBookMsg] = useState("");

  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  // Fetch listing + user
  useEffect(() => {
    async function fetchData() {
      try {
        const [listingRes, meRes] = await Promise.all([
          API.get(`/listings/${id}`, { withCredentials: true }),
          API.get(`/api/users/currUser`, { withCredentials: true }),
        ]);

        setListing(listingRes.data.listing);
        setCurrUser(meRes.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Map
  useEffect(() => {
    if (!listing || mapRef.current) return;
    if (!listing.geometry?.coordinates) return;

    const [lng, lat] = listing.geometry.coordinates;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 9,
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [listing]);

  //Rating
  function StarRating({ value, onChange }) {
    const labels = [
      "",
      "Terrible",
      "Not good",
      "Average",
      "Very good",
      "Amazing",
    ];

    return (
      <div className="flex gap-2 text-2xl mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            title={labels[star]}
            onClick={() => onChange(star)}
            className={`cursor-pointer transition ${
              star <= value ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  // Booking calculation
  useEffect(() => {
    const start = parseYMD(startDate);
    const end = parseYMD(endDate);

    if (!start || !end) {
      setNights(0);
      setTotalPrice(0);
      return;
    }

    const diff = (end - start) / 86400000;

    if (diff >= 1) {
      setNights(diff);
      setTotalPrice(diff * (listing?.price || 0));
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, listing]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    try {
      await API.post(
        `/listings/${id}/reviews`,
        { review: { rating, comment } },
        { withCredentials: true },
      );
      setRating(1);
      setReviewMsg("Review submitted!");
      setComment("");

      const res = await API.get(`/listings/${id}`);
      setListing(res.data.listing);
    } catch {
      setReviewMsg("Login required.");
    }
  }

  async function fetchListing() {
    try {
      const res = await API.get(`/listings/${id}`, { withCredentials: true });
      setListing(res.data.listing);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Delete review?")) return;

    try {
      await API.delete(`/listings/${id}/reviews/${reviewId}`, {
        withCredentials: true,
      });
      setListing((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r.id !== reviewId),
      }));
      fetchListing();
    } catch {
      alert("can not delete review");
    }
  }

  async function handleDeleteListing() {
    if (!window.confirm("Delete listing?")) return;
    await API.delete(`/listings/${id}`, { withCredentials: true });
    navigate("/");
  }

  async function handleBooking(e) {
    e.preventDefault();
    try {
      await API.post(
        `/bookings`,
        { listingId: id, startDate, endDate },
        { withCredentials: true },
      );
      setBookMsg("Booking confirmed!");
      alert("Booking confirmed");
    } catch (err) {
      setBookMsg(err.response.data.message);
    }
  }

  if (loading) return <div className="p-10">Loading...</div>;
  if (!listing) return <div className="p-10">Not Found</div>;

  const isOwner = currUser && currUser._id === listing.owner?._id;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{listing.title}</h1>

      <div className="rounded-2xl overflow-hidden mb-10">
        <img
          src={listing.image?.url}
          alt={listing.title}
          className="w-full h-[500px] object-cover"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="text-gray-600">
              Hosted by{" "}
              <span className="font-semibold">{listing.owner?.username}</span>
            </p>

            <p className="text-xl font-bold mt-2">₹{listing.price} / night</p>

            <p className="text-gray-600 mt-2">
              {listing.location}, {listing.country}
            </p>

            <p className="mt-4 text-gray-700">{listing.description}</p>
          </div>

          {isOwner && (
            <div className="flex gap-4">
              <Link
                to={`/listings/${listing._id}/edit`}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Edit
              </Link>
              <button
                onClick={handleDeleteListing}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

            {/* ⭐ Star Rating */}
            <StarRating value={rating} onChange={setRating} />

            {currUser && (
              <form onSubmit={handleReviewSubmit} className="space-y-3 mb-6">
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="Write a review"
                />

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Submit
                </button>

                {reviewMsg && <p className="text-sm">{reviewMsg}</p>}
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {listing.reviews?.map((r) => (
                <div
                  key={r._id}
                  className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                >
                  {/* Author */}
                  <p className="font-semibold text-gray-800">
                    @{r.author?.username}
                  </p>

                  {/* Rating */}
                  <div className="text-yellow-500 mt-1">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>

                  {/* Comment */}
                  <p className="mt-3 text-gray-700">{r.comment}</p>

                  {/* Delete button (only author) */}
                  {currUser && currUser._id === r.author?._id && (
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="mt-4 text-sm text-red-600 hover:underline"
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <div ref={mapContainer} className="w-full h-[350px] rounded-xl" />
          </div>
        </div>

        {/* RIGHT - Booking */}
        <div>
          <div className="sticky top-24 border rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              ₹{listing.price} / night
            </h3>

            <form onSubmit={handleBooking} className="space-y-4">
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />

              <div className="bg-gray-100 p-4 rounded-lg">
                Nights: {nights}
                <br />
                Total: ₹{totalPrice}
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg">
                Book Now
              </button>

              {bookMsg && <p className="text-center text-sm mt-2">{bookMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleListingNew;
