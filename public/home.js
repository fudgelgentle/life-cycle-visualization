document.addEventListener('DOMContentLoaded', async function () {
  let chartContainer = document.getElementById("map");
  let chart;
  let selectionTimeout;

  handleSlider();
  handleDraggableText();
  handleHighlightText();

  function handleHighlightText() {
    let text = document.getElementById("highlight-text");

    text.addEventListener("mouseup", (event) => {
      displayChart(event);
    });
    chartContainer.addEventListener("mouseleave", hideChart);
  }

  function handleDraggableText() {
    let startX;
    let isDragging = false;
    let tenMinText = document.getElementById("ten-minute");
    let initialValue = 10;

    tenMinText.addEventListener("mousedown", function (event) {
      startX = event.clientX;
      isDragging = true;
    });

    document.addEventListener('mousemove', function (event) {
      if (!isDragging) return;

      const currentX = event.clientX;
      const diffX = currentX - startX;

      let newValue = initialValue + Math.floor(diffX / 10);

      let canvas = document.getElementById('testChart');
      let chart = Chart.getChart(canvas);
      updateChartData(chart, newValue);

      tenMinText.textContent = newValue + " min";
    });

    document.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        // Update initialValue to the current displayed value for the next drag
        initialValue = parseInt(tenMinText.textContent, 10);
      }
    });
  }

  function handleSlider() {
    let slider = document.getElementById("myRange");
    let display = document.getElementById("display");
    display.innerHTML = slider.value;

    slider.oninput = async function() {
      display.innerHTML = this.value;
      let minutes = parseInt(this.value);
      let canvas = document.getElementById('testChart');
      let chart = Chart.getChart(canvas);
      updateChartData(chart, minutes);
    }
  }

  function updateChartData(chart, multiplier) {
    let data = [1, 0.89, 9];
    let newData = data.map(val => val * multiplier);
    const chartData = chart.data.datasets[0].data;
    for (let i = 0; i < data.length; i++) {
      chartData[i] = newData[i];
    }
    chart.update();
  }

  async function getTestChart() {
    const response = await fetch("http://localhost:4000/chart-data");
    const ctx = document.getElementById("testChart");
    const chartConfig = await response.json();
      chart = new Chart(ctx, {
        type: 'bar',
        data: chartConfig.data,
        options: chartConfig.options
      });
  }

  function hideChart() {
    chartContainer.classList.remove("visible");
    clearTimeout(selectionTimeout);
  }

  function displayChart(event) {
    clearTimeout(selectionTimeout);
    selectionTimeout = setTimeout(async function () {
      const selection = window.getSelection().toString().trim();
      if (selection) {
        chartContainer.style.top = `${event.pageY + 10}px`;
        chartContainer.style.left = `${event.pageX + 10}px`;
        chartContainer.classList.add("visible");
        if (!chart) {
          await getTestChart();
        }
      } else {
        chartContainer.classList.remove("visible");
      }
    }, 100);
  }
});
