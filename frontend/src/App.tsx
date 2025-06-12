import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { PluginAnalysis } from "./pages/PluginAnalysis";
import { InterlinkAnalysis } from "./pages/InterlinkAnalysis";
import { Results } from "./pages/Results";
import { CompareResults } from "./pages/CompareResults";
import { CyberToast } from "./components/UI/CyberToast";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProButtonDemo from "./pages/Test";
import ContributePage from "./pages/ContributePage";
import CookieBanner from "./components/UI/CookieBanner";
import CookiePolicy from "./pages/CookiePolicy";
export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plugin" element={<PluginAnalysis />} />
          <Route path="/interlink" element={<InterlinkAnalysis />} />
          <Route path="/results/:caseId" element={<Results />} />
          <Route
            path="/compare-results/:case1Id/:case2Id"
            element={<CompareResults />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/pro" element={<ProButtonDemo />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          
          {/* 404 route*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CyberToast />
        <CookieBanner />
      </Router>
    </AuthProvider>
  );
};
