import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="logo-title">
              <span className="logo">🚀</span>
              <h1>Mi Aplicación Web en AWS CDN</h1>
            </div>
            <p className="subtitle">Proyecto de Cloud Computing - Assignment 02</p>
          </div>
        </header>

        <main className="main-content">
          <div className="card counter-card">
            <div className="counter-content">
              <h2>Prueba la Aplicación</h2>
              <div className="counter-display">
                <span className="count-number">{count}</span>
                <span className="count-label">clicks</span>
              </div>
              <button onClick={() => setCount((count) => count + 1)}>
                Incrementar Contador
              </button>
              <p className="deployment-info">
                ✅ Desplegada en AWS CloudFront con CI/CD
              </p>
            </div>
          </div>

          <div className="card tech-card">
            <h2>🛠️ Stack Tecnológico</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <span className="tech-icon">⚡</span>
                <div className="tech-details">
                  <h3>Vite</h3>
                  <p>Build Tool ultrarrápido</p>
                </div>
              </div>
              <div className="tech-item">
                <span className="tech-icon">⚛️</span>
                <div className="tech-details">
                  <h3>React</h3>
                  <p>Framework moderno</p>
                </div>
              </div>
              <div className="tech-item">
                <span className="tech-icon">☁️</span>
                <div className="tech-details">
                  <h3>AWS S3</h3>
                  <p>Almacenamiento cloud</p>
                </div>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🌐</span>
                <div className="tech-details">
                  <h3>CloudFront</h3>
                  <p>CDN global de AWS</p>
                </div>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🔐</span>
                <div className="tech-details">
                  <h3>Doppler</h3>
                  <p>Gestión de secrets</p>
                </div>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🤖</span>
                <div className="tech-details">
                  <h3>GitHub Actions</h3>
                  <p>CI/CD automatizado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card features-card">
            <h2>✨ Características del Proyecto</h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <div>
                  <h3>Deploy Automático</h3>
                  <p>Cada push activa el pipeline de CI/CD</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div>
                  <h3>Secrets Seguros</h3>
                  <p>Credenciales protegidas con Doppler</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <h3>CDN Global</h3>
                  <p>Baja latencia en todo el mundo</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div>
                  <h3>100% Responsive</h3>
                  <p>Adaptado a todos los dispositivos</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p className="author">
              <strong>Creado por:</strong> Douglas Jacobo
            </p>
            <p className="date">
              <strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="footer-badge">
            <span>Powered by AWS ☁️</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App