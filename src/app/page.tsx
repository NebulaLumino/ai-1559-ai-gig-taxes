"use client";
import { useState } from "react";

const PLATFORMS = ["Uber / Lyft", "DoorDash / Instacart", "Fiverr / Upwork", "Etsy", "Amazon FBA", "Airbnb / VRBO", "YouTube / TikTok", "Tutor/Teach", "Other"];

export default function GigTaxesPage() {
  const [platforms, setPlatforms] = useState<string[]>(["Uber / Lyft"]);
  const [annualIncome, setAnnualIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [quarterlyEstimate, setQuarterlyEstimate] = useState("Quarterly");
  const [businessExpenses, setBusinessExpenses] = useState("");
  const [vehicleMiles, setVehicleMiles] = useState("");
  const [homeOffice, setHomeOffice] = useState("No");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms, annualIncome, expenses, quarterlyEstimate, businessExpenses, vehicleMiles, homeOffice, notes }),
      });
      const data = await res.json();
      setOutput(data.output || "No output generated.");
    } catch { setOutput("Error generating gig tax analysis."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "hsl(165deg, 70%, 45%)" }}>AI Gig Economy Tax Planner</h1>
          <p className="text-gray-400">Navigate self-employment taxes and quarterly estimates as a gig worker</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-3">Gig Income Profile</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Gig Platforms</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {PLATFORMS.map(p => (
                      <button key={p} onClick={() => togglePlatform(p)}
                        className={`text-xs px-3 py-1 rounded-full border transition ${platforms.includes(p) ? "border-teal-500 bg-teal-500/20 text-teal-300" : "border-gray-600 text-gray-400 hover:border-gray-500"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Annual Gig Income ($)</label>
                  <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="35000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Quarterly Estimate Preference</label>
                  <select value={quarterlyEstimate} onChange={(e) => setQuarterlyEstimate(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                    <option>Quarterly (Form 1040-ES)</option><option>Monthly</option>
                    <option>Safe Harbor (prior year)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Vehicle Miles Driven (/year)</label>
                  <input type="number" value={vehicleMiles} onChange={(e) => setVehicleMiles(e.target.value)} placeholder="12000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Home Office</label>
                  <select value={homeOffice} onChange={(e) => setHomeOffice(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm">
                    <option>No</option><option>Yes (dedicated room)</option><option>Yes (partial)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Business Expenses ($/year)</label>
                  <textarea value={businessExpenses} onChange={(e) => setBusinessExpenses(e.target.value)} rows={2} placeholder="Phone: $600&#10;Equipment: $800&#10;Supplies: $300&#10;Insurance: $400" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1 text-sm resize-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide">Additional Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Employee status, international work, multi-state income, health insurance..." className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none mt-1" />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition disabled:opacity-50" style={{ backgroundColor: "hsl(165deg, 70%, 45%)" }}>
              {loading ? "Calculating..." : "Generate Gig Tax Plan"}
            </button>
          </div>
          <div>
            {output ? (
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-200">Gig Tax Analysis</h2>
                  <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition">📋 Copy</button>
                </div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
              </div>
            ) : (
              <div className="bg-gray-800/40 border border-dashed border-gray-700 rounded-2xl p-12 flex items-center justify-center">
                <p className="text-gray-500 text-center">Your gig tax analysis will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
