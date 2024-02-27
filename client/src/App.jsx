import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import WebApp from "./webapp/Webapp";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/webapp/:id" element={<WebApp />} />
      </Routes>
    </>
  );
}

export default App;