let editId = null;
document.addEventListener("DOMContentLoaded", async () => {
      const form = document.getElementById("formKeuangan");
      const params = new URLSearchParams(window.location.search);
      const btnSimpan = document.getElementById("btnSimpan");
      const btnUpdate = document.getElementById("editData");

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
            document.getElementById("akun").value = data.akun;

            document.getElementById("editData").innerText = "Update";
      }
      const tipeSelect = document.getElementById("tipe");
      const transferField = document.getElementById("transferField");

      tipeSelect.addEventListener("change", () => {
            if (tipeSelect.value === "transfer") {
                  transferField.style.display = "block";
            } else {
                  transferField.style.display = "none";
            }
      });

      const button = document.getElementById("btnSimpan");
      const sub_button = document.getElementById("editData");

      // --- Logic submit ---
      form.addEventListener("submit", async (e) => {
            e.preventDefault();

            console.log("SAAT SUBMIT editId =", editId);

            const tanggal = document.getElementById("tanggal").value;
            const tipe = document.getElementById("tipe").value;
            const kategori = document.getElementById("kategori").value;
            const jumlah = document.getElementById("jumlah").value;
            const keterangan = document.getElementById("keterangan").value;
            const akun = document.getElementById("akun").value;

            console.log("TIPE", tipe);
            if (tipe === "transfer") {
                  const tujuanAkun =
                        document.getElementById("tujuanAkun").value;

                  if (akun === tujuanAkun) {
                        alert("Akun asal dan tujuan tidak boleh sama");
                        return;
                  }
                  const transferGroup = crypto.randomUUID();
                  // -- Akun Asal Dikurangi --
                  await supabaseClient.from("transactions").insert([
                        {
                              tanggal,
                              tipe: "transfer",
                              akun: akun,
                              jumlah,
                              kategori,
                              transfer_group: transferGroup,
                              transfer_type: "out",
                              keterangan: "Transfer keluar",
                        },
                  ]);

                  // --- akun asal ditambah ---
                  await supabaseClient.from("transactions").insert([
                        {
                              tanggal,
                              tipe: "transfer",
                              akun: tujuanAkun,
                              jumlah,
                              kategori,
                              transfer_group: transferGroup,
                              transfer_type: "in",
                              keterangan: "Transfer masuk",
                        },
                  ]);
                  console.log("TRANSFER BERHASIL");
                  await "Transaksi Berhasil";
            } else {
                  if (editId) {
                        await supabaseClient
                              .from("transactions")
                              .update({
                                    tanggal,
                                    tipe,
                                    kategori,
                                    jumlah,
                                    keterangan,
                                    akun,
                              })
                              .eq("id", editId);
                  } else {
                        await supabaseClient.from("transactions").insert([
                              {
                                    tanggal,
                                    tipe,
                                    kategori,
                                    jumlah,
                                    keterangan,
                                    akun,
                              },
                        ]);
                  }
            }
            //window.location.href = "index.html";
      });
});
