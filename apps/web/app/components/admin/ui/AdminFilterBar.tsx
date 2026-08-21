'use client';

import React from 'react';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelect {
  id: string;
  value: string;
  onChange: (val: string) => void;
  options: FilterOption[];
  placeholder?: string;
}

interface AdminFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filters?: FilterSelect[];
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: FilterOption[];
  totalResults: number;
  onReset?: () => void;
  extraActions?: React.ReactNode;
}

export default function AdminFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  filters = [],
  sortBy,
  onSortChange,
  sortOptions = [],
  totalResults,
  onReset,
  extraActions,
}: AdminFilterBarProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Dynamic Select Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {filters.map((filter) => (
            <select
              key={filter.id}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {onReset && (
            <button
              onClick={onReset}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition"
              title="Đặt lại bộ lọc"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}

          {extraActions}
        </div>
      </div>

      {/* Counter and Sort Footer */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 gap-2">
        <span>
          Tìm thấy <strong className="font-mono text-emerald-600 font-bold">{totalResults}</strong> kết quả phù hợp
        </span>

        {onSortChange && sortOptions.length > 0 && (
          <div className="flex items-center space-x-2">
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
