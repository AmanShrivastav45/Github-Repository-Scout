import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}
        />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          style: {
            zIndex: 20000,
            border: "1px solid #D1D5DC",
            borderRadius: "4px",
            height: "35px",
            fontSize: "12px",
            boxShadow: "10px"
          },
        }}
      />
    </>
  );
}

export default App;
