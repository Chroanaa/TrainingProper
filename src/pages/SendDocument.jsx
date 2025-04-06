import axios from "axios";
import React from "react";

function SendDocument() {
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
    }
  };
  const handleSendFile = async () => {
    const formData = new FormData();
    formData.append("file", input);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost/backend/api.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Training List</h1>
      <button onClick={handleSendFile}>Send Training List</button>
      <input type='file' onChange={handleFileChange} required />
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default SendDocument;
