import axios from "axios";
import React from "react";
import { generateId } from "../utils/generateId";
import { Button, Select, FormControl, MenuItem } from "@mui/material";

function SendDocument() {
  const [input, setInput] = React.useState(null);
  const inputRef = React.useRef(null);
  const [uploads, setUploads] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [department, setDepartment] = React.useState("");
  const abortControllers = React.useRef({}); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
    }
  };

 const handleSendFile = async () => {
  if (!input || !department) return;

  setLoading(true);

  const formData = new FormData();
  const requestId = generateId();
  formData.append("file", input);
  formData.append("id", requestId);
  formData.append("type", department);

  const upload = {
    id: requestId,
    name: input.name,
    status: "uploading",
    department: department,
    progress: 0,
  };

  setUploads((prevUploads) => [...prevUploads, upload]);
  sessionStorage.setItem(requestId, JSON.stringify(upload));
  inputRef.current.value = null;
  setDepartment("");

  // Create an AbortController for this request
  const controller = new AbortController();
  abortControllers.current[requestId] = controller;

  try {
    await axios.post(
      "http://localhost/backend/sendEmailApi.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: controller.signal, // Attach the AbortController signal
      }
    );

    // Use the locally generated requestId to update the status
    setUploads((prevUploads) =>
      prevUploads.map((upload) =>
        upload.id === requestId
          ? { ...upload, status: "completed" }
          : upload
      )
    );
    sessionStorage.setItem(
      requestId,
      JSON.stringify({ ...upload, status: "completed" })
    );
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Upload canceled:", requestId);
    } else {
      console.error("Error uploading file:", error);
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === requestId ? { ...upload, status: "error" } : upload
        )
      );
      sessionStorage.setItem(requestId, JSON.stringify(input));
    }
  } finally {
    setLoading(false);
    delete abortControllers.current[requestId];
  }
};

  const handleCancelUpload = (id) => {
    if (abortControllers.current[id]) {
      abortControllers.current[id].abort(); 
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === id ? { ...upload, status: "canceled" } : upload
        )
      );
      delete abortControllers.current[id]; 
    }
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
            <p className="font-medium">Department: {upload.department}</p>
            <p className="text-blue-700">Uploading...</p>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleCancelUpload(upload.id)}
            >
              Cancel
            </Button>
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
            <p className="font-medium text-green-800">
              {upload.department} - department
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
      } else if (upload.status === "canceled") {
        return (
          <div
            key={upload.id}
            className="border border-gray-300 rounded-lg p-3 my-2 bg-gray-50"
          >
            <p className="text-gray-800 font-medium">
              {upload.name} - Canceled
            </p>
          </div>
        );
      }
    });
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
const handleBeforeUnload = (e) =>{
  e.preventDefault()
}
const handleClear = () =>{
  for(let i = 0; i < sessionStorage.length; i++){
    const key = sessionStorage.key(i);
    const value = JSON.parse(sessionStorage.getItem(key));
    if(key === "token"){ 
      sessionStorage.setItem("token",true)
    }
    if(key !== "token" && value.status === "completed" ){
      sessionStorage.removeItem(key)
    }
  }
}
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Send POI, ATR, OR CDC reports
      </h1>
      <p className="text-gray-600 mb-4">
        Upload your document here. The document will be sent to the selected
        department.
      </p>
      <FormControl fullWidth className="mb-4">
        <Select
          labelId="department-select-label"
          id="department-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          displayEmpty
          className="text-gray-900"
          required
        >
          <MenuItem value="" disabled>
            Select Department
          </MenuItem>
          <MenuItem value="cadets">Cadets and officers</MenuItem>
          <MenuItem value="atr">ATR</MenuItem>
          <MenuItem value="cdc">CDC</MenuItem>
        </Select>
      </FormControl>

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
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700`}
        >
          Send Document
        </button>
      </div>
      
           <div className="mb-6">
        <button
          onClick={handleClear}
          
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700`}
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">{handleRenderProgress()}</div>
    </div>
  );
}

export default SendDocument;