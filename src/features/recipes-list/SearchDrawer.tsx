import {
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import debounce from "lodash.debounce";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useResettableState } from "../../utils/useResettableState";
import classNames from "classnames";
import { useCategories } from "../../data/Categories";
import { useElementHeight } from "../../utils/useElementHeight";
import { match } from "ts-pattern";
import { RecipesListFilters, useRecipesFilters } from "./useRecipesFilters";

export const SearchDrawer = () => {
  const { searchTerm, categoryId, updateFilters } = useRecipesFilters();
  const [containerRef, containerHeight] = useElementHeight<HTMLDivElement>();
  const [filtersRef, filtersHeight] = useElementHeight<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(!!categoryId || !!searchTerm);
  const [filtersOpen, setFiltersOpen] = useState(!!categoryId);
  const [search, setSearch] = useResettableState(searchTerm, [searchTerm]);
  const { categories: allCategories } = useCategories();

  const updateSearch = useCallback(
    debounce((searchTerm: string) => {
      updateFilters({ searchTerm });
    }, 250),
    []
  );

  const handleSearchChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(evt.currentTarget.value);
    setSearch(evt.currentTarget.value);
  };

  const selectCategory = (id: string) => {
    const newCategoryId = id === categoryId ? undefined : id;
    updateFilters({ categoryId: newCategoryId });
  };

  const toggleFilters = () => {
    if (filtersOpen) {
      setFiltersOpen(false);
      updateFilters({ categoryId: undefined });
    } else {
      setFiltersOpen(true);
    }
  };

  const activeFilters = countActiveFilters({ searchTerm, categoryId });

  const height = match({ filtersOpen, isOpen })
    // if not open, push down the whole height
    .with({ isOpen: false }, () => -containerHeight)
    // only search bar visible, push down the filters space
    .with({ filtersOpen: false }, () => -containerHeight + filtersHeight)
    // all visible, no push down
    .with({ filtersOpen: true }, () => -1)
    .exhaustive();

  return (
    <motion.div
      layout="position"
      className="fixed bottom-0 left-0 w-full px-2 py-6 shadow-black shadow-md glass-bg-3 rounded-t-box"
      ref={containerRef}
      style={{ bottom: height }}
    >
      <div className="flex justify-center h-0">
        <motion.button
          className="btn btn-lg btn-outline btn-circle bg-base-100 relative border-primary"
          animate={{ top: isOpen ? -60 : -90 }}
          onClick={() => setIsOpen((x) => !x)}
          layout
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {activeFilters > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="badge badge-sm badge-primary absolute -top-2 -right-2"
              >
                {activeFilters}
              </motion.span>
            )}
          </AnimatePresence>
          <MagnifyingGlassIcon size={22} />
        </motion.button>
      </div>
      <label className="input w-full">
        <MagnifyingGlassIcon size={22} />
        <input
          type="search"
          value={search}
          className="grow"
          placeholder="Search"
          onChange={handleSearchChanged}
        />
        <button
          className={classNames("btn btn-sm shadow-md relative -right-2", {
            "btn-primary": filtersOpen,
          })}
          onClick={toggleFilters}
        >
          <SlidersHorizontalIcon size={22} />
        </button>
      </label>
      <div className="flex flex-row gap-2 flex-wrap pt-4" ref={filtersRef}>
        {allCategories.map((c) => (
          <motion.span
            key={c.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => selectCategory(c.id)}
            className={classNames("badge", {
              "badge-primary": categoryId === c.id,
            })}
          >
            {c.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const countActiveFilters = (filters: RecipesListFilters) => {
  let c = 0;
  if (!!filters.categoryId) c++;
  if (!!filters.searchTerm) c++;
  return c;
};
