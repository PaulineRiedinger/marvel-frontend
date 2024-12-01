import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";

const Home = () => {
  // Etats pour stocker lrésultats de recherche, état de chargement, erreurs, et recherche effectuée
  const [characters, setCharacters] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Indiquer si une recherche a été effectuée

  // Fonction de gestion de recherche
  const handleSearch = async (query) => {
    // Si requête vide, réinitialiser résultats et états
    if (!query.trim()) {
      setCharacters([]);
      setComics([]);
      setHasSearched(false);
      return;
    }

    setLoading(true); // Affichage du chargement
    setError(null); // Réinitialisation erreur
    setHasSearched(true); // Marquer qu'une recherche a été effectuée

    try {
      // Utilisation de Promise.all pour récupérer les persos et comics simultanément
      const [charactersResponse, comicsResponse] = await Promise.all([
        axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/characters?name=${query}`
        ),
        axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/comics?title=${query}`
        ),
      ]);

      // MàJ des résultats avec données récupérées
      setCharacters(charactersResponse.data.results || []);
      setComics(comicsResponse.data.results || []);
    } catch (err) {
      // Si erreur lors de la récupération des données-> MàJ état d'erreur
      setError(
        "Un bug dans le Multivers… Les données sont inaccessibles pour l'instant."
      );
    } finally {
      setLoading(false); // Arrêter chargement
    }
  };

  return (
    <div>
      {/* Barre de recherche */}
      <SearchBar
        onSearch={handleSearch} // Fonction de recherche = prop
        placeholder="Entrez un mot-clé et laissez Jarvis chercher pour vous."
      />

      {/* Affichage indicateur de chargement */}
      {loading && (
        <p className="loading">
          Les Gardiens de la Galaxie fouillent l’univers... Patience !
        </p>
      )}

      {/* Résultats de recherche affichés uniquement après une recherche */}
      {hasSearched && (
        <div className="search-results">
          {/* Si erreur survient -> on l'affiche ici */}
          {error && <p className="error">{error}</p>}

          {/* Section des persos */}
          {characters.length > 0 && (
            <div className="section">
              <h2>Personnages</h2>
              <div className="results">
                {characters.map((character, index) => (
                  <div key={character._id || index} className="result-item">
                    {character.thumbnail && (
                      <img
                        src={`${character.thumbnail.path}/portrait_medium.${character.thumbnail.extension}`}
                        alt={character.name}
                      />
                    )}
                    <div className="name">{character.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section des comics */}
          {comics.length > 0 && (
            <div className="section">
              <h2>Comics</h2>
              <div className="results">
                {comics.map((comic, index) => (
                  <div key={comic._id || index} className="result-item">
                    {comic.thumbnail && (
                      <img
                        src={`${comic.thumbnail.path}/portrait_medium.${comic.thumbnail.extension}`}
                        alt={comic.title}
                      />
                    )}
                    <div className="name">{comic.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Si aucun résultat -> */}
          {characters.length === 0 && comics.length === 0 && !error && (
            <p className="no-results">
              Ce héros ou comic est introuvable… Peut-être que Thanos l’a
              effacé.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
