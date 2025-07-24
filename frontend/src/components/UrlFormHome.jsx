import { useState } from "react";
import axios from "axios";

const UrlFormHome = ({ onShorten }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        { original_url: originalUrl }
      );
      setOriginalUrl("");
      if (onShorten) onShorten(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1">
          Enter URL to Shorten
        </label>
        <input
          type="url"
          id="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com"
          className="bg-[#1A1A1A] border border-gray-600 text-white px-4 py-2 rounded-lg w-full"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full flex items-center justify-center scale-hover"
        disabled={isLoading}
      >
        {isLoading ? <div className="spinner mr-2"></div> : "Shorten URL"}
      </button>
      {error && (
        <div className="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] p-2 rounded-lg mt-2 text-sm">
          {error}
        </div>
      )}
    </form>
  );
};

export default UrlFormHome; 