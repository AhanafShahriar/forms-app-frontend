import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import CreateAccountForm from "../components/CreateAccountForm";

interface Template {
  id: number;
  title: string;
}

interface FilledForm {
  id: number;
  templateTitle: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const UserPersonalPage: React.FC = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filledForms, setFilledForms] = useState<FilledForm[]>([]);
  const [activeTab, setActiveTab] = useState("templates");
  const { theme, language, updatePreferences } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", selectedTheme === "DARK");
  }, [selectedTheme]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    console.log("Changing language to:", newLanguage);
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
  };

  const handleUpdatePreferences = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await updatePreferences(token, selectedLanguage, selectedTheme);
    } else {
      console.error("No token found. Unable to update preferences.");
    }
  };

  useEffect(() => {
    const fetchUserTemplatesAndForms = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const templatesResponse = await axios.get<Template[]>(
            `${apiUrl}/user/templates`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const formsResponse = await axios.get<FilledForm[]>(
            `${apiUrl}/user/forms`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTemplates(templatesResponse.data);
          setFilledForms(formsResponse.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserTemplatesAndForms();
  }, []);

  const handleEdit = (templateId: number) => {
    navigate(`/templates/edit/${templateId}`);
  };

  const handleDeleteTemplate = async (templateId: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/templates/${templateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTemplates(templates.filter((template) => template.id !== templateId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteForm = async (formId: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilledForms(filledForms.filter((form) => form.id !== formId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-800`}>
      <h1 className='text-xl font-bold mb-4'>{t("userProfile")}</h1>
      <button
        onClick={() => setIsFormOpen(true)}
        className='bg-green-500 text-white p-2 rounded hover:bg-green-600 transition mb-4'>
        Create Salesforce Account
      </button>
      {isFormOpen && <CreateAccountForm onClose={() => setIsFormOpen(false)} />}{" "}
      <div className='flex mb-4'>
        <button
          className={`flex-1 p-2 text-center ${
            activeTab === "templates"
              ? "bg-gray-300 dark:bg-gray-700"
              : "bg-gray-100 dark:bg-gray-600"
          } rounded-l`}
          onClick={() => setActiveTab("templates")}>
          {t("yourTemplates")}
        </button>
        <button
          className={`flex-1 p-2 text-center ${
            activeTab === "filledForms"
              ? "bg-gray-300 dark:bg-gray-700"
              : "bg-gray-100 dark:bg-gray-600"
          } rounded-r`}
          onClick={() => setActiveTab("filledForms")}>
          {t("yourFilledForms")}
        </button>
      </div>
      {activeTab === "templates" && (
        <table className='w-full mb-4'>
          <thead>
            <tr className='bg-gray-200 dark:bg-gray-700'>
              <th className='p-2 border text-left'>ID</th>
              <th className='p-2 border text-left'>Title</th>
              <th className='p-2 border text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr
                key={template.id}
                className='border-b'>
                <td className='p-2'>{template.id}</td>
                <td className='p-2'>{template.title}</td>
                <td className='p-2'>
                  <button
                    className='bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition'
                    onClick={() => handleEdit(template.id)}>
                    Edit
                  </button>
                  <button
                    className='bg-red-500 text-white p-1 rounded hover:bg-red-600 transition ml-2'
                    onClick={() => handleDeleteTemplate(template.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {activeTab === "filledForms" && (
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-200 dark:bg-gray-700'>
              <th className='p-2 border text-left'>ID</th>
              <th className='p-2 border text-left'>Template Title</th>
              <th className='p-2 border text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filledForms.map((form) => (
              <tr
                key={form.id}
                className='border-b'>
                <td className='p-2'>{form.id}</td>
                <td className='p-2'>{form.templateTitle}</td>
                <td className='p-2'>
                  <button
                    className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition'
                    onClick={() => navigate(`/forms/${form.id}`)}>
                    View
                  </button>
                  <button
                    className='bg-red-500 text-white p-1 rounded hover:bg-red-600 transition ml-2'
                    onClick={() => handleDeleteForm(form.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className='flex mb-4'>
        <label>
          {t("language")}:
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}>
            <option value='ENGLISH'>{t("english")}</option>
            <option value='SPANISH'>{t("spanish")}</option>
            <option value='RUSSIAN'>{t("russian")}</option>
          </select>
        </label>
        <label>
          {t("theme")}:
          <select
            value={selectedTheme}
            onChange={handleThemeChange}>
            <option value='LIGHT'>{t("light")}</option>
            <option value='DARK'>{t("dark")}</option>
          </select>
        </label>
        <button onClick={handleUpdatePreferences}>
          {t("savePreferences")}
        </button>
      </div>
    </div>
  );
};

export default UserPersonalPage;
