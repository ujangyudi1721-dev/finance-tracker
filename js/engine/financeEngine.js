// --- import dari account config ---
import { ACCOUNT_CONFIG } from "../config/accountConfig.js";

// --- export fungsi proses transaksi ---
export function processTransactions(data) {
      console.log("ENGINE DATA: ", data);

      const accounts = {};

      Object.keys(ACCOUNT_CONFIG).forEach((acc) => {
            accounts[acc] = 0;
      });

      let totalIncome = 0;
      let totalExpense = 0;

      data.forEach((tx) => {
            const tipe = tx.tipe?.toLowerCase();
            const akun = tx.akun?.toLowerCase();
            const jumlah = Number(tx.jumlah) || 0;

            console.log("PROCES TX: ", tipe, akun, jumlah);

            if (tipe === "income") {
                  totalIncome += jumlah;

                  if (accounts[akun] !== undefined) accounts[akun] += jumlah;
            }

            if (tipe === "expense") {
                  totalExpense += jumlah;

                  if (accounts[akun] !== undefined) accounts[akun] -= jumlah;
            }

            if (tipe === "transfer") {
                  if (accounts[akun] !== undefined) accounts[akun] += jumlah;
            }
      });

      const totalSaldo = totalIncome - totalExpense;

      console.log("TOTAL INCOME: ", totalIncome);
      console.log("TOTAL EXPENSE: ", totalExpense);
      console.log("SALDO: ", totalSaldo);
      console.log("ACCOUNTS: ", accounts);

      return {
            totalIncome,
            totalExpense,
            totalSaldo,
            accounts,
      };
}
