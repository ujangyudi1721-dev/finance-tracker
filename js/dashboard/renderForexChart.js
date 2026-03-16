export function renderForexChart(data) {

    if(!data || data.length === 0){
        console.warn("Data forex kosong")
    }

    const labels = data.map(item => item.created_at);
    const saldo = data.map(item => item.saldo);

        const ctx =document.getElementById("forexChart");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Saldo Forex",
                    data: saldo,
                    borderWidth: 2,
                    tension: 0.2
                }]
            },

            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        })
}