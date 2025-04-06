import React from "react";
import { fetchDocuments } from "../../firebase/fetchDocuments";
import { useLoaderData } from "react-router-dom";
export async function loader() {
  const documents = await fetchDocuments();
  return documents;
}
function TrainingList() {
  const fetchedDocuments = useLoaderData();
  return (
    <div>
      <li>
        <h1 className='text-2xl font-bold text-blue-500'>Training List</h1>
        <ul className='list-disc'>
          {fetchedDocuments ? (
            fetchedDocuments.map((document, index) => (
              <li key={index} className='text-lg'>
                {document.title}
              </li>
            ))
          ) : (
            <li className='text-lg'>No documents available</li>
          )}
        </ul>
      </li>
    </div>
  );
}

export default TrainingList;
