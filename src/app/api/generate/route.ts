import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: process.env.OPENAI_API_KEY });
    const { platforms, annualIncome, businessExpenses, quarterlyEstimate, vehicleMiles, homeOffice, notes } = await req.json();

    const income = Number(annualIncome) || 0;
    const miles = Number(vehicleMiles) || 0;
    const mileageDeduction = miles * 0.67;
    const seTaxBase = income * 0.9235;
    const seTax = seTaxBase * 0.153;
    const incomeTaxRate = 0.22;
    const incomeTax = seTaxBase * incomeTaxRate;
    const totalTax = seTax + incomeTax;
    const netIncome = income - totalTax - (Number(businessExpenses) || 0);
    const quarterlyPayment = totalTax / 4;

    const prompt = `You are an expert self-employment tax specialist. Generate a comprehensive gig economy tax planning report.

**Gig Profile:**
Platforms: ${Array.isArray(platforms) ? platforms.join(", ") : platforms || "Not specified"}
${annualIncome ? `Annual Gig Income: $${Number(annualIncome).toLocaleString()}` : "Annual Income: Not specified"}
${businessExpenses ? `Business Expenses:\n${businessExpenses}` : ""}
${vehicleMiles ? `Vehicle Miles: ${vehicleMiles.toLocaleString()} miles (IRS rate: $0.67/mile for 2025)` : ""}
Home Office: ${homeOffice || "No"}
${quarterlyEstimate ? `Estimate Preference: ${quarterlyEstimate}` : "Quarterly estimates"}
${notes ? `Notes: ${notes}` : ""}

**Calculated Estimates:**
Gross Income: $${income.toLocaleString()}
Mileage Deduction (estimated): $${mileageDeduction.toLocaleString(undefined, {maximumFractionDigits: 0})}
Self-Employment Tax Base: $${seTaxBase.toLocaleString(undefined, {maximumFractionDigits: 0})}
Self-Employment Tax (15.3%): $${seTax.toLocaleString(undefined, {maximumFractionDigits: 0})}
Estimated Income Tax: $${incomeTax.toLocaleString(undefined, {maximumFractionDigits: 0})}
Total Estimated Tax: $${totalTax.toLocaleString(undefined, {maximumFractionDigits: 0})}
Net Income (after tax): $${netIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}
Quarterly Payment: $${quarterlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}

Generate a comprehensive gig tax planning report in markdown:

## Gig Economy Tax Planning Report

### 1. Income & Tax Summary
- Total annual gig income
- Self-employment tax breakdown
- Income tax estimate
- Total tax burden
- Effective tax rate

### 2. Self-Employment Tax Analysis
- SE tax components (Social Security + Medicare)
- 9235 factor calculation (92.35% of net earnings)
- Quarter coverage for Social Security credits
- FSA / HSA as SE tax reduction strategy

### 3. Deductible Business Expenses
${businessExpenses ? "- Expense categories identified\n- Equipment write-offs\n- Supplies and materials" : "- Record keeping recommended for all gig expenses"}
- Phone, internet, app fees
- Equipment depreciation

### 4. Vehicle Expense Deduction
- ${vehicleMiles ? `${vehicleMiles} miles at $0.67/mile = $${mileageDeduction.toLocaleString()} deduction` : "No vehicle deduction calculated"}
- Standard mileage vs. actual expense method
- Log requirements for mileage deduction
- Business vs. personal use split

### 5. Home Office Deduction
${homeOffice !== "No" ? `- ${homeOffice} home office: eligible for deduction\n- Simplified vs. regular method` : "- Not claiming home office deduction"}
- Dedicated space requirement
- Storage use deduction

### 6. Quarterly Estimated Tax Schedule
${quarterlyEstimate ? `- ${quarterlyEstimate} payment schedule` : "- Quarterly payments required"}
Due Dates:
- Q1 (Jan-Mar): April 15
- Q2 (Apr-May): June 15
- Q3 (Jun-Aug): September 15
- Q4 (Sep-Dec): January 15 (next year)
${quarterlyPayment > 0 ? `Each quarterly payment: $${quarterlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}` : ""}
Avoid underpayment penalties (Form 2210)

### 7. Platform-Specific Considerations
- ${Array.isArray(platforms) ? platforms.map((p: string) => `- ${p}: Tax reporting nuances`).join("\n") : ""}
- Form 1099-NEC vs. 1099-K thresholds
- Tips and gratuities reporting
- Platform-specific deductions

### 8. Tax Reduction Strategies
- Maximize legitimate deductions
- Retirement plan contributions (SEP-IRA, Solo 401k)
- HSA contributions
- Qualified Business Income (QBI) deduction
- Home office optimization

### 9. Record Keeping System
- What receipts to keep
- Digital vs. physical records
- Mileage log template
- Quarterly review process

### 10. Action Items
- Quarterly payment schedule setup
- Bank account for business expenses
- Receipt capture system
- Tax professional consultation checklist

Format as clean markdown with bullet points and tables. Include specific dollar amounts.`;

    const completion = await openai.chat.completions.create({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 3000 });
    return NextResponse.json({ output: completion.choices[0].message.content });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
