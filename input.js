let editId = null;
document.addEventListener("DOMContentLoaded", async () => {
      const form = document.getElementById("formKeuangan");
      const params = new URLSearchParams(window.location.search);
      const btnSimpan = document.getElementById("btnSimpan");
      const btnUpdate = document.getElementById("submitBtn");

      const id = params.get("id");
      console.log("ID DARI URL:", id);

      // --- default mode input ---
      btnUpdate.style.display = "none";
      if (id) {
            btnSimpan.style.display = "none";
            btnUpdate.style.display = "inline-block";

            editId = id;
            console.log("EDIT MODE AKTIF:", editId);
            const { data, error } = await supabaseClient
                  .from("transactions")
                  .select("*")
                  .eq("id", id)
                  .single();

            if (error) return console.error(error);

            document.getElementById("tanggal").value = data.tanggal;
            document.getElementById("tipe").value = data.tipe;
            document.getElementById("kategori").value = data.kategori;
            document.getElementById("jumlah").value = data.jumlah;
            document.getElementById("keterangan").value = data.keterangan;

            document.getElementById("submitBtn").innerText = "Update";
      }
      const button = document.getElementById("btnSimpan");
      const sub_button = document.getElementById("submitBtn");

      // --- logic button simpan ---
      button.addEventListener("click", async () => {
            const tanggal = document.getElementById("tanggal").value;
            const tipe = document.getElementById("tipe").value;
            const kategori = document.getElementById("kategori").value;
            const jumlah = document.getElementById("jumlah").value;
            const keterangan = document.getElementById("keterangan").value;

            const { error } = await supabaseClient
                  .from("transactions")
                  .insert([{ tanggal, tipe, kategori, jumlah, keterangan }]);

            if (error) {
                  console.error(error);
                  return;
            } else {
                  alert("Data berhasil disimpan");
                  const tanggal = (document.getElementById("tanggal").value =
                        "");
                  const tipe = (document.getElementById("tipe").value = "");
                  const kategori = (document.getElementById("kategori").value =
                        "");
                  const jumlah = (document.getElementById("jumlah").value = "");
                  const keterangan = (document.getElementById(
                        "keterangan",
                  ).value = "");
            }
      });

      // --- Logic submit ---
      form.addEventListener("submit", async (e) => {
            e.preventDefault();

            console.log("SAAT SUBMIT editId =", editId);

            const tanggal = document.getElementById("tanggal").value;
            const tipe = document.getElementById("tipe").value;
            const kategori = document.getElementById("kategori").value;
            const jumlah = document.getElementById("jumlah").value;
            const keterangan = document.getElementById("keterangan").value;

            if (editId) {
                  await supabaseClient
                        .from("transactions")
                        .update({ tanggal, tipe, kategori, jumlah, keterangan })
                        .eq("id", editId);
            } else {
                  await supabaseClient
                        .from("transactions")
                        .insert([
                              { tanggal, tipe, kategori, jumlah, keterangan },
                        ]);
            }
            window.location.href = "index.html";
      });
});
