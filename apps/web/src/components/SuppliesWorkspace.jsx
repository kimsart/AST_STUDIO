import { useState, useEffect, useRef } from "react";
import { SUPPLY_CATEGORIES } from "../data/supplyCategories.js";
import SuppliesGrid from "./SuppliesGrid.jsx";

export default function SuppliesWorkspace({ sessionSupplies, sessionProjects, isLoading = false, onEditSupply, onDeleteSupply, onAssignSupply, onOpenAddSupply, onImport, onExport }) {
  const [supplyNavView, setSupplyNavView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // When a supply is added, reset to unfiltered list so the new item is always visible —
  // including custom categories that have no bento card and would otherwise be unreachable.
  const prevCountRef = useRef(sessionSupplies.length);
  useEffect(() => {
    if (sessionSupplies.length > prevCountRef.current) {
      setSupplyNavView("list");
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
    prevCountRef.current = sessionSupplies.length;
  }, [sessionSupplies.length]);

  const currentCategoryDef = selectedCategory
    ? SUPPLY_CATEGORIES.find(c => c.value === selectedCategory)
    : null;

  const getCategoryCount = (catValue) =>
    sessionSupplies.filter(s => s.category === catValue).length;

  const getSubcategoryCount = (catValue, sub) =>
    sessionSupplies.filter(s => s.category === catValue && s.subcategory === sub).length;

  const getCategoryHasAlert = (catValue) =>
    sessionSupplies.some(s => s.category === catValue && (s.status === "low" || s.status === "critical"));

  const getFilteredSupplies = () => {
    if (!selectedCategory) return sessionSupplies;
    if (selectedSubcategory) {
      return sessionSupplies.filter(
        s => s.category === selectedCategory && s.subcategory === selectedSubcategory
      );
    }
    return sessionSupplies.filter(s => s.category === selectedCategory);
  };

  const handleSelectCategory = (catValue) => {
    const cat = SUPPLY_CATEGORIES.find(c => c.value === catValue);
    setSelectedCategory(catValue);
    setSelectedSubcategory(null);
    setSupplyNavView(cat && cat.subcategories.length > 0 ? "subcategories" : "list");
  };

  const handleSelectSubcategory = (sub) => {
    setSelectedSubcategory(sub);
    setSupplyNavView("list");
  };

  const handleViewAll = () => {
    setSelectedSubcategory(null);
    setSupplyNavView("list");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSupplyNavView("categories");
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    setSupplyNavView("subcategories");
  };

  const handleBackFromList = () => {
    if (currentCategoryDef && currentCategoryDef.subcategories.length > 0) {
      handleBackToSubcategories();
    } else {
      handleBackToCategories();
    }
  };

  const filteredSupplies = getFilteredSupplies();

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#9F6BFF]">Inventory</p>
          <h1 className="mt-2 text-3xl font-bold bg-[linear-gradient(90deg,#00E6FF_0%,#2E64FF_35%,#8D5CFF_65%,#FF2FB3_100%)] bg-clip-text text-transparent">Art Supplies</h1>

          {supplyNavView !== "categories" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-ast_muted">
              <button
                onClick={handleBackToCategories}
                className="hover:text-[#00E5FF] transition"
              >
                Art Supplies
              </button>

              {selectedCategory && (
                <>
                  <span className="text-ast_faint">›</span>
                  {supplyNavView === "list" && selectedSubcategory ? (
                    <button
                      onClick={handleBackFromList}
                      className="hover:text-[#00E5FF] transition"
                    >
                      {currentCategoryDef?.label}
                    </button>
                  ) : (
                    <span className="text-[#00E5FF]">{currentCategoryDef?.label}</span>
                  )}
                </>
              )}

              {supplyNavView === "list" && selectedSubcategory && (
                <>
                  <span className="text-ast_faint">›</span>
                  <span className="text-[#00E5FF]">{selectedSubcategory}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onImport}
            className="text-xs rounded-lg border border-[#9F6BFF]/40 px-3 py-1.5 text-[#9F6BFF] hover:border-[#315CFF]/60 hover:bg-[#315CFF]/10 hover:shadow-[0_0_12px_rgba(49,92,255,0.2)] transition"
          >
            Import JSON
          </button>
          <button
            onClick={onExport}
            className="text-xs rounded-lg border border-[#9F6BFF]/40 px-3 py-1.5 text-[#9F6BFF] hover:border-[#315CFF]/60 hover:bg-[#315CFF]/10 hover:shadow-[0_0_12px_rgba(49,92,255,0.2)] transition"
          >
            Export Data
          </button>
          <button
            onClick={onOpenAddSupply}
            className="rounded-xl border border-ast_pink/40 bg-ast_pink/10 px-4 py-2 text-sm font-semibold text-ast_pink hover:bg-ast_pink/20 transition"
          >
            + Add Supply
          </button>
        </div>
      </div>

      {/* Category bento grid */}
      {supplyNavView === "categories" && (
        <div className="grid grid-cols-3 gap-3">
          {SUPPLY_CATEGORIES.map(cat => {
            const count = getCategoryCount(cat.value);
            const hasAlert = getCategoryHasAlert(cat.value);
            return (
              <button
                key={cat.value}
                onClick={() => handleSelectCategory(cat.value)}
                className="rounded-2xl border border-[#9F6BFF]/40 bg-[#9F6BFF]/5 p-5 text-left hover:border-[#00E5FF]/65 hover:bg-[#00E5FF]/5 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-[#9F6BFF]">{cat.label}</p>
                  {hasAlert && (
                    <span className="text-xs bg-[#F6B94B]/20 text-[#F6B94B] px-1.5 py-0.5 rounded font-semibold">
                      !
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-[#00E5FF]">{count}</p>
                <p className="text-xs text-ast_faint mt-1">
                  {count === 1 ? "item" : "items"}
                  {cat.subcategories.length > 0 && (
                    <span className="ml-1 text-ast_faint">· {cat.subcategories.length} types</span>
                  )}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Subcategory bento grid */}
      {supplyNavView === "subcategories" && currentCategoryDef && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleViewAll}
            className="rounded-2xl border border-[#00D6C9]/80 bg-[linear-gradient(135deg,rgba(0,229,255,0.14),rgba(49,92,255,0.16))] p-5 text-left shadow-[0_0_24px_rgba(0,229,255,0.18)] hover:shadow-[0_0_30px_rgba(0,229,255,0.25)] transition"
          >
            <p className="text-sm font-semibold text-[#00D6C9] mb-3">
              All {currentCategoryDef.label}
            </p>
            <p className="text-2xl font-bold text-[#00E5FF]">
              {getCategoryCount(selectedCategory)}
            </p>
            <p className="text-xs text-ast_faint mt-1">view all</p>
          </button>

          {currentCategoryDef.subcategories.map(sub => {
            const subCount = getSubcategoryCount(selectedCategory, sub);
            return (
              <button
                key={sub}
                onClick={() => handleSelectSubcategory(sub)}
                className="rounded-2xl border border-[#9F6BFF]/30 bg-[#9F6BFF]/5 p-5 text-left hover:border-[#00E5FF]/65 hover:bg-[#00E5FF]/5 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] transition"
              >
                <p className="text-sm font-semibold text-[#9F6BFF]/80 mb-3">{sub}</p>
                <p className="text-2xl font-bold text-[#00E5FF]">{subCount}</p>
                <p className="text-xs text-ast_faint mt-1">
                  {subCount === 1 ? "item" : "items"}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Supply list view */}
      {supplyNavView === "list" && (
        <div className="space-y-3">
          {isLoading ? (
            <p className="py-8 text-sm text-ast_body/40 text-center">Loading supplies…</p>
          ) : filteredSupplies.length === 0 ? (
            <div className="rounded-2xl border border-[#9F6BFF]/20 bg-[#9F6BFF]/5 px-6 py-10 text-center">
              <p className="text-sm font-medium text-[#9F6BFF]/60 mb-1">
                {selectedSubcategory ? selectedSubcategory : currentCategoryDef?.label}
              </p>
              <p className="text-sm text-ast_faint">
                No supplies here yet.
              </p>
              <button
                onClick={onOpenAddSupply}
                className="mt-4 rounded-xl border border-ast_pink/30 bg-ast_pink/10 px-4 py-2 text-sm text-ast_pink hover:bg-ast_pink/20 transition"
              >
                + Add Supply
              </button>
            </div>
          ) : (
            <SuppliesGrid
              sessionSupplies={filteredSupplies}
              allSupplies={sessionSupplies}
              sessionProjects={sessionProjects}
              onEditSupply={onEditSupply}
              onDeleteSupply={onDeleteSupply}
              onAssignSupply={onAssignSupply}
            />
          )}
        </div>
      )}
    </>
  );
}
