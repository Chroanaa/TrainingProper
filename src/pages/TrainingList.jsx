import React from "react";
import { fetchDocuments } from "../../firebase/fetchDocuments";
import { NavLink, useLoaderData } from "react-router-dom";
export async function loader() {
  const documents = await fetchDocuments();
  return documents;
}
function TrainingList() {
  const fetchedDocuments = useLoaderData();
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
