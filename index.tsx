import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { MediaPlayerProvider } from './contexts/MediaPlayerContext';
import { PersistenceProvider } from './contexts/PersistenceContext';
import { DemoModeProvider } from './contexts/DemoModeContext';

// CORS fix
try {
  const res = await fetch(
    "https://ivhqfwktgaoktdxqznhx.supabase.co/functions/v1/cors-proxy"
  );
  await res.text(); // now CORS‑allowed
} catch (error) {
  console.warn('CORS proxy fetch failed, this might cause issues with Supabase Storage.', error);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PersistenceProvider>
      <MediaPlayerProvider>
        <DemoModeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </DemoModeProvider>
      </MediaPlayerProvider>
    </PersistenceProvider>
  </React.StrictMode>
);
