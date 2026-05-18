import { useState } from "react";
import { SUPPLY_CATEGORIES } from "../data/supplyCategories.js";
import SuppliesGrid from "./SuppliesGrid.jsx";

export default function SuppliesWorkspace({ sessionSupplies, sessionProjects, onEditSupply, onDeleteSupply, onOpenAddSupply, onImport, onExport }) {
  const [supplyNavView, setSupplyNavView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

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
          <p className="text-xs uppercase tracking-[0.35em] text-ast_pink">Inventory</p>
          <h1 className="mt-2 text-3xl font-bold text-ast_yellow">Art Supplies</h1>

          {supplyNavView !== "categories" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
              <button
                onClick={handleBackToCategories}
                className="hover:text-ast_pink transition"
              >
                Art Supplies
              </button>

              {selectedCategory && (
                <>
                  <span className="text-white/25">›</span>
                  {supplyNavView === "list" && selectedSubcategory ? (
                    <button
                      onClick={handleBackFromList}
                      className="hover:text-ast_pink transition"
                    >
                      {currentCategoryDef?.label}
                    </button>
                  ) : (
                    <span className="text-ast_pink">{currentCategoryDef?.label}</span>
                  )}
                </>
              )}

              {supplyNavView === "list" && selectedSubcategory && (
                <>
                  <span className="text-white/25">›</span>
                  <span className="text-ast_pink">{selectedSubcategory}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onImport}
            className="text-xs rounded-lg border border-ast_pink/40 px-3 py-1.5 text-ast_pink hover:bg-ast_pink/10 transition"
          >
            Import JSON
          </button>
          <button
            onClick={onExport}
            className="text-xs rounded-lg border border-ast_pink/40 px-3 py-1.5 text-ast_pink hover:bg-ast_pink/10 transition"
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
                className="rounded-2xl border border-ast_pink/30 bg-ast_pink/5 p-5 text-left hover:border-ast_pink/60 hover:bg-ast_pink/10 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-ast_pink">{cat.label}</p>
                  {hasAlert && (
                    <span className="text-xs bg-ast_yellow/20 text-ast_yellow px-1.5 py-0.5 rounded font-semibold">
                      !
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-ast_yellow">{count}</p>
                <p className="text-xs text-white/40 mt-1">
                  {count === 1 ? "item" : "items"}
                  {cat.subcategories.length > 0 && (
                    <span className="ml-1 text-white/25">· {cat.subcategories.length} types</span>
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
            className="rounded-2xl border border-ast_pink/60 bg-ast_pink/10 p-5 text-left hover:bg-ast_pink/20 transition"
          >
            <p className="text-sm font-semibold text-ast_pink mb-3">
              All {currentCategoryDef.label}
            </p>
            <p className="text-2xl font-bold text-ast_yellow">
              {getCategoryCount(selectedCategory)}
            </p>
            <p className="text-xs text-white/40 mt-1">view all</p>
          </button>

          {currentCategoryDef.subcategories.map(sub => {
            const subCount = getSubcategoryCount(selectedCategory, sub);
            return (
              <button
                key={sub}
                onClick={() => handleSelectSubcategory(sub)}
                className="rounded-2xl border border-ast_pink/20 bg-ast_pink/5 p-5 text-left hover:border-ast_pink/50 hover:bg-ast_pink/10 transition"
              >
                <p className="text-sm font-semibold text-ast_pink/80 mb-3">{sub}</p>
                <p className="text-2xl font-bold text-ast_yellow">{subCount}</p>
                <p className="text-xs text-white/40 mt-1">
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
          {filteredSupplies.length === 0 ? (
            <div className="rounded-2xl border border-ast_pink/20 bg-ast_pink/5 px-6 py-10 text-center">
              <p className="text-sm font-medium text-ast_pink/60 mb-1">
                {selectedSubcategory ? selectedSubcategory : currentCategoryDef?.label}
              </p>
              <p className="text-sm text-white/40">
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
              sessionProjects={sessionProjects}
              onEditSupply={onEditSupply}
              onDeleteSupply={onDeleteSupply}
            />
          )}
        </div>
      )}
    </>
  );
}
