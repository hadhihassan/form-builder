import { lazy } from "react";
import { Navigate } from "react-router-dom";
const CreateForm = lazy(() => import("../page/CreateForm"));
const MyForms = lazy(() => import("../page/MyForms"));
const PreviewForm = lazy(() => import("../page/PreviewForm"));

const routes = [
    {
    path: "/",
    element: <Navigate to="/myforms" replace />, 
  },
  {
    path: "/create",
    element: <CreateForm />,
  },
  {
    path: "/preview",
    element: <PreviewForm />,
  },
  {
    path: "/myforms",
    element: <MyForms />,
  },
];
export default routes;
