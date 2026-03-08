import { renderTransactionList } from "./ui.js";
import { getTransactions } from "./services/transactionService.js";

document.addEventListener("DOMContentLoaded", async () => {
      console.log("Dashboard loaded");
      await loadData();
});

async function loadData() {
      const data = await getTransactions(10);

      renderTransactionList(data);
      renderSummary(data);
      renderChart(data);
}

function renderSummary(data) {
      let totalIncome = 0;
      let totalExpense = 0;
      let totalCash = 0;
      let totalCimb = 0;

      data.forEach((item) => {
            const tipe = item.tipe?.trim().toLowerCase();
            const jumlah = Number(item.jumlah) || 0;

            if (tipe === "income") totalIncome += jumlah;
            if (tipe === "expense") totalExpense += jumlah;

            if (item.akun === "cash") {
                  if (tipe === "income") totalCash += jumlah;
                  if (tipe === "expense") totalCash -= jumlah;
            }

            if (item.akun === "cimb") {
                  if (tipe === "income") totalCimb += jumlah;
                  if (tipe === "expense") totalCimb -= jumlah;
            }
      });

      const saldo = totalIncome - totalExpense;

      document.getElementById("totalIncome").innerText =
            "Rp " + totalIncome.toLocaleString("id-ID");

      document.getElementById("totalExpense").innerText =
            "Rp " + totalExpense.toLocaleString("id-ID");

      document.getElementById("totalSaldo").innerText =
            "Rp " + saldo.toLocaleString("id-ID");

      document.getElementById("totalCash").innerText =
            "Rp " + totalCash.toLocaleString("id-ID");

      document.getElementById("totalCimb").innerText =
            "Rp " + totalCimb.toLocaleString("id-ID");
}

function renderChart(data) {
      let income = 0;
      let expense = 0;

      data.forEach((item) => {
            const jumlah = Number(item.jumlah) || 0;

            if (item.tipe === "income") income += jumlah;
            if (item.tipe === "expense") expense += jumlah;
      });

      const ctx = document.getElementById("financeChart");

      if (window.financeChart instanceof Chart) {
            window.financeChart.destroy();
      }

      window.financeChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                  labels: ["Income", "Expense"],
                  datasets: [
                        {
                              data: [income, expense],
                        },
                  ],
            },
      });
}
