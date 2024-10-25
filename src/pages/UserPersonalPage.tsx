import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filledForms, setFilledForms] = useState<FilledForm[]>([]);
  const [activeTab, setActiveTab] = useState("templates");

  useEffect(() => {
    const fetchUserTemplatesAndForms = async () => {
      try {
        const token = localStorage.getItem("token");
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
    };

    fetchUserTemplatesAndForms();
  }, []);

  return (
    <div className='max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg'>
      <h1 className='text-2xl font-semibold mb-4'>Your Personal Page</h1>

      <div className='flex mb-4'>
        <button
          className={`flex-1 p-2 text-center ${
            activeTab === "templates" ? "bg-gray-300" : "bg-gray-100"
          } rounded-l`}
          onClick={() => setActiveTab("templates")}>
          Your Templates
        </button>
        <button
          className={`flex-1 p-2 text-center ${
            activeTab === "filledForms" ? "bg-gray-300" : "bg-gray-100"
          } rounded-r`}
          onClick={() => setActiveTab("filledForms")}>
          Your Filled Forms
        </button>
      </div>

      {activeTab === "templates" && (
        <>
          <table className='w-full mb-4'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='p-2 border'>ID</th>
                <th className='p-2 border'>Title</th>
                <th className='p-2 border'>Actions</th>
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
                    <button className='bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition'>
                      Edit
                    </button>
                    <button className='bg-red-500 text-white p-1 rounded hover:bg-red-600 transition ml-2'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "filledForms" && (
        <>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='p-2 border'>ID</th>
                <th className='p-2 border'>Template Title</th>
                <th className='p-2 border'>Actions</th>
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
                    <button className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition'>
                      View
                    </button>
                    <button className='bg-red-500 text-white p-1 rounded hover:bg-red-600 transition ml-2'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserPersonalPage;
