import styles from './Pagination.module.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange 
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
      </div>
      
      <div className={styles.controls}>
        <button
          className={styles.pageButton}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          ← Anterior
        </button>
        
        <span className={styles.pageInfo}>
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          className={styles.pageButton}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
