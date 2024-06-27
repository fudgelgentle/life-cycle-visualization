const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const DEFAULT_PORT = 4000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

app.post('/get-dynamic-chart', (req, res) => {
  const { minutes } = req.body;
  console.log('minutes:', minutes);
  let data = [1, 0.89, 9];
  if (typeof minutes === 'number') {
    let newData = data.map(val => val * minutes);
    const chartData = getChartData(newData);
    res.json(chartData);
  } else {
    res.status(400).send('Invalid input');
  }
});

function getChartData(data) {
  const chartData = {
    labels: ['Raw material', 'Electricity', 'Something else'],
    datasets: [{
      label: 'Carbon Footprint (g CO2-eq)',
      data: data,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100 // Set the maximum value for the y-axis
      }
    }
  };
  return { data: chartData, options: options };
}

app.get('/chart-data', (req, res) => {
  const chartConfig = getChartData([1, 0.89, 9]);
  res.json(chartConfig);
});

app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
