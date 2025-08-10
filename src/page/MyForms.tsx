import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeItem, initialisation } from "../redux/slice/formSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const forms = useSelector((state: RootState) => state?.form?.items);

  const handleCreateForm = () => {
    navigate(`/create`);
  };

  const handleDeleteForm = (id: string) => {
    dispatch(removeItem(id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    dispatch(initialisation());
  }, []);

  return (
    <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden p-5">
      <div className="p-6 border-b border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">My Forms</h1>
          <button
            onClick={handleCreateForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <PlusIcon size={16} />
            <span>Create New Form</span>
          </button>
        </div>
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">You don't have any forms yet.</p>
            <button
              onClick={handleCreateForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center space-x-2 transition-colors"
            >
              <PlusIcon size={16} />
              <span>Create Your First Form</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-slate-700 ">
              <thead className="bg-slate-800">
                <tr className="text-start">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                  >
                    Form Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                  >
                    Fields
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 bg-slate-800">
                {forms.map((form) => (
                  <tr
                    key={form.id}
                    className="hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {form.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {formatDate(form.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {form.fields.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/create`}
                          className="text-blue-400 hover:text-blue-300 p-2 transition-colors"
                          title="Edit Form"
                          state={{ formId: form.id }}
                        >
                          <EditIcon size={18} />
                        </Link>
                        <Link
                          to={`/preview`}
                          className="text-green-400 hover:text-green-300 p-2 transition-colors"
                          title="Preview Form"
                          state={{ formId: form.id }}
                        >
                          <EyeIcon size={18} />
                        </Link>
                        <button
                          className="text-red-400 hover:text-red-300 p-2 transition-colors"
                          title="Delete Form"
                          onClick={() => handleDeleteForm(form.id)}
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForms;