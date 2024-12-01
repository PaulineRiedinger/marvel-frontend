import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import pictureNotFoundCharacter from "../assets/img/no-picture-character.webp";
import pictureNotFoundComic from "../assets/img/no-picture-comic.webp";

const ComicsByCharacterId = () => {
  const { characterId } = useParams(); // Extraction ID du perso depuis URL
  const [comics, setComics] = useState([]); // État pour stocker comics du perso
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // État pour gérer erreurs
  const [character, setCharacter] = useState(null); // État pour stocker info du perso

  // Vérifier URL image et retourner image par défaut si nécessaire
  const getImageUrl = (thumbnail, isComic = false) => {
    // Construire URL image
    const imageSrc = `${thumbnail.path}/portrait_fantastic.${thumbnail.extension}`;

    // Liste URL par défaut
    const defaultImages = [
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_fantastic.jpg",
      "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708/portrait_fantastic.gif",
    ];

    // Vérifier 'image récupérée = image par défaut
    let finalImageSrc = imageSrc;
    if (defaultImages.includes(imageSrc)) {
      // Si image = image par défaut -> remplacer par image personnalisée
      finalImageSrc = isComic
        ? pictureNotFoundComic // Image par défaut pour comics
        : pictureNotFoundCharacter; // Image par défaut pour persos
    }

    return finalImageSrc; // Retourner URL finale de l'image
  };

  // useEffect -> charger détails du perso (avant de charger les comics)
  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true); // Démarrer chargement
      setError(null); // Réinitialiser erreur

      try {
        if (!characterId) {
          throw new Error(
            "Erreur 404 : personnage introuvable… C’est une mission pour les Avengers."
          );
        }

        // Récupérer infos du perso
        const response = await axios.get(
          `https://site--marvel-backend--8hzg6997hg46.code.run/characterId/${characterId}`
        );

        if (response.data && response.data.name) {
          setCharacter(response.data); // Stocker infos
        } else {
          throw new Error(
            "Pas de trace de ce héros dans les bases du SHIELD. Mission échouée."
          );
        }
      } catch (err) {
        // Gestion des erreurs
        setError(
          err.response?.data?.message ||
            "Impossible de récupérer les informations du personnage… Peut-être que l'Agent Coulson les a cachées quelque part."
        );
      } finally {
        setLoading(false); // Terminer chargement
      }
    };

    fetchCharacter(); // Récupérer infos du perso
  }, [characterId]); // Effectuer lorsque ID change

  // useEffect -> charger comics liés au perso (après infos du perso)
  useEffect(() => {
    if (character) {
      // Charger comics si infos du perso dispo
      const fetchComics = async () => {
        setLoading(true); // Démarrer chargement
        setError(null); // Réinitialiser erreur

        try {
          // Récupérer comics du perso
          const response = await axios.get(
            `https://site--marvel-backend--8hzg6997hg46.code.run/comicsByCharacterId/${characterId}`
          );

          if (response.data && response.data.comics) {
            setComics(response.data.comics); // Stocker comics récupérés
          } else {
            throw new Error(
              "Ce héros semble avoir disparu dans une faille du Multivers."
            );
          }
        } catch (err) {
          // Afficher message d'erreur en cas de problème
          setError(
            err.response?.data?.message ||
              "Impossible de récupérer les comics… Peut-être que Thanos a effacé cette partie de la réalité."
          );
        } finally {
          setLoading(false); // Terminer chargement
        }
      };

      fetchComics(); // Récupérer comics
    }
  }, [character, characterId]); // Effectuer lorsque character est disponible et ID change

  // Affichage du contenu
  return (
    <div className="search-results">
      {/* Message de chargement */}
      {loading && (
        <p className="loading">Le Bifrost charge… vos comics arrivent.</p>
      )}

      {/* Affichage si erreurs */}
      {error && <p className="error">{error}</p>}

      {/* Affichage des détails du perso */}
      {!loading && character && (
        <div className="character-container">
          <h2 className="character-title">{character.name}</h2>
          <div className="character-content">
            <img
              // Utiliser getImageUrl pour vérif et obtention URL correcte de l'image
              src={getImageUrl(character.thumbnail)}
              alt={character.name}
              className="character-image"
            />
            <p className="character-description">
              {character.description ||
                "Tony Stark n'a pas encore compilé ces données."}
            </p>
          </div>
        </div>
      )}

      {/* Si aucun comic n'est trouvé -> */}
      {!loading && comics.length === 0 && (
        <p className="no-results">
          Pas de comic pour ce personnage… il est aussi discret que Black Widow.
        </p>
      )}

      {/* Si des comics sont trouvés -> */}
      {!loading && comics.length > 0 && (
        <div className="results">
          {comics.map((comic, index) => (
            <div key={comic.id || index} className="result-item">
              {/* Affichage de l'image du comic */}
              <img
                // getImageUrl pour vérif et obtention URL correcte de l'image
                src={getImageUrl(comic.thumbnail, true)} // -> true si comic
                alt={comic.title}
                className="result-image"
              />
              <div className="result-content">
                <h4 className="result-title">{comic.title}</h4>
                <p className="result-description">
                  {/* Si description -> l'afficher, sinon message par défaut */}
                  {comic.description ||
                    "Pas de description disponible… Ce comic semble aussi mystérieux que le passé de Wolverine !"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComicsByCharacterId;
