export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const prev = () => onPageChange(Math.max(1, currentPage - 1));
  const next = () => onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={prev}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border"
      >
        Prev
      </button>
      <span>
        Hal {currentPage} / {totalPages}
      </span>
      <button
        onClick={next}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border"
      >
        Next
      </button>
    </div>
  );
}
