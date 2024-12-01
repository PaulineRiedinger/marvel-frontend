import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "./App.css";
import "../Reset.css";

// Composants
import Header from "./components/Header";
import Footer from "./components/Footer";
import useFavorites from "./components/useFavorites";

// Pages
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import ComicsByCharacterId from "./pages/ComicsByCharacterId";
import Comic from "./pages/Comic";
import ComicId from "./pages/ComicId";
import Favorite from "./pages/Favorite";

function App() {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />

          {/* Page persos */}
          <Route
            path="/characters"
            element={
              <Characters
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                isFavorite={isFavorite}
              />
            }
          />

          {/* Page comics pour un perso spécifique */}
          <Route
            path="/comics/:characterId"
            element={<ComicsByCharacterId />}
          />

          {/* Page comics */}
          <Route
            path="/comics"
            element={
              <Comic
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                isFavorite={isFavorite}
              />
            }
          />

          {/* Page comic spécifique */}
          <Route path="/comic/:comicId" element={<ComicId />} />

          {/* Page favoris */}
          <Route
            path="/favorites"
            element={
              <Favorite favorites={favorites} removeFavorite={removeFavorite} />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
