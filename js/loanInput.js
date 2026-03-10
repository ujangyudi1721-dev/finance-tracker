import { createLoan, createInstallments } from "./services/loanService.js";
import { generateInstallments } from "./utils/generateInstallments.js";

document.addEventListener("DOMContentLoaded", () => {

  console.log("LOAN INPUT PAGE LOADED");

  const form = document.getElementById("loanForm");

  form.addEventListener("submit", handleSubmit);

});

async function handleSubmit(e) {

  e.preventDefault();

  const namaLoan = document.getElementById("namaLoan").value;
  const total = Number(document.getElementById("totalLoan").value);
  const tenor = Number(document.getElementById("tenor").value);

  console.log("INPUT LOAN:", namaLoan, total, tenor);

  const loan = await createLoan({
    nama_loan: namaLoan,
    total_pinjaman: total,
    tenor: tenor,
    cicilan_perbulan: total / tenor
  });

  if (!loan) return;

  const installments = generateInstallments(
    loan.id,
    total,
    tenor
  );

  await createInstallments(installments);

  console.log("LOAN CREATED SUCCESS");

  alert("Loan berhasil dibuat");

}