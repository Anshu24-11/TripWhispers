import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.config";

function Listings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`listings`)
      .then((res) => {
        setListings(res.data.allListings);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-12 py-16">
      {/* Heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore Our Listings
        </h1>
        <p className="text-gray-500 mt-2">
          Discover handpicked stays around the world
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {listings.map((listing) => (
          <div
            key={listing._id}
            onClick={() => navigate(`/listings/${listing._id}`)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl 
                       hover:-translate-y-1 transition-all duration-300 
                       cursor-pointer overflow-hidden"
          >
            {/* Image */}
            <div className="h-52 overflow-hidden">
              <img
                src={listing.image?.url}
                alt={listing.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                {listing.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1">{listing.location}</p>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">From</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{listing.price}
                  </p>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;
