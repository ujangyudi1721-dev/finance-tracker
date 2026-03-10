import { formatCurrency } from "../utils/formatCurrency.js";
export function renderSummary(data) {
      document.getElementById("totalIncome").textContent = formatCurrency(
            data.totalIncome,
      );

      document.getElementById("totalExpense").textContent = formatCurrency(
            data.totalExpense,
      );

      document.getElementById("totalSaldo").textContent = formatCurrency(
            data.totalSaldo,
      );

      document.getElementById("totalCash").textContent = formatCurrency(
            data.totalCash,
      );

      document.getElementById("totalCimb").textContent = formatCurrency(
            data.totalCimb,
      );

      document.getElementById("totalSea").textContent = formatCurrency(
            data.totalSea,
      );

      document.getElementById("totalNeo").textContent = formatCurrency(
            data.totalNeo,
      );

      document.getElementById("totalBri").textContent = formatCurrency(
            data.totalBri,
      );

      Object.keys(data.accounts).forEach((akun) => {
            const elementId =
                  "total" + akun.charAt(0).toUpperCase() + akun.slice(1);

            console.log("UPDATE:", elementId, data.accounts[akun]);

            const el = document.getElementById(elementId);

            if (el) {
                  el.innerText =
                        "Rp " + data.accounts[akun].toLocaleString("id-ID");
            }
      });
      console.log("RESULT:", data);
}
