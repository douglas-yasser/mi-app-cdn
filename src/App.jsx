import { useState } from 'react'
import './App.css'

const fighters = [
  { name: 'Jon Jones', record: '27-1-0', weight: 'Heavyweight', country: '🇺🇸', status: 'Champion' },
  { name: 'Islam Makhachev', record: '26-1-0', weight: 'Lightweight', country: '🇷🇺', status: 'Champion' },
  { name: 'Alex Pereira', record: '12-2-0', weight: 'Light Heavyweight', country: '🇧🇷', status: 'Champion' },
  { name: 'Sean O\'Malley', record: '18-1-0', weight: 'Bantamweight', country: '🇺🇸', status: 'Champion' },
]

const dockerInfo = [
  { icon: '🐳', title: 'Docker Hub', desc: 'douglasjac/mi-app-cdn', sub: 'Imagen pública disponible' },
  { icon: '📦', title: 'Base Image', desc: 'node:20-alpine + nginx', sub: 'Multi-stage build' },
  { icon: '🏷️', title: 'Tags', desc: 'latest + SHA commit', sub: 'Auto-tagged en cada push' },
  { icon: '⚙️', title: 'CI/CD', desc: 'GitHub Actions', sub: 'Deploy automático' },
]

export default function App() {
  const [tab, setTab] = useState('fighters')

  return (
    <div className="app">
      <div className="noise" />
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="container">

        {/* HERO */}
       <header className="hero">
  <div className="hero-badges">
    <span className="pill red">🥊 UFC</span>
    <span className="pill blue">🐳 Docker Hub</span>
    <span className="pill">Assignment 04</span>
  </div>

  <h1 className="hero-title">
    FIGHT<br />
    <span className="stroke-text">CONTAINER</span>
  </h1>

  <p className="hero-sub">
    UFC × Docker — Cloud Computing · Douglas Jacobo
  </p>

  <a
    className="hub-link"
    href="https://hub.docker.com/r/douglasjac/mi-app-cdn"
    target="_blank"
    rel="noreferrer"
  >
    🐳 hub.docker.com/r/douglasjac/mi-app-cdn
  </a>
</header>

        {/* STAT BAR */}
        <div className="stat-bar">
          <div className="stat">
            <span className="stat-num red">3+</span>
            <span className="stat-label">Commits</span>
          </div>
          <div className="divider" />
          <div className="stat">
            <span className="stat-num">3+</span>
            <span className="stat-label">Docker Tags</span>
          </div>
          <div className="divider" />
          <div className="stat">
            <span className="stat-num">latest</span>
            <span className="stat-label">Tag activo</span>
          </div>
          <div className="divider" />
          <div className="stat">
            <span className="stat-num red">LIVE</span>
            <span className="stat-label">Estado</span>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={tab === 'fighters' ? 'tab active' : 'tab'} onClick={() => setTab('fighters')}>
            🥊 Campeones UFC
          </button>
          <button className={tab === 'docker' ? 'tab active' : 'tab'} onClick={() => setTab('docker')}>
            🐳 Docker Info
          </button>
        </div>

        {/* FIGHTERS */}
        {tab === 'fighters' && (
          <div className="grid">
            {fighters.map((f) => (
              <div className="card fighter-card" key={f.name}>
                <div className="fighter-top">
                  <span className="country">{f.country}</span>
                  <span className="champion-badge">👑 {f.status}</span>
                </div>
                <h3 className="fighter-name">{f.name}</h3>
                <p className="fighter-weight">{f.weight}</p>
                <div className="record-bar">
                  <span className="record">{f.record}</span>
                  <span className="record-label">W-L-D</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DOCKER */}
        {tab === 'docker' && (
          <div className="grid">
            {dockerInfo.map((d) => (
              <div className="card docker-card" key={d.title}>
                <span className="docker-icon">{d.icon}</span>
                <h3 className="docker-title">{d.title}</h3>
                <p className="docker-desc">{d.desc}</p>
                <p className="docker-sub">{d.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <p>Creado por <strong>Douglas Jacobo</strong> · {new Date().toLocaleDateString()} · Cloud Computing</p>
        </footer>

      </div>
    </div>
  )
}