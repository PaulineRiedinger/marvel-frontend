import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import pictureNotFound from "../assets/img/no-picture-comic.webp";

// Définition de ComicId
const ComicId = () => {
  const { comicId } = useParams(); // Extraire ID du comic depuis URL
  const [comic, setComic] = useState(null); // État pour stocker détails du comic
  const [loading, setLoading] = useState(true); // État pour indiquer si données sont en cours de chargement
  const [error, setError] = useState(null); // État pour stocker erreurs
  const [favorites, setFavorites] = useState([]); // Liste des comics favoris
  const [imageError, setImageError] = useState(false); // État pour détecter erreurs d'image

  // Gérer erreurs lors du chargement des images
  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true); // Marquer qu'une erreur s'est produite
      e.target.src = pictureNotFound; // Remplacer image par image par défaut
    }
  };

  // Obtenir URL de l'image ou fournir image de remplacement
  const getImageUrl = (comic) => {
    const imageUrl = `${comic.thumbnail.path}/portrait_fantastic.${comic.thumbnail.extension}`;

    // Vérifier URL = image par défaut API
    if (imageUrl.includes("image_not_available")) {
      return pictureNotFound; // Retourner image de remplacement
    }
    return imageUrl; // Retourner URL valide
  };

  // Ajouter comic aux favoris
  const addFavorite = (comic) => {
    setFavorites((prevFavorites) => [...prevFavorites, comic]); // Ajouter comic à la liste des fav
  };

  // Supprimer comic des fav
  const removeFavorite = (comicId) => {
    setFavorites(
      (prevFavorites) => prevFavorites.filter((comic) => comic._id !== comicId) // Retirer comic avec ID correspondant
    );
  };

  // Vérif si comic est dans fav
  const isFavorite = (comicId) => {
    return favorites.some((comic) => comic._id === comicId); // Retourne vrai si comic dans fav
  };

  // Charger données du comic depuis back
  useEffect(() => {
    const fetchComic = async () => {
      setLoading(true); // Activer mode chargement
      setError(null); // Réinitialiser erreurs

      try {
        // Requête pour obtenir détails du comic
        const response = await axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/comicId/${comicId}`
        );
        setComic(response.data); // Enregistrer données du comic
      } catch (err) {
        // Gérer erreurs
        setError(
          "Impossible de récupérer le comic… Peut-être que Thanos a effacé cette partie de la réalité."
        );
      } finally {
        setLoading(false); // Désactiver mode chargement
      }
    };

    fetchComic(); // Appeler fonction pour récupérer données
  }, [comicId]); // Exécuter chaque fois que ID du comic change

  return (
    <div className="loading">
      {/* Afficher message pendant chargement */}
      {loading && <p>Le Bifrost s’ouvre… Comic en approche.</p>}

      {/* Si erreur afficher message */}
      {error && <p>{error}</p>}

      {/* Si aucun comic trouvé afficher message */}
      {!loading && !comic && <p>Spider-Man n’a rien trouvé dans sa toile.</p>}

      {/* Afficher détails du comic si données dispos */}
      {!loading && comic && (
        <div className="result-item">
          {/* Image avec gestion erreurs */}
          <img
            src={getImageUrl(comic)} // URL de l'image
            alt={comic.title} // Texte alternatif
            onError={handleImageError} // Remplacement image si erreur
            className="result-image"
          />
          <div className="result-content">
            {/* Titre du comic */}
            <h3 className="result-title">{comic.title}</h3>
            {/* Description ou texte par défaut */}
            <p className="result-description">
              {comic.description ||
                "Pas de description disponible… Ce comic semble aussi mystérieux que le passé de Wolverine !"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicId;
