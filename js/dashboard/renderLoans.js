export function renderLoanTable(loans) {
      const table = document.getElementById("loanTable");

      table.innerHTML = "";

      loans.forEach((loan) => {
            const paid = loan.loan_installments.filter(
                  (i) => i.status === "paid",
            ).length;
            const paidAmount = paid * loan.cicilan_per_bulan;

            const remaining = loan.total_loan - paidAmount;
            const progress = Math.round((paid / loan.tenor) * 100);
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${loan.nama}</td>
        <td>${loan.total_loan}</td>
        <td>${loan.tenor}</td>
        <td>${loan.cicilan_per_bulan}</td>
        <td>
<div style="background:#eee;width:150px">
<div style="background:green;width:${progress}%">
${progress}%
</div>
</div>
</td>
        `;

            table.appendChild(row);
      });
}

export function renderInstallments(loans) {
      const table = document.getElementById("installmentTable");

      table.innerHTML = "";

      loans.forEach((loan) => {
            loan.loan_installments.forEach((inst, index) => {
                  const row = document.createElement("tr");

                  row.innerHTML = `
            <td>${index + 1}</td>
            <td>${inst.jumlah}</td>
            <td>${inst.status}</td>
            <td>
                  ${
                        inst.status === "unpaid"
                              ? `<button data-id="${inst.id}" class="payBtn">Bayar</button>`
                              : "✅"
                  }
            </td>
            `;

                  table.appendChild(row);
            });
      });
      addPayHandler();
}

import { payInstallment } from "../services/loanService.js";

function addPayHandler() {
      const buttons = document.querySelectorAll(".payBtn");

      buttons.forEach((btn) => {
            btn.addEventListener("click", async () => {
                  const id = btn.dataset.id;

                  await payInstallment({ id });

                  alert("Cicilan dibayar");

                  location.reload();
            });
      });
}
