import { getTransactions } from "../services/transactionService.js";
import { processTransactions } from "../engine/financeEngine.js";
import { renderSummary } from "../dashboard/renderSummary.js";
import { renderChart } from "../dashboard/renderChart.js";
import { getLoans } from "../services/loanService.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
      console.log("Dashboard Loaded");

      const data = await getTransactions();

      const finance = processTransactions(data);

      const loans = await getLoans();


      console.log("FINANCE RESULT: ", finance);

      renderSummary(finance);
      renderChart(finance);
}
