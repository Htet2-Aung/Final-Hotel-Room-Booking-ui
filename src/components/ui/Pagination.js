import "./Pagination.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Pagination footer styled exactly like the DataTables pagination used by the
 * admin tables (pill buttons + blue gradient current page, "Show entries"
 * selector and "Showing x to y of z entries" info text).
 *
 * Props:
 *  - currentPage     (number, 1-based)
 *  - totalItems      (number)
 *  - pageSize        (number)
 *  - onPageChange    (fn) called with the new 1-based page number
 *  - onPageSizeChange (fn, optional) called with the new page size; when given,
 *                     a "Show entries" dropdown is rendered
 *
 * Renders nothing when the list is empty; the pager buttons hide when
 * everything fits on a single page (same as DataTables).
 */
const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goTo = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // windowed page numbers: 1 ... current-1 current current+1 ... last
  const pages = [];
  let lastAdded = 0;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      if (lastAdded && p - lastAdded > 1) {
        pages.push("...");
      }
      pages.push(p);
      lastAdded = p;
    }
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pg-footer">
      <div className="pg-left">
        {onPageSizeChange && (
          <label className="pg-length">
            Show
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            entries
          </label>
        )}
        <div className="pg-info">
          Showing {start} to {end} of {totalItems} entries
        </div>
      </div>
      {totalPages > 1 && (
        <div className="pg-paginate">
          <button
            type="button"
            className={`paginate_button previous ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={() => goTo(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            {pages.map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="paginate_ellipsis">
                  &hellip;
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={`paginate_button ${
                    page === currentPage ? "current" : ""
                  }`}
                  onClick={() => goTo(page)}
                >
                  {page}
                </button>
              )
            )}
          </span>
          <button
            type="button"
            className={`paginate_button next ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() => goTo(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;

