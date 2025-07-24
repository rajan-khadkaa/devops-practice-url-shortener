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
        window.__urls = response.data; // Expose for dashboard stats
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch URLs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUrls();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;
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
    <div className="w-full fade-in">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] p-4 rounded-lg flex items-center gap-2 fade-in">
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
      ) : urls.length === 0 ? (
        <div className="card text-center fade-in">
          <p className="text-gray-400">No URLs found. Start by shortening a new URL!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[550px] overflow-y-auto pr-2">
          {urls.map((url) => {
            // Try to get favicon from original URL
            let favicon = '';
            let hostname = '';
            try {
              const u = new URL(url.original_url);
              favicon = `https://www.google.com/s2/favicons?domain=${u.hostname}`;
              hostname = u.hostname.replace('www.', '');
            } catch {}
            return (
              <div key={url._id} className="url-card overflow-hidden border-[2px] border-red-500 fade-in flex flex-row items-center gap-6 hover:shadow-xl transition-shadow h-full p-6">
                {/* Left: QR + favicon */}
                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                  <QRCode
                    value={url.short_url}
                    size={96}
                    bgColor="#18181B"
                    fgColor="#FFFFFF"
                  />
                  {favicon && <img src={favicon} alt="favicon" className="w-7 h-7 rounded mt-1" />}
                </div>
                {/* Right: Info + actions */}
                <div className="flex-1 max-w-full min-w-0 flex flex-col justify-between w-full h-full">
                  {/* <div className="text-sm text-gray-500 mb-3 text-right">Created: {new Date(url.created_at).toLocaleString()}</div> */}
                  <div className="mb-2 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      {hostname && <span className="text-sm text-gray-400 font-semibold">{hostname}</span>}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400">Original:</span>
                      <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="text-[#60A5FA] break-all w-full truncate font-mono text-base hover:underline font-semibold">{url.original_url}</a>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400">Short:</span>
                      <a href={url.short_url} target="_blank" rel="noopener noreferrer" className="text-[#60A5FA] break-all font-mono text-base hover:underline font-semibold">{url.short_url}</a>
                    </div>
                  </div>
                  {/* <div className="flex items-center justify-start py-2 flex-1 scale-hover">
                    <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="">Visit Site</a>
                  </div> */}
                  <div className="flex gap-2 mt-2 items-center">
                    <button
                      onClick={() => navigator.clipboard.writeText(url.short_url)}
                      className="btn-secondary flex-1 scale-hover"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="btn-danger bg-[#EF4444] flex-1 scale-hover"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-3 text-right">Created: {new Date(url.created_at).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UrlList;
