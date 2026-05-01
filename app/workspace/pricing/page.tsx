"use client";

import React, { useEffect } from "react";
import { PricingTable } from "@clerk/nextjs";

function Pricing() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="h-[calc(100vh-57px)] bg-[#080e1a] px-6 pt-12 pb-6 flex flex-col items-center overflow-hidden">
      <div className="text-center mb-8 max-w-xl">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 rounded-full mb-3">
          Simple pricing
        </span>
        <h1 className="text-3xl font-bold text-white mb-2">Choose your plan</h1>
        <p className="text-slate-400 text-sm">
          Start free, upgrade when you need unlimited generations.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <PricingTable
          appearance={{
            variables: {
              colorBackground: "#0f172a",
              colorInputBackground: "#1e293b",
              colorText: "#f1f5f9",
              colorTextSecondary: "#94a3b8",
              colorPrimary: "#6366f1",
              colorBorder: "#334155",
              borderRadius: "0.75rem",
            },
            elements: {
              pricingTableCard:
                "border border-slate-700/60 bg-slate-900/40 shadow-none",
              pricingTableCardHighlighted:
                "border border-indigo-500/60 bg-[#0f172a] shadow-[0_0_40px_-6px_rgba(99,102,241,0.3)]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Pricing;
