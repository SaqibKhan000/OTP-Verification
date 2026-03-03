import React from 'react';
import OTPForm from './components/OTPForm';

function App() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div className="background-decor-1"></div>
      <div className="background-decor-2"></div>

      <OTPForm />

      <style>{`
        .background-decor-1 {
          position: fixed;
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
          z-index: -1;
          filter: blur(80px);
        }
        .background-decor-2 {
          position: fixed;
          bottom: -10%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.2) 0%, transparent 70%);
          z-index: -1;
          filter: blur(80px);
        }
      `}</style>
    </main>
  );
}

export default App;
