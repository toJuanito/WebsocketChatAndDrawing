import './App.css';
import { useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Salle from './Chat/Salle';

const React = require('react');

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salle/:idSalle" element={<Salle />} />
      </Routes>

    </div>
  );
}

export default App;

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
      </main>
      <nav>
        <ul>
          <Link to="/salle/1001"><li>Salle 1</li></Link>
          <Link to="/salle/1002"><li>Salle 2</li></Link>
        </ul>
      </nav>
    </>
  );
}