import { createBrowserRouter, type RouteObject } from "react-router-dom";
import Navbar from "../component/layout/Navbar";
import routes from "./router";

const finalRoutes: RouteObject[] = routes.map((route) => {
  return {
    ...route,
    element: <Navbar>{route.element}</Navbar>,
  };
});

const router = createBrowserRouter(finalRoutes);

export default router;
