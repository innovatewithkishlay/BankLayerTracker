import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { PluginAnalysis } from "./pages/PluginAnalysis";
import { InterlinkAnalysis } from "./pages/InterlinkAnalysis";
import { Results } from "./pages/results";
import { CyberLoader } from "./components/UI/CyberLoader";

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  });

  return (
    <Router>
      {isLoading ? (
        <CyberLoader progress={progress} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plugin" element={<PluginAnalysis />} />
          <Route path="/interlink" element={<InterlinkAnalysis />} />
          <Route path="/results/:caseId" element={<Results />} />
        </Routes>
      )}
    </Router>
  );
};
