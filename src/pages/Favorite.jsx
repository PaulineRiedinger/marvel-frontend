import React from "react";
import "../style/Favorite.css";

import pictureNotFoundComic from "../assets/img/no-picture-comic.webp";
import pictureNotFoundCharacter from "../assets/img/no-picture-character.webp";

const Favorite = ({ favorites, removeFavorite }) => {
  return (
    <div className="favorite-container">
      <h2 className="favorite-title">
        Tes héros et vilains favoris, une équipe parfaite pour sauver l'univers…
        ou le conquérir !
      </h2>

      {/* Afficher message si liste de favoris = vide */}
      {favorites.length === 0 ? (
        <p>Pas encore de choix ? L'univers attend que tu prennes position !</p>
      ) : (
        <ul className="favorite-list">
          {/* Parcours de la liste */}
          {favorites.map((fav) => {
            // Déterminer si élément = comic ou personnage
            const isComic = fav.title; // Si 'title'-> comic
            const isCharacter = fav.name; // Si 'name' -> perso

            // Construire URL de l'image
            const imageSrc = `${fav.thumbnail.path}/portrait_fantastic.${fav.thumbnail.extension}`;

            // Liste des URL par défaut de l'API pour les images qui ne sont pas dispos
            const defaultImages = [
              "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_fantastic.jpg",
              "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708/portrait_fantastic.gif",
            ];

            // Vérif si image récupérée est une image par défaut
            let finalImageSrc = imageSrc;
            if (defaultImages.includes(imageSrc)) {
              // Si image = image par défaut -> image personnalisée en fonction du type
              finalImageSrc = isComic
                ? pictureNotFoundComic // Image par défaut pour comics
                : pictureNotFoundCharacter; // Image par défaut pour persos
            }

            return (
              <li key={fav.id} className="favorite-item">
                {/* Contenu de chaque élément de la liste des favs */}
                <div className="favorite-item-content">
                  <img
                    src={finalImageSrc} // URL de l'image finale (soit image trouvée, soit image par défaut)
                    alt={isComic ? fav.title : fav.name} // Alt text dépendant si comic ou perso
                    className="favorite-item-img"
                  />
                  <span className="favorite-item-name">
                    {/* Affichage titre pour comics ou nom pour persos */}
                    {isComic ? fav.title : fav.name}
                  </span>
                </div>
                {/* Bouton pour retirer élément des favs */}
                <button
                  onClick={() => removeFavorite(fav.id)} // Appel de la fonction pour retirer élément
                  className="remove-favorite-btn"
                >
                  Retirer des favoris
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Favorite;
