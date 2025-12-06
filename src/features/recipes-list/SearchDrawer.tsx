import {
  ArrowCounterClockwiseIcon,
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
  const { searchTerm, categories, updateFilters, hasFilters, resetFilters } =
    useRecipesFilters();
  const [containerRef, containerHeight] = useElementHeight<HTMLDivElement>();
  const [filtersRef, filtersHeight] = useElementHeight<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(hasFilters);
  const [filtersOpen, setFiltersOpen] = useState((categories?.length ?? 0) > 0);
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
    const isSelected = categories?.includes(id) ?? false;
    if (isSelected)
      updateFilters({ categories: categories?.filter((f) => f !== id) });
    else updateFilters({ categories: [...(categories || []), id] });
  };

  const toggleFilters = () => {
    if (filtersOpen) {
      setFiltersOpen(false);
      updateFilters({ categories: undefined });
    } else {
      setFiltersOpen(true);
    }
  };

  const activeFilters = countActiveFilters({ searchTerm, categories });

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
      className="fixed bottom-0 left-0 w-full px-4 py-6 shadow-1 glass-bg-3 rounded-t-box z-10"
      ref={containerRef}
      style={{ bottom: height }}
    >
      <div className="flex justify-center h-0">
        <motion.button
          className="btn btn-xl btn-outline btn-circle bg-base-100 relative border-primary"
          animate={{ top: isOpen ? -70 : -100 }}
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
          <MagnifyingGlassIcon size={28} />
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

        <div className="flex flex-row gap-1">
          {hasFilters && (
            <button
              className="btn btn-sm shadow-md relative -right-2"
              disabled={!hasFilters}
              onClick={resetFilters}
            >
              <ArrowCounterClockwiseIcon size={22} />
            </button>
          )}
          <button
            className={classNames("btn btn-sm shadow-md relative -right-2", {
              "btn-primary": filtersOpen,
            })}
            onClick={toggleFilters}
          >
            <SlidersHorizontalIcon size={22} />
          </button>
        </div>
      </label>
      <div className="flex flex-row gap-2 flex-wrap pt-6" ref={filtersRef}>
        {allCategories.map((c) => (
          <motion.span
            key={c.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => selectCategory(c.id)}
            className={classNames("badge", {
              "badge-primary": categories?.includes(c.id),
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
  let c = filters.categories?.length ?? 0;
  if (!!filters.searchTerm) c++;
  return c;
};
