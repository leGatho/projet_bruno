import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navigation">
          <ul className="nav-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/game">Jeu</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
