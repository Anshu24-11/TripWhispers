import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.config";

export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handlesubmit triggered");
    console.log("handleSubmit triggered");
    const data = new FormData();
    data.append("listing[title]", formData.title);
    data.append("listing[description]", formData.description);
    data.append("listing[price]", formData.price);
    data.append("listing[country]", formData.country);
    data.append("listing[location]", formData.location);
    data.append("listing[category]", formData.category);
    data.append("listing[image]", image);

    try {
      setLoading(true);
      const res = await API.post(`/listings`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      navigate(`/listings/${res.data.listing._id}`);
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "80px",
      }}
    >
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40">
        <h1 className="text-3xl font-semibold mb-6">Create A New Listing</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Add a catchy title"
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
              placeholder="Enter description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block mb-1 font-medium">
              Upload Listing Image
            </label>
            <input type="file" onChange={handleFile} />
          </div>

          {/* Price + Category */}
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
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option>Select a category</option>
                <option>Trending</option>
                <option>Rooms</option>
                <option>Iconic cities</option>
                <option>Mountains</option>
                <option>Castles</option>
                <option>Amazing Pools</option>
                <option>Camping</option>
                <option> "Farm"</option>
                <option>Arctic</option>
                <option>Domes</option>
                <option>Boats</option>
              </select>
            </div>
          </div>

          {/* Country */}
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
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Add Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
