import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios.config";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
  });
  const [image, setImage] = useState(null);

  //existing listing
  useEffect(() => {
    async function fetchData() {
      try {
        const [listingRes] = await Promise.all([
          API.get(`/listings/${id}`, { withCredentials: true }),
        ]);
        setListing(listingRes.data.listing);

        setFormData({
          title: listingRes.data.listing.title || "",
          description: listingRes.data.listing.description || "",
          price: listingRes.data.listing.price || "",
          country: listingRes.data.listing.country || "",
          location: listingRes.data.listing.location || "",
        });
      } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || "Something went wrong";
        setError(message);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("listing[title]", formData.title);
      data.append("listing[description]", formData.description);
      data.append("listing[price]", formData.price);
      data.append("listing[country]", formData.country);
      data.append("listing[location]", formData.location);

      if (image) {
        data.append("listing[image]", image);
      }

      await API.put(`/listings/${id}`, data, {
        withCredentials: true,
      });
      navigate(`/listings/${id}`);
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };

  if (!listing) return <p>Loading.....</p>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Edit your listing</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Original Image */}
        <div>
          <p className="font-medium mb-2">Original Listing Image</p>
          <img
            src={listing.image?.url}
            alt="listing"
            className="w-64 rounded-lg shadow"
          />
        </div>

        {/* Upload New Image */}
        <div>
          <label className="block mb-1 font-medium">Upload New Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        {/* Price + Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Update Listing
        </button>
      </form>
    </div>
  );
}
