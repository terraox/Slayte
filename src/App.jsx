import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import UploadPage from './pages/UploadPage';
import EmailEditorPage from './pages/email/EmailEditorPage';
import Lenis from 'lenis';

// Views: 'landing' → 'upload' (thumbnail flow) → 'editor'
//        'landing' → 'email' (email flow — coming soon)

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'upload' | 'editor' | 'email'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [exportedEmailHtml, setExportedEmailHtml] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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
          onSelectTool={(tool) => setCurrentView(tool === 'thumbnail' ? 'upload' : 'email')}
        />
      )}
      {currentView === 'upload' && (
        <UploadPage
          onImageUpload={handleImageUpload}
          onBack={() => setCurrentView('landing')}
        />
      )}
      {currentView === 'editor' && (
        <EditorPage
          image={uploadedImage}
          onLeave={handleBack}
        />
      )}
      {currentView === 'email' && (
        <EmailEditorPage
          onLeave={() => setCurrentView('landing')}
          onExport={(html) => setExportedEmailHtml(html)}
        />
      )}
    </>
  );
}

export default App;
