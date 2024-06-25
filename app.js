
const express = require('express');
const app = express();
const DEFAULT_PORT = 4000;

app.get('/chart-data', (req, res) => {
    const data = {
        labels: ['Raw material', 'Electricity', 'Something else'],
        datasets: [{
            label: 'Carbon Footprint (g CO2-eq)',
            data: [1, 0.89, 9],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };
    res.json(data);
});

app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
console.log(`Server is running at http://localhost:${PORT}`);