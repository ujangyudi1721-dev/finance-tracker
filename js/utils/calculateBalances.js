import { ACCOUNT_CONFIG } from "../config/accountConfig.js";

export function calculateBalances(data) {
      let totalIncome = 0;
      let totalExpense = 0;

      console.log("DATA:", data);

      const accounts = Object.keys(ACCOUNT_CONFIG).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
      }, {});

      data.forEach((item) => {
            const tipe = item.tipe?.trim().toLowerCase();
            const akun = item.akun?.trim().toLowerCase();
            const jumlah = Number(item.jumlah) || 0;

            console.log("ACCOUNTS RESULT:", accounts);

            if (tipe === "income") totalIncome += jumlah;
            if (tipe === "expense") totalExpense += jumlah;

            if (accounts[akun] !== undefined) {
                  if (tipe === "income") accounts[akun] += jumlah;

                  if (tipe === "expense") accounts[akun] -= jumlah;

                  if (tipe === "transfer") {
                        if (item.transfer_type === "out")
                              accounts[akun] -= jumlah;

                        if (item.transfer_type === "in")
                              accounts[akun] += jumlah;
                  }
            }
      });
      console.log("TOTAL INCOME:", totalIncome);
      console.log("TOTAL EXPENSE:", totalExpense);
      return {
            totalIncome,
            totalExpense,
            totalSaldo: totalIncome - totalExpense,
            accounts,
      };
}
