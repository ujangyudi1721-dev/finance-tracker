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
            let totalIncome = 0;
            let totalExpense = 0;
            if (error) {
                  console.error(error);
                  return;
            }

            //--------- Urutkan terbaru di atas (berdasarkan id atau created_at)
            data.sort((a, b) => b.id - a.id);

            // ------- fungsi untuk menampilkan di span dashboard ----
            //let totalIncome = 0;
            //let totalExpense = 0;

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

                  //--- Elemen list ---
                  listEl.innerHTML = "";
                  data.slice(0, 10).forEach((item) => {
                        const li = document.createElement("li");

                        const tipe = item.tipe?.toLowerCase();
                        const jumlah = Number(item.jumlah) || 0;

                        li.classList.add("transaction-item");
                        li.classList.add(
                              tipe === "income" ? "income" : "expense",
                        );

                        li.innerHTML = `
                              <div class="transaction-left">
                                    <div class="transaction-title">
                                          ${item.keterangan || "Tanpa Keterangan"}
                                    </div>
                                    <div class="transaction-date">
                                          ${new Date(item.tanggal).toLocaleDateString("id-ID")}
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

                        listEl.appendChild(li);
                  });
            });

            const saldo = totalIncome - totalExpense;

            document.getElementById("totalIncome").innerText =
                  "Rp " + totalIncome.toLocaleString("id-ID");
            document.getElementById("totalExpense").innerText =
                  "Rp " + totalExpense.toLocaleString("id-ID");
            document.getElementById("totalSaldo").innerText =
                  "Rp " + saldo.toLocaleString("id-ID");

            // --- fungsi grafik ---
            const ctx = document.getElementById("financeChart");

            new Chart(ctx, {
                  type: "bar",
                  data: {
                        labels: ["Income", "Expense"],
                        datasets: [
                              {
                                    label: "Total (Rp)",
                                    data: [totalIncome, totalExpense],
                                    backgroundColor: ["#16a34a", "#dc2626"],
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

            /*// --- EvenListener untuk delete ---
            document.querySelectorAll(".deleteBtn").forEach((button) => {
                  button.addEventListener("click", async (e) => {
                        const id = e.target.dataset.id;

                        const confirmDelete = confirm(
                              "Yakin mau hapus transaksi ini? ",
                        );
                        if (!confirmDelete) return;

                        const { error } = await supabaseClient
                              .from("transactions")
                              .delete()
                              .eq("id", id);

                        if (error) {
                              console.error(error);
                              alert("Gagal menghapus");
                              return;
                        }

                        // --- Hapus elemen dari tampilan
                        e.target.parentElement.remove();

                        // --- Reload halaman supaya total update (secara simple dulu)
                        location.reload();
                  });
            });

            // --- even listener untuk edit button ---
            document.querySelectorAll(".editBtn").forEach((btn) => {
                  btn.addEventListener("click", () => {
                        const id = btn.getAttribute("data-id");
                        window.location.href = `input.html?id=${id}`;
                  });
            }); */
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
