import React from "react";
import { fetchPOIS } from "../../firebase/fetchPOIS";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { deletePOI } from "../../firebase/deletePOI";
function TrainingList() {
  const [fetchedDocuments, setFetchedDocuments] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = fetchPOIS((data) => {
      setFetchedDocuments(data);
    });
    console.log(fetchedDocuments);
  }, []);
  const handleDelete = async (id) => {
    try {
      await deletePOI(id);
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold text-blue-500'>Training List</h1>
      <ul className='list-disc'>
        {fetchedDocuments ? (
          fetchedDocuments.map((document, index) => (
            <li key={index} className='text-lg'>
              <NavLink
                to={`/List/${document.id}`}
                className='text-blue-500 hover:underline'
              >
                {document.title}
              </NavLink>
              <Button
                variant='outlined'
                onClick={() => handleDelete(document.id)}
              >
                Delete
              </Button>
            </li>
          ))
        ) : (
          <li className='text-lg'>No documents available</li>
        )}
      </ul>
    </div>
  );
}

export default TrainingList;
