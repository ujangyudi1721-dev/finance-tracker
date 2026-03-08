import {
      getTransactions,
      deleteTransaction,
} from "./services/transactionService.js";
import { renderHistoryTable } from "./ui.js";

let allTransactions = [];

//console.log(allTransactions)

document.addEventListener("DOMContentLoaded", async () => {
      await loadHistory();
});

// --- fungsi untuk meload semua yang terdapat di riwayat transaksi ---
async function loadHistory() {
      const data = await getTransactions();

      console.log("DATA", data); // cek isi data
      allTransactions = data;
      renderHistoryTable(data);
      renderStats(data);
}

// ---  fungsi delete ---
async function deleteData(id) {
      const confirmDelete = confirm("Yakin mau hapus transaksi?");

      if (!confirmDelete) return;

      const success = await deleteTransaction(id);

      if (success) {
            loadHistory();
      }
}

// --- fungsi edit ---
function editData(id) {
      window.location.href = `input.html?id=${id}`;
}

// --- fungsi filter ---
function applyFilter() {
      const searchValue = document
            .getElementById("searchInput")
            .value.toLowerCase();

      const typeValue = document
            .getElementById("filterType")
            .value.toLowerCase();

      const dateValue = document.getElementById("filterDate").value;

      const today = new Date();

      const filtered = allTransactions.filter((item) => {
            const tipe = (item.tipe || "").toLowerCase();
            const ket = (item.keterangan || "").toLowerCase();

            const matchSearch = ket.includes(searchValue);

            const matchType = typeValue === "all" || tipe === typeValue;

            // --- filter tanggal ---
            let matchDate = true;

            if (dateValue !== "all") {
                  const itemDate = new Date(item.tanggal);

                  if (dateValue === "today") {
                        matchDate =
                              itemDate.toDateString() === today.toDateString();
                  }

                  if (dateValue === "7days") {
                        const last7 = new Date();
                        last7.setDate(today.getDate() - 7);

                        matchDate = itemDate >= last7;
                  }

                  if (dateValue === "month") {
                        matchDate = 
                              itemDate.getMonth() === today.getMonth() &&
                              itemDate.getFullYear() === today.getFullYear()
                  }
            }
            return matchSearch && matchType && matchDate;
      });
      console.log("FILTER RESULT:", filtered);
      renderHistoryTable(filtered);
      renderStats(filtered);
}

document.addEventListener("DOMContentLoaded", async () => {
      await loadHistory();

      document
            .getElementById("searchInput")
            .addEventListener("input", applyFilter);
      document
            .getElementById("filterType")
            .addEventListener("change", applyFilter);

      document
            .getElementById("filterDate")
            .addEventListener("change", applyFilter)
});

// --- fungsi hitung statistika ---
function renderStats(data) {
      let income = 0;
      let expense = 0;

      data.forEach((item) => {
            const jumlah = Number(item.jumlah) || 0;

            if (item.tipe === "income") {
                  income += jumlah;
            }

            if (item.tipe === "expense") {
                  expense += jumlah;
            }
      });
      const balance = income - expense;

      document.getElementById("statIncome").innerText =
            "Rp " + income.toLocaleString("id-ID");

      document.getElementById("statExpense").innerText =
            "Rp " + expense.toLocaleString("id-ID");

      document.getElementById("statBalance").innerText =
            "Rp " + balance.toLocaleString("id-ID");
}
window.deleteData = deleteData;
window.editData = editData;
