import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

import pictureNotFound from "../assets/img/no-picture-comic.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
library.add(solidHeart, regularHeart);

const Comic = ({ favorites, addFavorite, removeFavorite, isFavorite }) => {
  const [comics, setComic] = useState([]); // Liste des comics à afficher
  const [loading, setLoading] = useState(false); // État pour indiquer que les comics sont en chargement
  const [error, setError] = useState(null); // État pour gérer erreurs de chargement
  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
  const [limit] = useState(100); // Limite de comics par page
  const [searchQuery, setSearchQuery] = useState(""); // Valeur de la recherche

  useEffect(() => {
    // Charger les comics depuis back
    const fetchComic = async () => {
      setLoading(true); // Mettre l'état en chargement
      setError(null); // Réinitialiser erreur

      try {
        const queryParam = searchQuery ? `&title=${searchQuery}` : ""; // Ajouter paramètre de recherche si nécessaire
        const response = await axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/comics?limit=${limit}&page=${currentPage}${queryParam}`
        );

        if (response.data && response.data.results) {
          setComic(response.data.results); // MàJ liste des comics
          setTotalPages(Math.ceil(response.data.count / limit)); // Calculer nombre total de pages
        } else {
          setError("Aucun comic trouvé. Essayez une autre recherche.");
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la récupération des comics.");
      } finally {
        setLoading(false); // Terminer chargement
      }
    };

    fetchComic();
  }, [searchQuery, currentPage, limit]); // Recharger comics quand recherche, page ou limite change

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Changer page courante
  };

  // Vérif si image = not found, si oui remplacer par image par défaut
  const getImageUrl = (comic) => {
    const defaultNotFoundUrl =
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_fantastic.jpg";

    const imageUrl = `${comic.thumbnail.path}/portrait_fantastic.${comic.thumbnail.extension}`;

    if (imageUrl === defaultNotFoundUrl) {
      return pictureNotFound;
    }

    return imageUrl;
  };

  const handleImageError = (e) => {
    e.target.src = pictureNotFound;
  };

  return (
    <div className="search-results">
      {/* Barre de recherche */}
      <SearchBar
        onSearch={setSearchQuery} // MeàJ recherche en fonction de l'entrée utilisateur
        placeholder="Entrez un mot-clé et laissez Jarvis chercher pour vous."
      />
      {/* Afficher message pendant chargement */}
      {loading && (
        <p className="loading">
          "Chargement… Peut-être que Stark teste un nouveau jouet ?"...
        </p>
      )}
      {/* Afficher message d'erreur si requête échoue */}
      {!loading && error && <p className="error">{error}</p>}
      {/* Sinon afficher résultats  */}
      {!loading && !error && (
        <div className="results">
          {comics.length > 0 ? (
            // Parcourir liste des comics et afficher chaque élément
            comics.map((comic) => {
              const imageUrl = getImageUrl(comic); // Obtenir URL de l'image pour chaque comic
              return (
                <div key={comic._id} className="result-item">
                  {/* Lien vers page détaillée d'un comic */}
                  <Link to={`/comic/${comic._id}`}>
                    <img
                      src={imageUrl} // Afficher image
                      alt={comic.title} // Texte alternatif
                      onError={handleImageError} // Gérer erreurs d'image
                      className="result-image"
                    />
                    <div className="result-content">
                      {/* Afficher titre */}
                      <h3 className="result-title">{comic.title}</h3>{" "}
                      {/* Description ou texte par défaut */}
                      <p className="result-description">
                        {comic.description ||
                          "La vérité ? Plus classée que les archives de l’HYDRA."}{" "}
                      </p>
                    </div>
                  </Link>
                  {/* Bouton pour ajouter ou retirer des favoris */}
                  <button
                    onClick={
                      () =>
                        isFavorite(comic._id)
                          ? removeFavorite(comic._id) // Retirer des fav
                          : addFavorite({
                              id: comic._id,
                              title: comic.title,
                              thumbnail: comic.thumbnail,
                              description: comic.description,
                            }) // Ajouter aux fav
                    }
                    className="favorite-btn"
                  >
                    <FontAwesomeIcon
                      icon={isFavorite(comic._id) ? solidHeart : regularHeart} // Icône pleine ou vide selon état
                      className={`heart-icon ${
                        isFavorite(comic._id) ? "filled" : "empty" // Style en fonction de l'état
                      }`}
                    />
                  </button>
                </div>
              );
            })
          ) : (
            // Afficher message si aucun résultat
            <p>
              Aucun résultat trouvé… Peut-être que l'Infinity Gauntlet a réécrit
              l'univers !
            </p>
          )}
        </div>
      )}
      {/* Pagination */}
      <Pagination
        currentPage={currentPage} // Page actuelle
        totalPages={totalPages} // Nombre total de pages
        onPageChange={handlePageChange} // Fonction pour changer de page
      />
    </div>
  );
};

export default Comic;
