import { renderTransactionList } from "./ui.js";
import { getTransactions } from "./services/transactionService.js";

const ACCOUNT_CONFIG = {
      cash: "Cash",
      cimb: "CIMB",
      neo: "Neo Bank",
      sea: "Sea Bank",
      bri: "Bank BRI",
};
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

function calculateBalances(data) {
      let totalIncome = 0;
      let totalExpense = 0;

      const accounts = Object.keys(ACCOUNT_CONFIG).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
      }, {});

      data.forEach((item) => {
            const tipe = item.tipe?.trim().toLowerCase();
            const jumlah = Number(item.jumlah) || 0;

            if (tipe === "income") totalIncome += jumlah;
            if (tipe === "expense") totalExpense += jumlah;

            if (accounts[item.akun] !== undefined) {
                  if (tipe === "income") accounts[item.akun] += jumlah;

                  if (tipe === "expense") accounts[item.akun] -= jumlah;

                  if (tipe === "transfer") {
                        if (item.transfer_type === "out")
                              accounts[item.akun] -= jumlah;
                        if (item.transfer_type === "in")
                              accounts[item.akun] += jumlah;
                  }
            }
      });
      return {
            totalIncome,
            totalExpense,
            saldo: totalIncome - totalExpense,
            accounts,
      };
}

// --- fungsi render summary --
function renderSummary(result) {
      document.getElementById("totalIncome").innerText =
            "Rp " + result.totalIncome.toLocaleString("id-ID");

      document.getElementById("totalExpense").innerText =
            "Rp " + result.totalExpense.toLocaleString("id-ID");

      document.getElementById("totalSaldo").innerText =
            "Rp " + result.saldo.toLocaleString("id-ID");

      Object.keys(result.accounts).forEach((akun) => {
            const elementId =
                  "total" + akun.charAt(0).toUpperCase() + akun.slice(1);

            document.getElementById(elementId).innerText =
                  "Rp " + result.accounts[akun].toLocaleString("id-ID");
      });
}

function renderChart(result) {
      const accounts = result.accounts;

      const labels = Object.values(ACCOUNT_CONFIG);
      const values = Object.keys(ACCOUNT_CONFIG).map((key) => accounts[key]);

      const ctx = document.getElementById("financeChart");

      if (window.financeChart instanceof Chart) {
            window.financeChart.destroy();
      }

      window.financeChart = new Chart(ctx, {
            type: "bar",
            data: {
                  labels: labels,
                  datasets: [
                        {
                              label: "Grafik Saldo Akun",
                              data: values,
                              backgroundColor: [
                                    "orchid",
                                    "#dc2626",
                                    "gold",
                                    "#ede738",
                                    "rgb(34, 88, 235)",
                              ],
                        },
                  ],
            },
      });
}
