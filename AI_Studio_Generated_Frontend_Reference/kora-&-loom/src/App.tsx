import { BoutiqueCartProvider } from './context/BoutiqueCartContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { BoutiqueHomePage } from './pages/BoutiqueHomePage';

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <BoutiqueCartProvider>
          <BoutiqueHomePage />
        </BoutiqueCartProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
