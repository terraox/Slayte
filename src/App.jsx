import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import UploadPage from './pages/UploadPage';
import ExportSizesPage from './pages/ExportSizesPage';
import EmailEditorPage from './pages/email/EmailEditorPage';
import Lenis from 'lenis';

// Views: 'landing' → 'upload' (thumbnail flow) → 'editor'
//        'landing' → 'email' (email flow — coming soon)
//        'landing' → 'export-sizes' (multi-image resize flow)

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'upload' | 'editor' | 'email' | 'export-sizes'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [exportedEmailHtml, setExportedEmailHtml] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return () => lenis.destroy();
  }, []);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    setCurrentView('editor');
  };

  const handleBack = () => {
    setUploadedImage(null);
    setCurrentView('landing');
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage
          onSelectTool={(tool) => {
            if (tool === 'thumbnail') setCurrentView('upload');
            else if (tool === 'email') setCurrentView('email');
            else if (tool === 'export-sizes') setCurrentView('export-sizes');
          }}
        />
      )}
      {currentView === 'upload' && (
        <UploadPage
          onImageUpload={handleImageUpload}
          onBack={() => setCurrentView('landing')}
          onNavigate={(tool) => setCurrentView(tool)}
        />
      )}
      {currentView === 'editor' && (
        <EditorPage
          image={uploadedImage}
          onLeave={handleBack}
          onNavigate={(tool) => setCurrentView(tool)}
        />
      )}
      {currentView === 'email' && (
        <EmailEditorPage
          onLeave={() => setCurrentView('landing')}
          onExport={(html) => setExportedEmailHtml(html)}
          onNavigate={(tool) => setCurrentView(tool)}
        />
      )}
      {currentView === 'export-sizes' && (
        <ExportSizesPage
          onBack={() => setCurrentView('landing')}
          onNavigate={(tool) => setCurrentView(tool)}
        />
      )}
    </>
  );
}

export default App;
