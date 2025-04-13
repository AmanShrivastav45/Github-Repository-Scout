import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx"
import "./font/stylesheet.css"

function App() {

  return (
    <div className="Geist">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} gutter={10}
        toastOptions={{ style: { zIndex: 20000 , border: "1px solid #D1D5DC", borderRadius: "4px", height: "45px", fontSize: "14px", boxShadow: "10px" } }}
      />
    </div>
  );
}

export default App;
