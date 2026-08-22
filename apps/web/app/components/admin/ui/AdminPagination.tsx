'use client';

import React from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs">
      <span className="text-slate-500">
        Hiển thị <strong className="font-mono text-slate-800">{startItem}</strong> —{' '}
        <strong className="font-mono text-slate-800">{endItem}</strong> trong tổng số{' '}
        <strong className="font-mono text-slate-800">{totalItems}</strong> kết quả
      </span>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-lg border border-slate-200 transition font-medium"
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition ${
              currentPage === page
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-lg border border-slate-200 transition font-medium"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
