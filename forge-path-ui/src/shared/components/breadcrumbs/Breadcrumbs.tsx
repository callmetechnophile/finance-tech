"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-[#cccccc] font-bold uppercase tracking-wider">
        <span>FORGE-PATH</span>
        <span>&gt;</span>
        <span className="text-[#888888]">CFO Command Workspace</span>
      </div>
    );
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-[10px] text-[#cccccc] font-bold uppercase tracking-wider">
      <Link href="/dashboard" className="hover:text-white transition-colors">
        FORGE-PATH
      </Link>
      {segments.map((segment, idx) => {
        const url = `/${segments.slice(0, idx + 1).join("/")}`;
        const isLast = idx === segments.length - 1;
        const displayName = segment.replace(/-/g, " ");

        return (
          <div key={url} className="flex items-center gap-1.5">
            <span>&gt;</span>
            {isLast ? (
              <span className="text-[#faff69] font-black">{displayName}</span>
            ) : (
              <Link href={url} className="hover:text-white transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
