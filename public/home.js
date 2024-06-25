document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('http://localhost:4000/chart-data');
    const chartData = await response.json();

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
