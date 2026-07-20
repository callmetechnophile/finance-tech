"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Skeleton } from "@/shared/components/feedback/Skeleton";
import { EmptyState } from "@/shared/components/feedback/EmptyState";

type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey?: (row: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  stickyHeader?: boolean;
  loadingRows?: number;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyTitle = "No data",
  emptyDescription,
  onRowClick,
  className,
  stickyHeader = false,
  loadingRows = 5,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      } else {
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = String(av) < String(bv) ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 text-white/20" />;
    if (sortDir === "asc") return <ChevronUp className="w-3 h-3 text-[#faff69]" />;
    if (sortDir === "desc") return <ChevronDown className="w-3 h-3 text-[#faff69]" />;
    return <ChevronsUpDown className="w-3 h-3 text-white/20" />;
  };

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-[#2a2a2a]",
        className
      )}
    >
      <table className="w-full border-collapse text-xs">
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          <tr className="border-b border-[#2a2a2a] bg-[#111111]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  "px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/40 text-left",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.sortable &&
                    "cursor-pointer select-none hover:text-white/70 transition-colors"
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  sortKey === col.key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && <SortIcon colKey={col.key} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <tr key={i} className="border-b border-[#1e1e1e]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <Skeleton
                      height={12}
                      width={col.align === "right" ? "60px" : "80%"}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  size="sm"
                />
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <motion.tr
                key={rowKey ? rowKey(row) : i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-[#1e1e1e] bg-[#1a1a1a] transition-colors",
                  onRowClick && "cursor-pointer hover:bg-[#222222]",
                  i === sortedData.length - 1 && "border-b-0"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-white/70",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
