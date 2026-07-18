"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCommandPalette from "./hooks/useCommandPalette";
import useGlobalSearch from "./hooks/useGlobalSearch";
import useSearchProvider from "./hooks/useSearchProvider";
import useCommandRegistry from "./hooks/useCommandRegistry";
import { Command } from "./registry";
import { SearchRecord } from "./search-providers";
import { useLayoutStore } from "@/shared/stores/layout.store";

export default function CommandPaletteOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const { isPaletteOpen, setPaletteOpen, addRecentCommand, pinnedCommands } = useCommandPalette();
  const { query, setQuery, addRecentSearch } = useGlobalSearch();
  const { results, isSearching } = useSearchProvider(query);
  const { commands, searchCommands } = useCommandRegistry();
  const { addToast } = useLayoutStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine commands and search results into a unified list
  const filteredCommands = query.trim() ? searchCommands(query) : commands.filter(c => pinnedCommands.includes(c.id));
  const listItems: Array<{ type: "command"; item: Command } | { type: "search"; item: SearchRecord }> = [
    ...filteredCommands.map(cmd => ({ type: "command" as const, item: cmd })),
    ...results.map(rec => ({ type: "search" as const, item: rec }))
  ];

  useEffect(() => {
    if (isPaletteOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isPaletteOpen, setQuery]);

  // Keep active index inside bounds when list length changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPaletteOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, listItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + listItems.length) % Math.max(1, listItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = listItems[activeIndex];
        if (selected) {
          handleExecute(selected);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaletteOpen, activeIndex, listItems]);

  const handleExecute = (target: typeof listItems[0]) => {
    if (target.type === "command") {
      const cmd = target.item;
      addRecentCommand(cmd.id);
      
      if (cmd.path) {
        router.push(cmd.path);
      } else if (cmd.action) {
        cmd.action();
      } else {
        addToast({
          type: "info",
          title: "Command Triggered",
          message: `Successfully executed system action: ${cmd.label}`,
        });
      }
    } else {
      const rec = target.item;
      addRecentSearch(rec.title);
      router.push(rec.path);
    }
    setPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      {isPaletteOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPaletteOpen(false)}
            className="fixed inset-0 bg-black/80 z-[100] cursor-pointer backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-start justify-center z-[101] pt-[15vh] px-4 select-none">
            <motion.div
              initial={{ y: -30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -30, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[50vh]"
            >
              {/* Input Header */}
              <div className="flex items-center px-4 border-b border-[#2a2a2a] h-12 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search invoices, customers, vendors..."
                  className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-[#888888] focus:ring-0 focus:outline-none"
                />
                {isSearching && (
                  <div className="w-3.5 h-3.5 border border-[#faff69]/20 border-t-[#faff69] rounded-full animate-spin" />
                )}
              </div>

              {/* Items List View */}
              <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#2a2a2a]/30">
                {listItems.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#888888]">
                    No matching commands or database records found.
                  </div>
                ) : (
                  listItems.map((wrapped, idx) => {
                    const isSelected = idx === activeIndex;
                    
                    if (wrapped.type === "command") {
                      const cmd = wrapped.item;
                      return (
                        <div
                          key={cmd.id}
                          onClick={() => handleExecute(wrapped)}
                          className={`p-3 rounded-md flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isSelected 
                              ? "bg-[#1a1a1a] text-white border border-[#faff69]/20 shadow-md font-semibold" 
                              : "text-[#888888] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isSelected ? "text-[#faff69]" : ""}>⚡</span>
                            <span>{cmd.label}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]">
                              {cmd.category}
                            </span>
                          </div>
                          {cmd.shortcut && (
                            <kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[9px] text-[#cccccc]">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </div>
                      );
                    } else {
                      const rec = wrapped.item;
                      return (
                        <div
                          key={rec.id}
                          onClick={() => handleExecute(wrapped)}
                          className={`p-3 rounded-md flex flex-col gap-0.5 cursor-pointer border transition-all ${
                            isSelected 
                              ? "bg-[#1a1a1a] text-white border-[#faff69]/20 shadow-md font-semibold" 
                              : "text-[#888888] border-transparent hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-[#faff69]">◼</span>
                              <span className={isSelected ? "text-white" : "text-[#cccccc]"}>{rec.title}</span>
                              <span className="text-[9px] px-1 rounded bg-[#2a2a2a] text-[#888888] font-bold">
                                {rec.type}
                              </span>
                            </div>
                            {rec.metadata && (
                              <span className="text-[9px] text-[#faff69]/60">{rec.metadata}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#888888] font-normal pl-4">{rec.subtitle}</span>
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
