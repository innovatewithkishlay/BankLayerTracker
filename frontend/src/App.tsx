import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { PluginAnalysis } from "./pages/PluginAnalysis";
import { InterlinkAnalysis } from "./pages/InterlinkAnalysis";
import { Results } from "./pages/Results";
import { CompareResults } from "./pages/CompareResults";

export const App = () => {
  return (
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
      </Routes>
    </Router>
  );
};
