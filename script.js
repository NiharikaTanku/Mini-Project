let chartLabels = [];
let chartValues = [];
function addDataPoint() {
  const labelInput = document.getElementById("single-label");
  const valueInput = document.getElementById("single-value");
 

  const label = labelInput.value.trim();
  const value = valueInput.value.trim();
  
  if (!/^[A-Za-z\s]+$/.test(label)) {
    alert("Label must contain only letters.");
    return;
  }

  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    alert("Value must be a number.");
    return;
  }
if (chartLabels.includes(label)) {
    alert("This label already exists. Please enter a unique label.");
    return;
  }
  chartLabels.push(label);
  chartValues.push(numericValue);
  
  
  labelInput.value = "";
  valueInput.value = "";
  
  updateDataTable();
  updateSummary();
}

function updateDataTable() {
  const tbody = document.querySelector("#data-table tbody");
  const thead = document.getElementById("table-header"); // use ID

  tbody.innerHTML = "";

  // Show table header only if there's at least one data point
  if (chartLabels.length > 0) {
    thead.style.display = "table-header-group";
  } else {
    thead.style.display = "none";
  }

  chartLabels.forEach((label, index) => {
   const row = document.createElement("tr");
        row.innerHTML = `
          <td>${label}</td>
          <td>${chartValues[index]}</td>
      
          <button onclick="editDataPoint(${index})" title="Edit">
            <i class="fas fa-pen-to-square" style="color:#4b5563;"></i>
          </button>
          <button onclick="deleteDataPoint(${index})" title="Delete">
            <i class="fas fa-trash" style="color:#dc2626;"></i>
          </button>
        </td>
      </tr>
    `;
        tbody.appendChild(row);
  });
}



function editDataPoint(index) {
  const newLabel = prompt("Edit label:", chartLabels[index]);
  const newValue = prompt("Edit value:", chartValues[index]);

  if (!/^[A-Za-z\s]+$/.test(newLabel) || isNaN(parseFloat(newValue))) {
    alert("Invalid input.");
    return;
  }

  chartLabels[index] = newLabel.trim();
  chartValues[index] = parseFloat(newValue);
  updateDataTable();
  updateSummary();
}

function deleteDataPoint(index) {
  if (confirm("Delete this data point?")) {
    chartLabels.splice(index, 1);
    chartValues.splice(index, 1);
    updateDataTable();
    updateSummary();
  }
}

function submitData() {
  if (chartLabels.length === 0 || chartValues.length === 0) {
    alert("Please add at least one data point.");
     console.log("Submit button clicked");
    return;
  }

  // ✅ This handles all selected checkboxes
  const selectedTypes = Array.from(document.querySelectorAll('input[name="chartType"]:checked'))
    .map(cb => cb.value);

  if (selectedTypes.length === 0) {
    alert("Please select at least one chart type.");
    return;
  }

  localStorage.setItem("labels", JSON.stringify(chartLabels));
  localStorage.setItem("values", JSON.stringify(chartValues));
  localStorage.setItem("chartTypes", JSON.stringify(selectedTypes));

  // ✅ Redirect after saving data
  window.location.href = "landing.html";
}
function updateSummary() {
  if (chartValues.length === 0) {
    document.getElementById("summary-box").innerHTML = "";
    return;
  }

  const total = chartValues.reduce((acc, val) => acc + val, 0);
  const average = total / chartValues.length;
  const min = Math.min(...chartValues);
  const max = Math.max(...chartValues);

  document.getElementById("summary-box").innerHTML = `
    🔍 <span style="color:#38bdf8">Total</span>: ${total} &nbsp;&nbsp;
    📊 <span style="color:#facc15">Average</span>: ${average.toFixed(2)} &nbsp;&nbsp;
    📉 <span style="color:#f87171">Min</span>: ${min} &nbsp;&nbsp;
    📈 <span style="color:#34d399">Max</span>: ${max}
  `;
}
