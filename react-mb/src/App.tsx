import { BrowserRouter, Routes, Route } from "react-router-dom";

import Toast from "./components/common/Toast";
import Home from "./pages/Home";
import ResidenceVerification from "./pages/ResidenceVerification";
import BusinessVerification from "./pages/BusinessVerification";
import DocumentVerification from "./pages/DocumentVerification";
import EmploymentVerification from "./pages/EmploymentVerification";
import AssetVerification from "./pages/AssetVerification";
import CaseModel from "./pages/CaseModel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/residence-verification"
            element={<ResidenceVerification />}
          />
          <Route
            path="/business-verification"
            element={<BusinessVerification />}
          />
          <Route
            path="/document-verification"
            element={<DocumentVerification />}
          />
          <Route
            path="/employment-verification"
            element={<EmploymentVerification />}
          />
          <Route path="/asset-verification" element={<AssetVerification />} />
          <Route path="/case-model" element={<CaseModel />} />
        </Routes>
      </BrowserRouter>
      <Toast />
    </>
  );
}

export default App;
