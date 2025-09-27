//add pagination control

import { SetStateAction } from "react";

function Pagination({ totaltodos, totalPerPage, currentPage, setCurrentPage }: {totaltodos: number, totalPerPage:number, currentPage: number, setCurrentPage:React.Dispatch<SetStateAction<number>>}) {
  const pageRange = 5;
  const pageNumber: number[] = [];
  //const totalTodos =
  // for (let index = 0; index < Math.ceil(totaltodos / totalPerPage); index++) {
  //     pageNumber.push(index)
  // }

  let startPage = Math.max(currentPage - 1, 1);
  const endPage = Math.min(
    startPage + pageRange - 1,
    Math.ceil(totaltodos / totalPerPage)
  );
  if (endPage - startPage < pageRange - 1)
    startPage = Math.max(endPage - pageRange + 1, 1);

  for (let index = startPage; index <= endPage; index++) {
    pageNumber.push(index);
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center gap-2 my-8">
      <button
        className="btn bg-[#37cdbe]"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
      >
        Prev
      </button>

      <div role="group" aria-label="Page navigation">
        {pageNumber.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`btn ml-2 ${
              number === currentPage ? "bg-[#37cdbe]" : "btn-outline"
            }`}
            aria-label={`Page ${number}`}
            aria-current={number === currentPage ? "page" : undefined}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        className="btn bg-[#37cdbe]"
        disabled={currentPage === Math.ceil(totaltodos / totalPerPage)}
        onClick={() => setCurrentPage(currentPage + 1)}
        aria-label="Next page"
        aria-disabled={currentPage === Math.ceil(totaltodos / totalPerPage)}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
