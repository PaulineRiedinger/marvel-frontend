import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";

import pictureNotFoundCharacter from "../assets/img/no-picture-character.webp";
import pictureNotFoundComic from "../assets/img/no-picture-comic.webp";

import "../style/Home.css";

const Home = () => {
  // Etats pour stocker les résultats de recherche, état de chargement, erreurs, et recherche effectuée
  const [characters, setCharacters] = useState([]);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // Indiquer si une recherche a été effectuée

  // Fonction de gestion de recherche
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setCharacters([]);
      setComics([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const [charactersResponse, comicsResponse] = await Promise.all([
        axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/characters?name=${query}`
        ),
        axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/comics?title=${query}`
        ),
      ]);

      setCharacters(charactersResponse.data.results || []);
      setComics(comicsResponse.data.results || []);
    } catch (err) {
      setError(
        "Un bug dans le Multivers… Les données sont inaccessibles pour l'instant."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir URL de l'image + logique de remplacement
  const getImageUrl = (thumbnail, isComic = false) => {
    const imageSrc = `${thumbnail.path}/portrait_fantastic.${thumbnail.extension}`;
    const defaultImages = [
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_fantastic.jpg",
      "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708/portrait_fantastic.gif",
    ];

    let finalImageSrc = imageSrc;
    if (defaultImages.includes(imageSrc)) {
      finalImageSrc = isComic ? pictureNotFoundComic : pictureNotFoundCharacter;
    }

    return finalImageSrc;
  };

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Entrez un mot-clé et laissez Jarvis chercher pour vous."
      />

      {loading && (
        <p className="loading">
          Les Gardiens de la Galaxie fouillent l’univers... Patience !
        </p>
      )}

      {hasSearched && (
        <div className="search-results">
          {error && <p className="error">{error}</p>}

          {characters.length > 0 && (
            <div className="section">
              <h2>Personnages</h2>
              <div className="results">
                {characters.map((character, index) => (
                  <div key={character._id || index} className="result-item">
                    {character.thumbnail && (
                      <div className="result-image">
                        <img
                          src={getImageUrl(character.thumbnail)}
                          alt={character.name}
                        />
                      </div>
                    )}
                    <div className="result-title">{character.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {comics.length > 0 && (
            <div className="section">
              <h2>Comics</h2>
              <div className="results">
                {comics.map((comic, index) => (
                  <div key={comic._id || index} className="result-item">
                    {comic.thumbnail && (
                      <div className="result-image">
                        <img
                          src={getImageUrl(comic.thumbnail, true)}
                          alt={comic.title}
                        />
                      </div>
                    )}
                    <div className="result-title">{comic.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
