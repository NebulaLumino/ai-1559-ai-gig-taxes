import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { minIncome, maxIncome, gigType, quarterlyEstimates, vehicleExpense, homeOffice, healthInsurance, retirementContributions, state } = await req.json();

    const prompt = `You are an expert CPA specializing in gig economy and self-employment taxes. Generate a comprehensive tax estimation and optimization strategy in markdown based on the following profile:

- Min Annual Income: ${minIncome ? "$" + Number(minIncome).toLocaleString() : "N/A"}
- Max Annual Income: ${maxIncome ? "$" + Number(maxIncome).toLocaleString() : "N/A"}
- Gig Type: ${gigType || "N/A"}
- Quarterly Estimates Status: ${quarterlyEstimates || "N/A"}
- Annual Vehicle Expenses: ${vehicleExpense ? "$" + Number(vehicleExpense).toLocaleString() : "N/A"}
- Annual Home Office Expenses: ${homeOffice ? "$" + Number(homeOffice).toLocaleString() : "N/A"}
- Annual Health Insurance: ${healthInsurance ? "$" + Number(healthInsurance).toLocaleString() : "N/A"}
- Retirement Contributions: ${retirementContributions ? "$" + Number(retirementContributions).toLocaleString() : "N/A"}
- State: ${state || "N/A"}

Assume the average of min and max income for estimation purposes.

Generate a comprehensive tax strategy including:
1. **Estimated Annual Tax Liability Table** — Break down:
   - Federal income tax (marginal brackets, 2026 rates)
   - Self-employment tax (15.3% on 92.35% of net earnings)
   - State income tax (note general rates for the state if provided)
   - Total estimated tax burden
   - Effective tax rate percentage
2. **Quarterly Payment Schedule** — Estimated quarterly payments with IRS due dates (April 15, June 15, Sept 15, Jan 15) so the user can set aside the right amount each quarter
3. **Standard Mileage vs. Actual Expense Comparison** — Calculate which is better for their gig type (2026 IRS mileage rate is ~70 cents/mile). Show the deduction value difference
4. **Home Office Deduction Analysis** — Simplified (5 sq ft x $5/sq ft) vs. regular method. Recommend the better option
5. **Self-Employment Tax Optimization** — Explain the qualified business income (QBI) deduction (20% of net earnings) and its eligibility
6. **Retirement Contribution Strategy** — SEP-IRA vs. Solo 401(k) vs. SIMPLE IRA comparison, including contribution limits and tax benefits for gig workers
7. **Income Smoothing Strategy** — How to manage irregular income by setting aside a percentage of each payment into a separate tax reserve account
8. **Deduction Checklist** — Comprehensive list of deductible gig economy expenses specific to their gig type
9. **State-Specific Rules** — Note any state-specific gig economy rules for ${state || "their state"} (e.g., CA PAGA, NY freelance protection act)

Format as clean markdown with tables, bold numbers, and clear sections. Include specific dollar amounts.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const output = completion.choices[0].message.content;
    return NextResponse.json({ output });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
