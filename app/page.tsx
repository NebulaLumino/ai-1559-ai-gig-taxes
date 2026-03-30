"use client";
import { useState } from "react";

const ACCENT = "hsl(225, 70%, 55%)";

export default function GigTaxesPage() {
  const [minIncome, setMinIncome] = useState("");
  const [maxIncome, setMaxIncome] = useState("");
  const [gigType, setGigType] = useState("Rideshare (Uber/Lyft)");
  const [quarterlyEstimates, setQuarterlyEstimates] = useState("No");
  const [vehicleExpense, setVehicleExpense] = useState("");
  const [homeOffice, setHomeOffice] = useState("");
  const [healthInsurance, setHealthInsurance] = useState("");
  const [retirementContributions, setRetirementContributions] = useState("");
  const [state, setState] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minIncome, maxIncome, gigType, quarterlyEstimates, vehicleExpense, homeOffice, healthInsurance, retirementContributions, state }),
      });
      const data = await res.json();
      setOutput(data.output || "No output generated.");
    } catch {
      setOutput("Error generating tax strategy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: ACCENT }}>AI Gig Economy Tax Estimator</h1>
          <p className="text-gray-400">Estimate quarterly taxes and generate income smoothing and expense deduction strategies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-200">Your Gig Income Profile</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Min Annual Income ($)</label>
                <input type="number" value={minIncome} onChange={(e) => setMinIncome(e.target.value)} placeholder="25000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Max Annual Income ($)</label>
                <input type="number" value={maxIncome} onChange={(e) => setMaxIncome(e.target.value)} placeholder="75000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Gig Type</label>
              <select value={gigType} onChange={(e) => setGigType(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                {["Rideshare (Uber/Lyft)", "Delivery (DoorDash/Instacart)", "Freelance (Upwork/Fiverr)", "Short-term rentals", "E-commerce (Amazon/Etsy)", "Consulting/Coaching", "Multiple gig types"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Making Quarterly Estimates?</label>
              <select value={quarterlyEstimates} onChange={(e) => setQuarterlyEstimates(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                {["No — want to learn how", "Yes — already doing them", "Want to optimize existing"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Deductible Expenses</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Vehicle Expenses ($/yr)</label>
                  <input type="number" value={vehicleExpense} onChange={(e) => setVehicleExpense(e.target.value)} placeholder="6000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Home Office ($/yr)</label>
                  <input type="number" value={homeOffice} onChange={(e) => setHomeOffice(e.target.value)} placeholder="2400" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Health Insurance ($/yr)</label>
                  <input type="number" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} placeholder="6000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Retirement Contributions ($)</label>
                  <input type="number" value={retirementContributions} onChange={(e) => setRetirementContributions(e.target.value)} placeholder="0" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">State</label>
              <input value={state} onChange={(e) => setState(e.target.value)} placeholder="California" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
              {loading ? "Calculating..." : "Estimate My Taxes & Strategy"}
            </button>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Your Gig Tax Strategy</h2>
            {output ? (
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap overflow-auto max-h-[600px]">
                {output}
              </div>
            ) : (
              <div className="text-gray-500 text-sm space-y-3">
                <p>Your tax estimation and strategy will include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Estimated annual tax liability (federal + self-employment)</li>
                  <li>Quarterly payment schedule with due dates</li>
                  <li>Standard mileage vs. actual expense comparison</li>
                  <li>Home office deduction analysis</li>
                  <li>Self-employment tax optimization</li>
                  <li>Retirement contribution strategies (SEP-IRA, Solo 401k)</li>
                  <li>Income smoothing tactics to reduce tax brackets</li>
                  <li>State-specific gig economy tax rules</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
