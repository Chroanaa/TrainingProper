import "./App.css";
import React from "react";
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
import TrainingList from "./pages/TrainingList";
import ViewPOI, { loader as poiLoader } from "./pages/ViewPOI";
import CourseMaterialPreparation from "./pages/CourseMaterialPreparation";
import IncidentReport from "./pages/IncidentReport";
import TrainingReport from "./pages/TrainingReport";
import ViewATR, { loader as viewAtrLoader } from "./pages/ViewATR";
import AuthProvider from "../Auth/AuthProvider";
import { AuthContext } from "../Auth/AuthProvider";
import LoginPage from "./pages/LoginPage";
import RequireAuth from "../Auth/RequireAuth";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/login' element={<LoginPage />} />,
        <Route element={<RequireAuth />}>
          <Route path='/' element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path='SendDocument' element={<SendDocument />} />
            <Route path='Create' element={<Create />} />
            <Route path='List' element={<TrainingList />} />
            <Route path='List/:id' element={<ViewPOI />} loader={poiLoader} />
            <Route
              path='CourseMaterialPrep'
              element={<CourseMaterialPreparation />}
            />
            <Route path='IncidentReport' element={<IncidentReport />} />
            <Route path='TrainingReport' element={<TrainingReport />} />

            <Route
              path='TrainingReport/:id'
              element={<ViewATR />}
              loader={viewAtrLoader}
            />
          </Route>
        </Route>
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
