import { Eraser, Sparkles, Image } from "lucide-react";
import React, { useState } from "react";
import axios from '../config/axios.js';
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setInput(file);
    setPreview(URL.createObjectURL(file));
    setResultUrl("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      setLoading(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/remove-image-background`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setResultUrl(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <Toaster />

      {/* LEFT SIDE */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload image</p>

        <input
          onChange={onFileChange}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        {/* Preview of selected image */}
        {preview && !resultUrl && (
          <img
            src={preview}
            alt="Selected"
            className="mt-4 w-full rounded-lg border border-gray-200 object-cover max-h-48"
          />
        )}

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Remove background
        </button>
      </form>

      {/* RIGHT SIDE */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {resultUrl ? (
            <div className="flex flex-col items-center gap-3 w-full mt-4">
              <img
                src={resultUrl}
                alt="Background removed"
                className="max-w-full max-h-80 rounded-lg"
              />
              <a
                href={resultUrl}
                download="background-removed.png"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-red-500 underline"
              >
                Download image
              </a>
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;