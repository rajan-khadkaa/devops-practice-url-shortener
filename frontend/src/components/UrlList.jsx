import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

const UrlList = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);
      try {
        const config = user
          ? { headers: { Authorization: `Bearer ${user.token}` } }
          : {};
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/my-urls`,
          config
        );
        setUrls(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch URLs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUrls();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const config = user
        ? { headers: { Authorization: `Bearer ${user.token}` } }
        : {};
      await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`, config);
      setUrls(urls.filter((url) => url._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete URL");
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="card text-error p-4 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
              <div className="h-16 w-16 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      ) : urls.length === 0 ? (
        <p className="text-gray-400">No URLs found. Start shortening now!</p>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <div key={url._id} className="card">
              <p className="text-sm font-medium text-gray-300">Original URL</p>
              <a
                href={url.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3B82F6] break-all"
              >
                {url.original_url}
              </a>
              <p className="text-sm font-medium text-gray-300 mt-2">
                Short URL
              </p>
              <a
                href={url.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3B82F6] break-all"
              >
                {url.short_url}
              </a>
              <p className="text-sm text-gray-400 mt-2">
                Created: {new Date(url.created_at).toLocaleString()}
              </p>
              <div className="mt-4 flex justify-center">
                <QRCode
                  value={url.short_url}
                  size={64}
                  bgColor="#2D2D2D"
                  fgColor="#FFFFFF"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => navigator.clipboard.writeText(url.short_url)}
                  className="btn-secondary flex-1"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => handleDelete(url._id)}
                  className="btn-primary bg-[#EF4444] flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlList;
