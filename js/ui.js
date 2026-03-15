export function renderTransactionList(data) {
      const listEl = document.getElementById("transactionList");

      if (!listEl) return;

      listEl.innerHTML = "";

      data.slice(0, 10).forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("transaction-item");

            li.textContent =
                  item.tipe +
                  " - " +
                  item.keterangan +
                  Number(item.jumlah).toLocaleString("id-ID");

            if (item.tipe === "income") li.classList.add("income");
            if (item.tipe === "expense") li.classList.add("expense");
            if (item.tipe === "transfer") li.classList.add("transfer");

            const jumlah = Number(item.jumlah) || 0;

            if (item.tipe === "transfer") {
                  li.innerHTML = `
                 <div class="transaction-info">
                        <span>${item.keterangan}</span>
                        <span>Rp ${jumlah.toLocaleString("id-ID")}</span>
                  </div>
                  `;
            }
            listEl.appendChild(li);
      });
}

export function renderHistoryTable(data) {
      const table = document.getElementById("riwayatTable");

      if (!table) return;

      table.innerHTML = "";

      data.forEach((item) => {
            const tr = document.createElement("tr");

            const jumlah = Number(item.jumlah) || 0;

            tr.innerHTML = `
                  <td>${item.tanggal || "-"}</td>
                  <td>${item.tipe}</td>
                  <td>${item.akun}</td>
                  <td>Rp ${jumlah.toLocaleString("id-ID")}</td>
                  <td>${item.keterangan || "-"}</td>

                  <td>
                        <button onclick="editData(${item.id})">Edit</button>
                        <button onclick="deleteData(${item.id})">Delete</button>
                  </td>
            `;
            table.appendChild(tr);
      });
}

export function renderHistoryForex(data) {
      const fTable = document.getElementById("riwayatTableForex");

      if (!fTable) return;

      fTable.innerHTML = "";

      data.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                  <td>${item.tanggal || "-"}</td>
                  <td>${item.pair}</td>
                  <td>${item.tipe_open}</td>
                  <td>${item.t_loss}</td>
                  <td>${item.t_profit}</td>
                  <td>${item.aktual}</td>
                  <td>${item.keterangan}</td>
                  `;
                  fTable.appendChild(tr);
      });
}