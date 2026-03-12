import { createLoan } from "../services/loanService.js";

const form = document.getElementById("loanForm");

if (form) {
      form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const loan = {
                  nama: document.getElementById("nama").value,
                  total_loan: Number(document.getElementById("total").value),
                  tenor: Number(document.getElementById("tenor").value),
            };

            await createLoan(loan);

            alert("Loan berhasil dibuat");

            location.href = "loan.html";
      });
}
