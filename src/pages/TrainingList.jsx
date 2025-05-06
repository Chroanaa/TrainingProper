import React from "react";
import { fetchPOIS } from "../../firebase/POI/fetchPOIS";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { deletePOI } from "../../firebase/POI/deletePOI";
import DeleteDialog from "../components/ui/DeleteDialog";
import { set } from "firebase/database";
function TrainingList() {
  const [fetchedDocuments, setFetchedDocuments] = React.useState([]);
  const [open, setOpen] = React.useState(false);
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
      <h1 className='text-[2rem] ml-[1rem]'>Training List</h1>
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
              <Button variant='outlined' onClick={() => setOpen(true)}>
                Delete
              </Button>
              <DeleteDialog
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                onDelete={() => {
                  handleDelete(document.id);
                  setOpen(false);
                }}
                title='Delete Document'
                item='document'
              />
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
