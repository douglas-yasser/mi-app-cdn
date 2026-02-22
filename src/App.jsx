import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Mi Aplicación Web en AWS CDN</h1>
        <p>Proyecto de Cloud Computing - Assignment 02</p>

        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count} clicks
          </button>
          <p>Esta aplicación está desplegada en AWS CloudFront</p>
        </div>

        <div className="info-section">
          <h2>Tecnologías utilizadas:</h2>
          <ul>
            <li>⚡ Vite - Build Tool</li>
            <li>⚛️ React - Framework</li>
            <li>☁️ AWS S3 - Storage</li>
            <li>🌐 CloudFront - CDN</li>
            <li>🔐 Doppler - Secrets Management</li>
            <li>🤖 GitHub Actions - CI/CD</li>
          </ul>
        </div>

        <footer>
          <p>Creado por: [Douglas Jacobo]</p>
          <p>Fecha: {new Date().toLocaleDateString()}</p>
        </footer>
      </header>
    </div>
  );
}

export default App;
