import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Charger favoris depuis cookies au démarrage
  useEffect(() => {
    const storedFavorites = Cookies.get("favorites"); // Récupérer fav stockés dans cookies
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites)); // Si fav -> parser et définir dans l'état
    }
  }, []);

  // Mettre à jour cookies à chaque modif des fav
  useEffect(() => {
    Cookies.set("favorites", JSON.stringify(favorites), { expires: 7 }); // Sauvegarder fav dans cookies pour 7 jours
  }, [favorites]); // useEffect se déclenche à chaque changement des fav

  // Ajouter un favori
  const addFavorite = (item) => {
    // Vérifier élément n'est pas déjà dans les fav
    if (!favorites.find((fav) => fav.id === item.id)) {
      setFavorites([...favorites, item]); // Ajouter l'élément aux fav
    }
  };

  // Supprimer un favori
  const removeFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id)); // Filtrer fav pour supprimer celui ayant id correspondant
  };

  // Vérifier si élément est favori
  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id); // True si élément avec id présent dans FAV
  };

  return {
    favorites, // Liste des favoris
    addFavorite, // Fonction pour ajouter favori
    removeFavorite, // Fonction pour suppr favori
    isFavorite, // Fonction pour vérif si élément est dans les fav
  };
};

export default useFavorites;
