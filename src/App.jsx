import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import HomeLayout from "./layout/HomeLayout"; // Corrected import
import Home from "./pages/Home"; // Corrected import
import SendDocument from "./pages/SendDocument";
import Create from "./pages/Create";
import TrainingList, { loader as TrainingLoader } from "./pages/TrainingList";
import ViewDocument, { loader as viewDocLoader } from "./pages/ViewDocument"; // Corrected import
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path='SendDocument' element={<SendDocument />} />
        <Route path='Create' element={<Create />} />
        <Route path='List' element={<TrainingList />} loader={TrainingLoader} />
        <Route
          path='List/:id'
          element={<ViewDocument />}
          loader={viewDocLoader}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
