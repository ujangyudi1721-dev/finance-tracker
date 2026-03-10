import { formatCurrency } from "../utils/formatCurrency.js";
export function renderSummary(result) {
      document.getElementById("totalIncome").innerText = formatCurrency(
            result.totalIncome,
      );

      document.getElementById("totalExpense").innerText = formatCurrency(
            result.totalExpense,
      );

      document.getElementById("totalSaldo").innerText = formatCurrency(
            result.totalSaldo,
      );

      Object.keys(result.accounts).forEach((akun) => {
            const elementId =
                  "total" + akun.charAt(0).toUpperCase() + akun.slice(1);

            console.log("UPDATE:", elementId, result.accounts[akun]);

            const el = document.getElementById(elementId);

            if (el) {
                  el.innerText =
                        "Rp " + result.accounts[akun].toLocaleString("id-ID");
            }
      });
      console.log("RESULT:", result);
}

