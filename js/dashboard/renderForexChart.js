
export function renderForexChart(data) {

    const MAX_DATA = 50;
    if(!data || data.length === 0){
        console.warn("Data forex kosong")
    }

    const slicedData = data.slice(-MAX_DATA);

    const labels = slicedData.map(item => item.created_at);
    const saldo = slicedData.map(item => item.saldo);

        const ctx =document.getElementById("forexChart").getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Saldo Forex",
                    data: saldo,
                    borderWidth: 1,
                    tension: 0.4
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