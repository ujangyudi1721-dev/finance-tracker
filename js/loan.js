import { getLoans, getInstallments } from "./services/loanService.js";
import { formatCurrency } from "./utils/formatCurrency.js";

document.addEventListener("DOMContentLoaded", async () => {
      console.log("LOAN PAGE LOADED");

      await loadLoans();
});

async function loadLoans() {
      const loans = await getLoans();

      console.log("LOANS DATA:", loans);

      renderLoans(loans);
}

import { getLoans, getInstallments } from "./services/loanService.js";
import { formatCurrency } from "./utils/formatCurrency.js";

document.addEventListener("DOMContentLoaded", async () => {
      console.log("LOAN PAGE LOADED");

      await loadLoans();
});

async function loadLoans() {
      const loans = await getLoans();

      console.log("LOANS DATA:", loans);

      renderLoans(loans);
}

function renderLoans(loans) {
      const table = document.getElementById("loanTable");

      table.innerHTML = "";

      loans.forEach((loan) => {
            console.log("RENDER LOAN:", loan);

            const row = document.createElement("tr");

            row.innerHTML = `
      <td>${loan.nama_loan}</td>
      <td>${formatCurrency(loan.total_pinjaman)}</td>
      <td>${loan.tenor}</td>
      <td>${formatCurrency(loan.cicilan_perbulan)}</td>
    `;

            row.addEventListener("click", () => {
                  console.log("LOAN CLICKED:", loan.id);

                  loadInstallments(loan.id);
            });

            table.appendChild(row);
      });
}

function renderInstallments(data) {
      const table = document.getElementById("installmentTable");

      table.innerHTML = "";

      data.forEach((item) => {
            console.log("RENDER INSTALLMENT:", item);

            const row = document.createElement("tr");

            row.innerHTML = `
      <td>${item.cicilan_ke}</td>
      <td>${formatCurrency(item.jumlah)}</td>
      <td>${item.status}</td>
    `;

            table.appendChild(row);
      });
}
