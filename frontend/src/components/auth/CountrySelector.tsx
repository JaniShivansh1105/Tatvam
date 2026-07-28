"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const COUNTRIES: Country[] = [
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", dialCode: "+971" },
  { name: "Bangladesh", code: "BD", flag: "🇧🇩", dialCode: "+880" },
  { name: "Nepal", code: "NP", flag: "🇳🇵", dialCode: "+977" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰", dialCode: "+92" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dialCode: "+234" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", dialCode: "+52" },
  { name: "Italy", code: "IT", flag: "🇮🇹", dialCode: "+39" },
  { name: "Spain", code: "ES", flag: "🇪🇸", dialCode: "+34" },
  { name: "China", code: "CN", flag: "🇨🇳", dialCode: "+86" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", dialCode: "+65" },
];

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export const CountrySelector = React.forwardRef<HTMLButtonElement, CountrySelectorProps>(
  ({ value, onChange, error }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const filteredCountries = useMemo(() => {
      const lowerSearch = search.toLowerCase();
      return COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerSearch) ||
          c.dialCode.includes(lowerSearch) ||
          c.code.toLowerCase().includes(lowerSearch)
      );
    }, [search]);

    const selectedCountry = useMemo(
      () => COUNTRIES.find((c) => c.dialCode === value),
      [value]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown" && listRef.current) {
        e.preventDefault();
        (listRef.current.firstElementChild as HTMLElement)?.focus();
      }
    };

    return (
      <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
        <button
          ref={ref}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full h-[50px] bg-white/80 backdrop-blur-md border rounded-[16px] px-3 text-[14px] outline-none transition-all duration-200 focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 flex items-center justify-between ${
            error ? "border-[#FC8181]" : "border-[#E2E8F0]"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedCountry ? (
              <>
                <span className="text-[16px]">{selectedCountry.flag}</span>
                <span className="font-medium text-[#1B1D35]">{selectedCountry.dialCode}</span>
              </>
            ) : (
              <span className="text-[#A0AEC0]">Code</span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-[#A0AEC0]" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-[240px] top-[calc(100%+8px)] left-0 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl overflow-hidden"
            >
              <div className="p-2 border-b border-[#E2E8F0]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search country or code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-[36px] bg-[#F8F9FF] rounded-[10px] pl-9 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 border border-transparent focus:border-[#6C5CE7]/30 transition-all"
                  />
                </div>
              </div>
              <ul
                ref={listRef}
                className="max-h-[200px] overflow-y-auto custom-scrollbar p-1"
                role="listbox"
              >
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <li
                      key={country.code}
                      role="option"
                      aria-selected={value === country.dialCode}
                      tabIndex={0}
                      onClick={() => {
                        onChange(country.dialCode);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onChange(country.dialCode);
                          setIsOpen(false);
                          setSearch("");
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-[10px] cursor-pointer text-[13px] outline-none focus:bg-[#F0E6FF] hover:bg-[#F8F9FF] transition-colors ${
                        value === country.dialCode ? "bg-[#F0E6FF] text-[#6C5CE7] font-medium" : "text-[#4A5568]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[16px]">{country.flag}</span>
                        <span className="truncate">{country.name}</span>
                        <span className="text-[#A0AEC0] shrink-0">{country.dialCode}</span>
                      </div>
                      {value === country.dialCode && <Check className="w-4 h-4 text-[#6C5CE7] shrink-0 ml-2" />}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-4 text-center text-[13px] text-[#A0AEC0]">
                    No countries found
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
CountrySelector.displayName = "CountrySelector";
