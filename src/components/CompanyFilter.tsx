import React from 'react';
import { BUS_COMPANIES, BUS_ROUTES } from '../data/bangladeshRoutes';
import { Search, Filter, Route as RouteIcon, X } from 'lucide-react';

interface CompanyFilterProps {
  selectedCompany: string;
  onSelectCompany: (companyId: string) => void;
  selectedRoute: string;
  onSelectRoute: (routeId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFiltered: number;
}

export const CompanyFilter: React.FC<CompanyFilterProps> = ({
  selectedCompany,
  onSelectCompany,
  selectedRoute,
  onSelectRoute,
  searchQuery,
  onSearchChange,
  totalFiltered
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4 mb-6">
      {/* Top Search & Route Select Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="বাসের নাম, নম্বর বা গন্তব্য খুঁজুন..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            id="input-search-bus"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Route Dropdown */}
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <RouteIcon className="w-4 h-4" />
          </div>
          <select
            value={selectedRoute}
            onChange={(e) => onSelectRoute(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
            id="select-route-filter"
          >
            <option value="all">সব রুট (All Routes)</option>
            {BUS_ROUTES.map((route) => (
              <option key={route.id} value={route.id}>
                {route.nameBn} ({route.highwayCode})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Company Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>কোম্পানি ফিল্টার</span>
          </label>
          <span className="text-xs font-medium text-slate-500">
            দেখানো হচ্ছে: <strong className="text-emerald-700 font-bold">{totalFiltered}</strong>টি বাস
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            onClick={() => onSelectCompany('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCompany === 'all'
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            id="filter-company-all"
          >
            সব কোম্পানি
          </button>

          {BUS_COMPANIES.map((company) => {
            const isSelected = selectedCompany === company.id;
            return (
              <button
                key={company.id}
                onClick={() => onSelectCompany(company.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                id={`filter-company-${company.id}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: company.color }}
                />
                <span>{company.nameBn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
