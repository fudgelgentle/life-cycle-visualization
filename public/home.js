document.addEventListener('DOMContentLoaded', async function () {
  let chartContainer = document.getElementById("map");
  let chart;
  let selectionTimeout;

  let mouseX;
  let mouseY;
  // Get the scroll offsets
  let scrollX;
  let scrollY;

  handleSlider();
  handleDraggableText();
  handleHighlightText();
  recordCurrentMouseCoord();
  handleUpDownBtnBehavior();
  handleDisplayBtn();

  function updateValue(change) {
    const upBtn = document.getElementById('up');
    const downBtn = document.getElementById('down');
    if (upBtn.classList.contains('inactive') || downBtn.classList.contains('inactive')) {
      return;
    }
    const parameter = document.getElementById('parameter-2');
    const display = document.getElementById('display');
    display.innerText = parseInt(parameter.innerText);

    const newValue = parseInt(parameter.innerText) + change;
    parameter.innerText = newValue;
    display.innerText = newValue;
    updateChartData(chart, newValue);
  }

  function handleUpDownBtnBehavior() {
    const upBtn = document.getElementById('up');
    const downBtn = document.getElementById('down');
    upBtn.addEventListener('click', () => {
      updateValue(1);
    });
    downBtn.addEventListener('click', () => {
      updateValue(-1);
    });
  }

  function handleDisplayBtn() {
    let displayBtn = document.querySelector('.display-chart-btn');
    displayBtn.addEventListener('click', () => {
      if (!chart) {
        displayChart2();
      }
      if (displayBtn.classList.contains('eye-off')) {
        replaceClass(displayBtn, 'eye-off', 'eye-on');
        displayBtn.src = 'img/eye-on.png';
        showChart();
      } else {
        replaceClass(displayBtn, 'eye-on', 'eye-off');
        displayBtn.src = 'img/eye-off.png';
        hideChart();
      }
      activeUpDownBtn();
    });
  }


  /**
   * Removes the old class from the element and adds in the new class.
   * @param {HTMLElement} element the target html element
   * @param {String} oldClass the class to be removed
   * @param {String} newClass the class to be added
   */
  function replaceClass(element, oldClass, newClass) {
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  }

  function activeUpDownBtn() {
    const upDownBtn = document.querySelectorAll('.up-down-btn');
    let specialText = document.querySelectorAll('.special-text-2');
    upDownBtn.forEach((btn) => {
      if (btn.classList.contains('active')) {
        replaceClass(btn, 'active', 'inactive');
      } else {
        replaceClass(btn, 'inactive', 'active');
      }
    });
    specialText.forEach((text) => {
      if (text.classList.contains('active-st')) {
        replaceClass(text, 'active-st', 'inactive-st');
      } else {
        replaceClass(text, 'inactive-st', 'active-st');
      }
    })
  }

  // Records the current coordinate of the mouse.
  function recordCurrentMouseCoord() {
    document.addEventListener('mousemove', function(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      scrollX = window.scrollX;
      scrollY = window.scrollY;
    });
  }

  function handleHighlightText() {
    let text = document.getElementById("highlight-text");
    const fullText = text.innerText;

    document.addEventListener('selectionchange', (event) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      if (selectedText == fullText) {
        displayChart();
      }
    });

    chartContainer.addEventListener("mouseleave", hideChart);
  }

  function handleDraggableText() {
    let startX;
    let isDragging = false;
    let parameterText = document.getElementById("parameter");
    let initialValue = parseInt(parameterText.innerText);

    parameterText.addEventListener("mousedown", function (event) {
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
      if (chart) {
        updateChartData(chart, newValue);
      }
      parameterText.textContent = newValue + " min";
    });

    document.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        // Update initialValue to the current displayed value for the next drag
        initialValue = parseInt(parameterText.textContent);
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
  }

  function showChart() {
    chartContainer.classList.add("visible");
  }

  function displayChart2() {
    clearTimeout(selectionTimeout);
    selectionTimeout = setTimeout(async function () {
      chartContainer.style.top = `${mouseY + scrollY + 20}px`;
      chartContainer.style.left = `${mouseX + scrollX + 20}px`;
      chartContainer.classList.add("visible");
      if (!chart) {
        await getTestChart();
      }
    }, 100);
  }

  // Uses the current x and y coordinate of the mouse and displays a chart below it.
  function displayChart() {
    clearTimeout(selectionTimeout);
    selectionTimeout = setTimeout(async function () {
      const selection = window.getSelection().toString().trim();
      if (selection) {
        chartContainer.style.top = `${mouseY + scrollY + 10}px`;
        chartContainer.style.left = `${mouseX + scrollX + 10}px`;
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
