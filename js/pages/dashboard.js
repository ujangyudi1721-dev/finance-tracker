import { getTransactions } from "../services/transactionService.js";
import { processTransactions } from "../engine/financeEngine.js";
import { renderSummary } from "../dashboard/renderSummary.js";
import { renderChart } from "../dashboard/renderChart.js"

document.addEventListener("DOMContentLoaded", init);

async function init() {
      console.log("Dashboard Loaded");

      const data = await getTransactions();

      const finance = processTransactions(data);

      console.log("FINANCE RESULT: ", finance)

      renderSummary(finance);
      renderChart(finance);
}