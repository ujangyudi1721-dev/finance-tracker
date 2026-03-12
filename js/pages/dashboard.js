import { getTransactions } from "../services/transactionService.js";
import { processTransactions } from "../engine/financeEngine.js";
import { renderSummary } from "../dashboard/renderSummary.js";
import { renderChart } from "../dashboard/renderChart.js";
import { getLoans } from "../services/loanService.js";
import { calculateLoanSummary } from "../engine/loanEngine.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
      console.log("Dashboard Loaded");

      const data = await getTransactions();

      const finance = processTransactions(data);

      const loans = await getLoans();

      const summary = calculateLoanSummary(loans);
      console.log(summary);

      console.log("FINANCE RESULT: ", finance);

      renderSummary(finance);
      renderChart(finance);

      document.getElementById("totalLoan").textContent = summary.totalLoan;

      document.getElementById("remainingLoan").textContent = summary.remaining;
}
