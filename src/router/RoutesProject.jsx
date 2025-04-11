import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/home";

export default function RoutesProject() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

