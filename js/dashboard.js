import { renderTransactionList } from "./ui.js";
import { getTransactions } from "./services/transactionService.js";

import { calculateBalances } from "./utils/calculateBalances.js";
import { renderSummary } from "./dashboard/renderSummary.js";
import { renderChart } from "./dashboard/renderChart.js";

document.addEventListener("DOMContentLoaded", async () => {
      console.log("Dashboard loaded");
      await loadData();
});

async function loadData() {
      const data = await getTransactions(10);
      const result = calculateBalances(data);
      renderTransactionList(data);
      renderSummary(result);
      renderChart(result);
}
