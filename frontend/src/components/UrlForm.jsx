import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

const UrlForm = () => {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [urlCount, setUrlCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const count = parseInt(localStorage.getItem("urlCount") || "0");
      setUrlCount(count);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShortUrl("");
    setQrCode("");

    if (!user && urlCount >= 2) {
      setError("Free tier limit reached. Please log in to shorten more URLs.");
      setIsLoading(false);
      return;
    }

    try {
      const config = user
        ? { headers: { Authorization: `Bearer ${user.token}` } }
        : {};
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        { original_url: originalUrl },
        config
      );
      setShortUrl(response.data.short_url);
      setQrCode(response.data.qrCode);
      if (!user) {
        const newCount = urlCount + 1;
        setUrlCount(newCount);
        localStorage.setItem("urlCount", newCount);
      }
      setOriginalUrl("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full card fade-in mt-6">
      {error && (
        <div className="bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] p-4 rounded-lg mb-4 flex items-center gap-2 fade-in">
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
      {!user && urlCount >= 2 && (
        <div className="bg-red-300/20 border border-red-400 text-red-400 p-4 rounded-lg mb-4 flex items-center gap-2 fade-in">
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
          Please log in to shorten unlimited URLs.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium mb-1"
          >
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
            disabled={(!user && urlCount >= 2) || isLoading}
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center scale-hover"
          disabled={(!user && urlCount >= 2) || isLoading}
        >
          {isLoading ? <div className="spinner mr-2"></div> : "Shorten URL"}
        </button>
      </form>
      {shortUrl && (
        <div className="mt-6 fade-in">
          <p className="text-sm font-medium mb-2">
            Shortened URL
          </p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3B82F6] break-all font-mono"
          >
            {shortUrl}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="btn-secondary w-full mt-4 scale-hover"
          >
            Copy URL
          </button>
          {qrCode && (
            <div className="mt-4 flex justify-center">
              <QRCode
                value={shortUrl}
                size={128}
                bgColor="#1A1A1A"
                fgColor="#FFFFFF"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UrlForm;
