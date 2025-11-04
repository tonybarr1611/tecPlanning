import React from "react";
import { Search, Filter } from "lucide-react";

export interface SelectFilter {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  filters?: SelectFilter[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  searchPlaceholder = "Buscar...",
  filters = [],
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} />
        <h3 className="font-medium">Filtros</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        {filters.map((filter, index) => (
          <div key={index} className="min-w-[150px]">
            <label className="sr-only">{filter.label}</label>
            <select
              aria-label={filter.label}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FilterBar;
