import React from "react";
import "../style/Pagination.css";

// Pagination, 3 props : currentPage, totalPages, onPageChange
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      {/* Bouton page précédente */}
      <button
        className="pagination-button nav-button"
        onClick={() => onPageChange(currentPage - 1)} // Appeler fonction onPageChange avec currentPage - 1 pour aller page précédente
        disabled={currentPage === 1} // Désactiver bouton si première page
      >
        &#171; {/* Afficher flèche vers la gauche (HTML) */}
      </button>

      {/* Afficher infos sur page actuelle + nombre total de pages */}
      <span className="pagination-info">
        Page {currentPage} sur {totalPages}
      </span>

      {/* Bouton page suivante */}
      <button
        className="pagination-button nav-button"
        onClick={() => onPageChange(currentPage + 1)} // Appeler fonction onPageChange avec currentPage + 1 pour aller page suivante
        disabled={currentPage === totalPages} // Désactiver bouton si dernière page
      >
        &#187; {/* Afficher flèche vers la droite (HTML) */}
      </button>
    </div>
  );
};

export default Pagination;
