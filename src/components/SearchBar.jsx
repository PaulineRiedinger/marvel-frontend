import React, { useState } from "react";
import "../style/SearchBar.css";

// onSearch -> fonction appelée pour effectuer recherche
const SearchBar = ({ onSearch, placeholder }) => {
  // Initialiser query avec une valeur vide -> va contenir la valeur tapée par l'utilisateur dans la barre
  const [query, setQuery] = useState("");

  // handleInputChange -> fonction appelée à chaque fois que l'utilisateur tape quelque chose dans la barre
  const handleInputChange = (e) => {
    // Mettre à jour query avec la valeur entrée par l'utilisateur
    setQuery(e.target.value);

    // Appeler fonction onSearch, et lui passer la valeur actuelle de la recherche
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      {" "}
      <input
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
