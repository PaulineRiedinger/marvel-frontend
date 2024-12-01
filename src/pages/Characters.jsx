import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import pictureNotFound from "../assets/img/no-picture-character.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
library.add(solidHeart, regularHeart);

// Définir composant Characters
const Characters = ({ favorites, addFavorite, removeFavorite, isFavorite }) => {
  // Déclarer états pour gérerdonnées, chargement, erreurs, etc
  const [characters, setCharacters] = useState([]); // Stocker persos récupérés
  const [loading, setLoading] = useState(false); // Indiquer si données sont en cours de chargement
  const [error, setError] = useState(null); // Gérer erreurs si requête échoue
  const [currentPage, setCurrentPage] = useState(1); // Suivre page actuellement affichée
  const [totalPages, setTotalPages] = useState(1); // Stocker nombre total de pages dispo
  const [limit] = useState(100); // Fixer le nombre de persos par page
  const [searchQuery, setSearchQuery] = useState(""); // Stocker texte de recherche saisi par utilisateur

  // useEffect pour récupérer les données chaque fois que searchQuery ou currentPage change
  useEffect(() => {
    // Définir une fonction pour récupérer les persos depuis l'API
    const fetchCharacters = async () => {
      setLoading(true); // Activer indicateur de chargement
      setError(null); // Réinitialiser état d'erreur

      try {
        // Ajouter paramètre de recherche si mot-clé saisi
        const queryParam = searchQuery ? `&name=${searchQuery}` : "";
        // Faire requête pour récupérer les persos
        const response = await axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/characters?limit=${limit}&page=${currentPage}${queryParam}`
        );
        setCharacters(response.data.results); // Mettre à jour état avec persos récupérés
        setTotalPages(Math.ceil(response.data.count / limit)); // Calculer et stocker le nombre total de pages
      } catch (err) {
        // Mettre message d'erreur si requête échoue
        setError(
          "Les personnages ne répondent pas… Un coup de Loki en coulisses ?"
        );
      } finally {
        setLoading(false); // Désactiver indicateur de chargement
      }
    };

    fetchCharacters(); // Appeler fonction pour récupérer données
  }, [searchQuery, currentPage, limit]); // Exécuter effet quand searchQuery/currentPage change

  // Fonction pour changer page actuelle
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // MàJ la page courante
  };

  // Fonction pour obtenir URL de l'image du perso
  const getImageUrl = (character) => {
    const defaultNotFoundUrl =
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_fantastic.jpg";
    const defaultGifUrl =
      "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708/portrait_fantastic.gif";

    // Construire URL complète de l'image
    const imageUrl = `${character.thumbnail.path}/portrait_fantastic.${character.thumbnail.extension}`;

    // Vérifier si image est une des images par défaut fournies par API
    if (imageUrl === defaultNotFoundUrl || imageUrl === defaultGifUrl) {
      return pictureNotFound; // Retourner image par défaut locale
    }

    return imageUrl; // Sinon, retourner image du perso
  };

  // Gérer erreurs de chargement d'image
  const handleImageError = (e) => {
    e.target.src = pictureNotFound; // Remplacer image cassée par image par défaut
  };

  // Retourner interface utilisateur
  return (
    <div className="search-results">
      {/* Afficher barre de recherche pour permettre de filtrer les persos */}
      <SearchBar
        onSearch={setSearchQuery} // MàJ texte de recherche
        placeholder="Entrez un mot-clé et laissez Jarvis chercher pour vous."
      />
      {/* Afficher message pendant chargement */}
      {loading && (
        <p className="loading">
          Chargement… Peut-être que Stark teste un nouveau jouet ?
        </p>
      )}
      {/* Afficher un message d'erreur si la requête échoue */}
      {!loading && error && <p className="error">{error}</p>}
      {/* Sinon afficher résultats */}
      {!loading && !error && (
        <div className="results">
          {characters.length > 0 ? (
            characters.map((character) => {
              const imageUrl = getImageUrl(character);
              return (
                <div key={character._id} className="result-item">
                  {/* Créer un lien vers la page des comics du person */}
                  <Link to={`/comics/${character._id}`}>
                    <img
                      src={imageUrl} // Afficher image du perso
                      alt={character.name} // Ajouter description
                      onError={handleImageError} // Gérer erreurs de chargement d'image
                      className="result-image"
                    />
                    <div className="result-content">
                      <h3 className="result-title">{character.name}</h3>{" "}
                      {/* Afficher nom */}
                      <p className="result-description">
                        {character.description ||
                          "Encore plus secret que les archives du SHIELD..."}{" "}
                        {/* Afficher description ou texte par défaut */}
                      </p>
                    </div>
                  </Link>
                  {/* Ajouter bouton pour gérer favoris */}
                  <button
                    onClick={
                      () =>
                        isFavorite(character._id)
                          ? removeFavorite(character._id) // Retirer des fav si déjà ajouté
                          : addFavorite({
                              id: character._id,
                              name: character.name,
                              thumbnail: character.thumbnail,
                            }) // Ajouter aux fav si non ajouté
                    }
                    className="favorite-btn"
                  >
                    <FontAwesomeIcon
                      icon={
                        isFavorite(character._id) ? solidHeart : regularHeart // Afficher un cœur plein/vide
                      }
                      className={`heart-icon ${
                        isFavorite(character._id) ? "filled" : "empty" // Modif style selon état
                      }`}
                    />
                  </button>
                </div>
              );
            })
          ) : (
            // Afficher message si aucun perso n'est trouvé
            <p>
              Aucun résultat trouvé… Peut-être que l'Infinity Gauntlet a réécrit
              l'univers !
            </p>
          )}
        </div>
      )}
      {/* Ajouter pagination */}
      <Pagination
        currentPage={currentPage} // Page actuelle
        totalPages={totalPages} // Nombre total de pages
        onPageChange={handlePageChange} // Fonction pour changer de page
      />
    </div>
  );
};

export default Characters;
