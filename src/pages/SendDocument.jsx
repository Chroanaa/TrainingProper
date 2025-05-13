import axios from "axios";
import React from "react";
import { generateId } from "../utils/generateId";
import { Button } from "@mui/material";

function SendDocument() {
  const [input, setInput] = React.useState(null);
  const inputRef = React.useRef(null);
  const [uploads, setUploads] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
    }
  };

  const handleSendFile = async () => {
    setLoading(true);
    const formData = new FormData();
    const requestId = generateId();
    formData.append("file", input);
    formData.append("id", requestId);
    const upload = {
      id: requestId,
      name: input.name,
      status: "uploading",
      progress: 0,
    };
    setUploads((prevUploads) => [...prevUploads, upload]);
    sessionStorage.setItem(requestId, JSON.stringify(upload));
    inputRef.current.value = null;

    try {
      const response = await axios.post(
        "http://localhost/backend/sendEmailApi.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { request_id } = response.data;
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === request_id
            ? { ...upload, status: "completed" }
            : upload
        )
      );
      sessionStorage.setItem(
        requestId,
        JSON.stringify({ ...upload, status: "completed" })
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === requestId ? { ...upload, status: "error" } : upload
        )
      );
      sessionStorage.setItem(requestId, JSON.stringify(input));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const isCleanNavigation =
      sessionStorage.getItem("cleanNavigation") === "true";
    sessionStorage.removeItem("cleanNavigation");

    const currentUploads = [];
    const pageAccessedByReload =
      window.performance.getEntriesByType("navigation")[0]?.type === "reload";

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      if (key && value && key !== "cleanNavigation") {
        try {
          const parsedValue = JSON.parse(value);
          if (
            pageAccessedByReload &&
            !isCleanNavigation &&
            parsedValue.status === "uploading"
          ) {
            parsedValue.status = "error";
            parsedValue.errorMessage = "Upload interrupted by page refresh";
            sessionStorage.setItem(key, JSON.stringify(parsedValue));
          }
          currentUploads.push(parsedValue);
        } catch (error) {
          console.error("Error parsing storage item:", error);
        }
      }
    }
    setUploads(currentUploads);
    return () => {
      sessionStorage.setItem("cleanNavigation", "true");
    };
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const currentUploads = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        if (key && value && key !== "cleanNavigation") {
          try {
            const parsedValue = JSON.parse(value);
            currentUploads.push(parsedValue);
          } catch (error) {
            console.error("Error parsing storage item:", error);
          }
        }
      }
      setUploads(currentUploads);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    uploads.map((upload) => {
      if (upload.status === "uploading") {
        window.addEventListener("beforeunload", handleBeforeUnload);
      }
    });
    return () => {
      uploads.map((upload) => {
        if (upload.status === "uploading") {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        }
      });
    };
  });

  const handleBeforeUnload = (e) => {
    e.preventDefault();
  };

  const handleResendFile = (id) => {
    const upload = uploads.filter((upload) => upload.id !== id);
    setUploads(upload);
    sessionStorage.removeItem(id);
    inputRef.current.click();
  };

  const handleRenderProgress = () => {
    return uploads.map((upload) => {
      if (upload.status === "uploading") {
        return (
          <div
            key={upload.id}
            className="border border-blue-300 rounded-lg p-3 my-2 bg-blue-50"
          >
            <p className="font-medium">{upload.name}</p>
            <p className="text-blue-700">Uploading...</p>
          </div>
        );
      } else if (upload.status === "completed") {
        return (
          <div
            key={upload.id}
            className="border border-green-300 rounded-lg p-3 my-2 bg-green-50"
          >
            <p className="font-medium text-green-800">
              {upload.name} - Completed
            </p>
          </div>
        );
      } else if (upload.status === "error") {
        return (
          <div
            key={upload.id}
            className="border border-red-300 rounded-lg p-3 my-2 bg-red-50"
          >
            <p className="text-red-800 font-medium">
              {upload.name} - Error
              <Button
                className="ml-4"
                onClick={() => {
                  handleResendFile(upload.id);
                }}
              >
                Try Again
              </Button>
            </p>
          </div>
        );
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Training List</h1>

      <div className="mb-4">
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          required
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <button
          onClick={handleSendFile}
          disabled={loading || !input}
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
            loading || !input
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Training List"}
        </button>
      </div>

      <div className="space-y-2">{handleRenderProgress()}</div>
    </div>
  );
}

export default SendDocument;
