import axios from "axios";
import React from "react";
import { generateId } from "../utils/generateId";
import { Button } from "@mui/material";
import { insertDocument } from "../../firebase/Document/insertDocument";
import { fetchDocument } from "../../firebase/Document/fetchDocument";
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
    insertDocument({
      id: requestId,
      name: input.name,
      status: "uploading",
    });
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
      // Update the status of this specific upload to completed

      setUploads(
        (prevUploads) =>
          prevUploads.map((upload) =>
            upload.id === request_id
              ? { ...upload, status: "completed" }
              : upload
          ),
        insertDocument({
          id: requestId,
          name: input.name,
          status: "completed",
        })
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      // Update the status of this specific upload to error
      setUploads(
        (prevUploads) =>
          prevUploads.map((upload) =>
            upload.id === requestId ? { ...upload, status: "error" } : upload
          ),
        sessionStorage.setItem(requestId, JSON.stringify(input))
      );
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
    return () => {
      sessionStorage.setItem("cleanNavigation", "true");
    };
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
  React.useEffect(() => {
    const unsubscribe = fetchDocument((documents) => {
      const currentUploads = [];
      documents.map((document) => {
        if (document.status === "uploading") {
          currentUploads.push(document);
        }
      });
      setUploads(currentUploads);
    });
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
          <div key={upload.id}>
            <p>{upload.name}</p>
            <p>Uploading</p>
          </div>
        );
      } else if (upload.status === "completed") {
        return <p key={upload.id}>{upload.name} - Completed</p>;
      } else if (upload.status === "error") {
        return (
          <p key={upload.id}>
            {upload.name} - Error{" "}
            <Button
              onClick={() => {
                handleResendFile(upload.id);
              }}
            >
              Try Again
            </Button>
          </p>
        );
      }
    });
  };

  return (
    <div>
      <h1>Training List</h1>
      <button onClick={handleSendFile}>Send Training List</button>
      <input type='file' ref={inputRef} onChange={handleFileChange} required />
      {handleRenderProgress()}
    </div>
  );
}

export default SendDocument;
