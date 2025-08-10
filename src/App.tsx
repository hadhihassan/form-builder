import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#ffff",
            borderRadius: "12px",
            padding: "14px 20px",
            fontSize: "15px",
            fontWeight: 500,
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          },
        }}
        richColors
      />
    </>
  );
}

export default App;
