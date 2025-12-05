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
import { RecipesListFilters } from "./RecipesListPage";

export const SearchDrawer = () => {
  const { searchTerm, categoryId } = useSearch({ from: "/recipes/" });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>();
  const [isOpen, setIsOpen] = useState(!!categoryId || !!searchTerm);
  const [filtersOpen, setFiltersOpen] = useState(!!categoryId);
  const [search, setSearch] = useResettableState(searchTerm, [searchTerm]);
  const { categories: allCategories } = useCategories();
  const navigate = useNavigate();

  const updateSearch = useCallback(
    debounce((searchTerm: string) => {
      navigate({
        to: ".",
        search: (s) => ({ ...s, searchTerm }),
        replace: true,
      });
    }, 250),
    []
  );

  const handleSearchChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(evt.currentTarget.value);
    setSearch(evt.currentTarget.value);
  };

  const selectCategory = (id: string) => {
    const newCategoryId = id === categoryId ? undefined : id;
    navigate({
      to: ".",
      search: (s) => ({ ...s, categoryId: newCategoryId }),
      replace: true,
    });
  };

  useLayoutEffect(() => {
    setContainerHeight(containerRef.current?.clientHeight);
  });

  const toggleFilters = () => {
    if (filtersOpen) {
      setFiltersOpen(false);
      navigate({
        to: ".",
        search: (s) => ({ ...s, categoryId: undefined }),
        replace: true,
      });
    } else {
      setFiltersOpen(true);
    }
  };

  const activeFilters = countActiveFilters({ searchTerm, categoryId });

  return (
    <motion.div
      layout="position"
      className="fixed bottom-0 left-0 w-full px-2 py-6 shadow-black shadow-md glass-bg-3 rounded-t-box"
      ref={containerRef}
      style={{ bottom: isOpen ? -1 : -(containerHeight ?? 0) }}
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
      {filtersOpen && (
        <div className="flex flex-row gap-2 flex-wrap mt-4">
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
      )}
    </motion.div>
  );
};

const countActiveFilters = (filters: RecipesListFilters) => {
  let c = 0;
  if (!!filters.categoryId) c++;
  if (!!filters.searchTerm) c++;
  return c;
};
