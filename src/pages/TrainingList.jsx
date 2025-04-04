import React from "react";

function TrainingList() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/backend/api.php");

      const data = await response.json();
      if (data.status === "error") {
        setData(data);
      }
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Training List</h1>
      <button onClick={handleSendEmail}>Send Training List</button>
      {loading && <p>Loading...</p>}
      {data && data.message}
    </div>
  );
}

export default TrainingList;
