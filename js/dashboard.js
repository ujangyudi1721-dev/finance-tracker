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
      let totalSea = 0;
      let totalNeo = 0;

      data.forEach((item) => {
            const tipe = item.tipe?.trim().toLowerCase();
            const jumlah = Number(item.jumlah) || 0;

            if (tipe === "income") totalIncome += jumlah;
            if (tipe === "expense") totalExpense += jumlah;
            if (tipe === "transfer") {
                  if (item.transfer_type === "out") totalCash -= jumlah;
                  if (item.transfer_type === "in") totalCash += jumlah;
            }

            if (item.akun === "cash") {
                  if (tipe === "income") totalCash += jumlah;
                  if (tipe === "expense") totalCash -= jumlah;
                  if (tipe === "transfer") {
                        if (item.transfer_type === "out") totalCash -= jumlah;
                        if (item.transfer_type === "in") totalCash += jumlah;
                  }
            }

            if (item.akun === "cimb") {
                  if (tipe === "income") totalCimb += jumlah;
                  if (tipe === "expense") totalCimb -= jumlah;
                  if (tipe === "transfer") {
                        if (item.transfer_type === "out") totalCimb -= jumlah;
                        if (item.transfer_type === "in") totalCimb += jumlah;
                  }
            }

            if (item.akun === "sea") {
                  if (tipe === "income") totalSea += jumlah;
                  if (tipe === "expense") totalSea -= jumlah;
                  if (tipe === "transfer") {
                        if (item.transfer_type === "out") totalSea -= jumlah;
                        if (item.transfer_type === "in") totalSea += jumlah;
                  }
            }

            if (item.akun === "neo") {
                  if (tipe === "income") totalNeo += jumlah;
                  if (tipe === "expense") totalNeo -= jumlah;
                  if (tipe === "transfer") {
                        if (item.transfer_type === "out") totalNeo -= jumlah;
                        if (item.transfer_type === "in") totalNeo += jumlah;
                  }
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

      document.getElementById("totalSea").innerText =
            "Rp " + totalSea.toLocaleString("id-ID");

      document.getElementById("totalNeo").innerText =
            "Rp " + totalNeo.toLocaleString("id-ID");
}

function renderChart(data) {
      let income = 0;
      let expense = 0;
      let totalCash = 0;
      let totalCimb = 0;
      let totalSea = 0;
      let totalNeo = 0;

      data.forEach((item) => {
            const jumlah = Number(item.jumlah) || 0;

            if (item.akun === "cash") totalCash += jumlah;
            if (item.akun === "cimb") totalCimb += jumlah;
            if (item.akun === "neo") totalNeo += jumlah;
            if (item.akun === "sea") totalSea += jumlah;
      });

      const ctx = document.getElementById("financeChart");

      if (window.financeChart instanceof Chart) {
            window.financeChart.destroy();
      }

      financeChart = new Chart(ctx, {
            type: "bar",
            data: {
                  labels: ["Cash", "CIMB", "Neo Bank", "Sea Bank"],
                  datasets: [
                        {
                              labels: "total",
                              data: [totalCash, totalCimb, totalNeo, totalSea],
                        },
                  ],
            },
      });
}
