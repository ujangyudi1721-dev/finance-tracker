let editId = null;
document.addEventListener("DOMContentLoaded", async () => {
      console.log("Dashboard loaded");
      // -------- variable untuk transaction list ----------------
      const listEl = document.getElementById("transactionList");

      //---------variable untuk total income dan expense----------
      const incomeEl = document.getElementById("totalIncome");
      const expenseEl = document.getElementById("totalExpense");

      console.log(incomeEl, expenseEl, listEl);
      async function loadData() {
            const { data, error } = await supabaseClient
                  .from("transactions")
                  .select("*")
                  .order("id", { ascending: false })
                  .limit(10);

            console.log("Data dari supabase:", data);
            const groupedTransfer = {};
            const finalTransaction = [];

            data.forEach((item) => {
                  if (item.tipe === "transfer") {
                        if (!groupedTransfer[item.transfer_group]) {
                              groupedTransfer[item.transfer_group] = {};
                        }

                        if (item.transfer_type === "out") {
                              groupedTransfer[item.transfer_group].from = item;
                        }

                        if (item.transfer_type === "in") {
                              groupedTransfer[item.transfer_group].to = item;
                        }
                  } else {
                        finalTransaction.push(item);
                  }
            });

            Object.values(groupedTransfer).forEach((t) => {
                  if (t.from && t.to) {
                        finalTransaction.push({
                              tipe: "transfer",
                              tanggal: t.from.tanggal,
                              jumlah: t.from.jumlah,
                              akun_dari: t.from.akun,
                              akun_ke: t.to.akun,
                              keterangan: `Transfer ${t.from.akun} → ${t.to.akun}`,
                        });
                  }
            });
            let totalIncome = 0;
            let totalExpense = 0;
            let totalCash = 0;
            let totalCimb = 0;

            if (error) {
                  console.error(error);
                  return;
            }

            //--------- Urutkan terbaru di atas (berdasarkan id atau created_at)
            data.sort((a, b) => b.id - a.id);

            //------ fungsi perhitungan -------
            data.forEach((item) => {
                  console.log("TYPE DARI DB: ", item.tipe);
                  const tipe = item.tipe?.trim().toLowerCase();
                  const jumlah = Number(item.jumlah) || 0;

                  // --- hitung total ---
                  if (tipe === "income") {
                        totalIncome += jumlah;
                  } else if (tipe === "expense") {
                        totalExpense += jumlah;
                  }

                  if (item.akun === "cash") {
                        if (tipe === "income") totalCash += jumlah;
                        if (tipe === "expense") totalCash -= jumlah;
                        if (tipe === "transfer") {
                              if (item.transfer_type === "out")
                                    totalCash -= jumlah;
                              if (item.transfer_type === "in")
                                    totalCash += jumlah;
                        }
                  }
                  if (item.akun === "cimb") {
                        if (tipe === "income") totalCimb += jumlah;
                        if (tipe === "expense") totalCimb -= jumlah;
                        if (tipe === "transfer") {
                              if (item.transfer_type === "out")
                                    totalCimb -= jumlah;
                              if (item.transfer_type === "in")
                                    totalCimb += jumlah;
                        }
                  }
            });
            //--- Elemen list ---
            listEl.innerHTML = "";
            finalTransaction.slice(0, 10).forEach((item) => {
                  const li = document.createElement("li");
                  const akun = item.akun?.toLowerCase();
                  const tipe = item;

                  li.classList.add("transaction-item");
                  if (tipe === "income") {
                        li.classList.add("income");
                  }
                  if (tipe === "expense") {
                        li.classList.add("expense");
                  }
                  if (tipe === "transfer") {
                        li.classList.add("transfer");
                  }

                  const jumlah = Number(item.jumlah) || 0;
                  if (item.tipe === "transfer") {
                        li.innerHTML = `
                              <div class="transaction-left">

                                    <div class="transaction-title">
                                          🔁 ${item.akun_dari} → ${item.akun_ke}
                                    </div>

                                    <div class="transaction-date">
                                    ${new Date(item.tanggal).toLocaleDateString("id-ID")}
                                    </div>

                              </div>

<div class="transaction-right">

<div class="transaction-amount">
Rp ${Number(item.jumlah).toLocaleString("id-ID")}
</div>
<div class="transaction-actions">
                                          <button onclick="editData(${item.id})">Edit</button>
                                          <button onclick="deleteData(${item.id})">Delete</button>
                                    </div>
</div>
                              `;
                  } else {
                        li.innerHTML = `
                              <div class="transaction-left">
                                    <div class="transaction-date">
                                          ${new Date(item.tanggal).toLocaleDateString("id-ID")}
                                    </div>
                                    <div class="transaction-title">
                                          ${item.tipe === "income" ? "➕" : ""}
                                          ${item.tipe === "expense" ? "➖" : ""}
                                    </div>
                                    <div class="transaction-acount">
                                          ${item.akun}
                                    </div>
                              </div>
                              
                              <div class="transaction-right">
                                    <div class="transaction-amount">
                                          Rp ${jumlah.toLocaleString("id-ID")}
                                    </div>
                                    <div class="transaction-actions">
                                          <button onclick="editData(${item.id})">Edit</button>
                                          <button onclick="deleteData(${item.id})">Delete</button>
                                    </div>
                              </div>
                        `;
                  }
                  listEl.appendChild(li);
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

            // --- fungsi grafik ---
            const ctx = document.getElementById("financeChart");

            new Chart(ctx, {
                  type: "bar",
                  data: {
                        labels: ["Income", "Expense", "Cash", "Cimb"],
                        datasets: [
                              {
                                    label: "Total (Rp)",
                                    data: [
                                          totalIncome,
                                          totalExpense,
                                          totalCash,
                                          totalCimb,
                                    ],
                                    backgroundColor: [
                                          "#16a34a",
                                          "red",
                                          "gold",
                                          "darkred",
                                    ],
                              },
                        ],
                  },
                  options: {
                        responsive: true,
                        maintainAspectRatio: false, // --- Wajib kalau pakai height CSS
                        plugins: {
                              legend: { display: false },
                        },
                        scales: {
                              y: { beginAtZero: true },
                        },
                  },
            });
      }
      loadData();
});
async function deleteData(id) {
      const confirmDelete = confirm("Yakin mau hapus transaksi ini?");
      if (!confirmDelete) return;

      const { error } = await supabaseClient
            .from("transactions")
            .delete()
            .eq("id", id);

      if (error) {
            alert("Gagal menghapus");
            console.error(error);
            return;
      }

      location.reload();
}

function editData(id) {
      window.location.href = `input.html?id=${id}`;
}

window.editData = editData;
window.deleteData = deleteData;
