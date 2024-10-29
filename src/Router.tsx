// src/Router.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import TemplateCreation from "./pages/TemplateCreation";
import UserPersonalPage from "./pages/UserPersonalPage";
import TemplateDetail from "./components/TemplateDetail";
import TemplateList from "./components/TemplateList";
import TemplateEdit from "./components/TemplateEdit";
import FormList from "./components/FormList";
import FormDetail from "./components/FormDetail";
import EditForm from "./components/EditForm";

import SearchResults from "./components/SearchResults";
import Navbar from "./components/Navbar";
import FormFill from "./components/FormFill";
// import { fetchTemplatesAndTags } from "./services/templateService";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/admin'
          element={<AdminDashboard />}
        />
        <Route
          path='/templates'
          element={<TemplateList />}
        />
        <Route
          path='/templates/create'
          element={<TemplateCreation />}
        />
        <Route
          path='/templates/edit/:id'
          element={<TemplateEdit />}
        />
        <Route
          path='/templates/:templateId'
          element={<TemplateDetail />}
        />
        <Route
          path='/user/personal'
          element={<UserPersonalPage />}
        />
        <Route
          path='/templates/:templateId/forms'
          element={<FormList />}
        />
        <Route
          path='/forms/:formId'
          element={<FormDetail />}
        />

        <Route
          path='/forms/:formId/edit'
          element={<EditForm />}
        />
        <Route
          path='/forms/:templateId/fill'
          element={<FormFill />}
        />
        <Route
          path='/search'
          element={<SearchResults />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
