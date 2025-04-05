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
import TrainingList from "./pages/TrainingList";
import Create from "./pages/Create";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path='TrainingList' element={<TrainingList />} />
        <Route path='Create' element={<Create />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
