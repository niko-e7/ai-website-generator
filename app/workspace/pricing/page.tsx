import React from "react";
import { PricingTable } from "@clerk/nextjs";

function Pricing() {
  return (
    <div className="flex justify-center items-center w-full min-h-[80vh]">
      <div className="w-full max-w-2xl text-center">
        <h2 className="font-bold text-3xl mb-6">Pricing</h2>

        <PricingTable />
      </div>
    </div>
  );
}

export default Pricing;