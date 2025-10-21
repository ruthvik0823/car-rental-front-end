import { ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 cursor-pointer ${
            currentPage === page ? 'bg-black text-white' : 'bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 ml-1 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};