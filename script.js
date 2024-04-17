var vehicles = [];

document.getElementById('addVehicleButton').addEventListener('click', function() {
    var year = document.getElementById('year-select').value;
    var make = document.getElementById('make-select').value;
    var model = document.getElementById('model-select').value;
    var efficiency = document.getElementById('vehicleEfficiency').value;

    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);

    var milesYear = document.getElementById('milesYear').value;
    var yearsOwnership = document.getElementById('yearsOwnership').value;

    // Rates and Usage Input Validation
    var missingFields = [];
    if (!gasPrice) missingFields.push('Gas Price');
    if (!electricPrice) missingFields.push('Electric Price');
    if (!milesYear) missingFields.push('Miles per Year');
    if (!yearsOwnership) missingFields.push('Years of Ownership');

    if (missingFields.length > 0) {
        alert('Please enter the following fields: \n' + missingFields.join(', '));
        return;
    }

    // Vehicle Input Validation
    if (activeTab == 'automatic') {
        var yearSelect = document.getElementById('year-select');
        var makeSelect = document.getElementById('make-select');
        var modelSelect = document.getElementById('model-select');

        if (yearSelect.value === 'Select Year' || makeSelect.value === 'Select Make' || modelSelect.value === 'Select Model') {
            alert('Please fill out all fields in the Automatic tab.');
            return false;
        }
    } else {
        var vehicleTypeManual = document.getElementById('vehicleTypeManual');
        var vehicleEfficiencyManual = document.getElementById('vehicleEfficiencyManual');

        if (vehicleTypeManual.value === '' || vehicleEfficiencyManual.value === '') {
            alert('Please fill out all fields in the Manual tab.');
            return false;
        }
    }

    // If the user has manually input the efficiency and type, use those values
    if (document.getElementById('vehicleEfficiency').value !== '') {
        efficiency = document.getElementById('vehicleEfficiency').value;
        manualSelected = false;
    } else {
        efficiency = document.getElementById('vehicleEfficiencyManual').value;
        manualSelected = true;
    }
    if (document.getElementById('vehicleType').value !== '') {
        type = document.getElementById('vehicleType').value;
        manualSelected = false;
    } else {
        type = document.getElementById('vehicleTypeManual').value;
        manualSelected = true;
    }

    var vehicle = {
        year: year,
        make: make,
        model: model,
        efficiency: efficiency,
        type: type
    };

    vehicles.push(vehicle);

    // Clear the input fields
    document.getElementById('year-select').value = 'Vehicle Year';
    document.getElementById('make-select').value = 'Vehicle Make';
    document.getElementById('model-select').value = 'Vehicle Model';
    document.getElementById('vehicleEfficiency').value = '';
    document.getElementById('vehicleType').value = '';
    document.getElementById('vehicleTypeManual').value = '';

    // Update the vehicle list
    var vehicleList = document.getElementById('vehicleList');
    vehicleList.innerHTML = '';  // Clear the list

    var manualVehiclesNumber = 0;
    vehicles.forEach((vehicle, index) => {
        var listItem = document.createElement('li');
            // If Automatic Input is used, label the make and model
            if (vehicle.year !== "Select Year") {
                // If the vehicle is electric, convert the efficiency to ev-mpg
                if (vehicle.type === 'electric') {
                    evMPG = vehicle.efficiency / (electricPrice / gasPrice);
                    listItem.textContent = `${index + 1}. ${vehicle.make} ${vehicle.model} - ${evMPG.toFixed(2)} EV-MPG`;
                    listItem.style.color = "#00c421";
                } else {
                    listItem.textContent = `${index + 1}. ${vehicle.make} ${vehicle.model} - ${vehicle.efficiency} MPG`;
                }
            // If manual input is used, lable the numbe of manual input
            } else {
                manualVehiclesNumber++;
                // Set the Model name for the charts label
                vehicle.model = `Manual Input #${manualVehiclesNumber}`;
                if (vehicle.type === 'electric') {
                    evMPG = vehicle.efficiency / (electricPrice / gasPrice);
                    listItem.textContent = `${index + 1}. Manual Input #${manualVehiclesNumber} - ${evMPG.toFixed(2)} ev-mpg`;
                } else {
                    listItem.textContent = `${index + 1}. Manual Input #${manualVehiclesNumber} - ${vehicle.efficiency} MPG`;
                }
            }

        // Non-working remove button...
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            listItem.remove();
        };
    
        listItem.appendChild(removeButton);
    
        vehicleList.appendChild(listItem);
        
    });

    updateLineChart();

    updateBarChart();

});

// Selection Tabs
var activeTab = 'automatic';

function showTab(tab) {
    document.getElementById(activeTab).classList.add('hidden');
    document.getElementById(tab).classList.remove('hidden');
    document.querySelector('.active-tab').classList.remove('active-tab');
    document.querySelector(`.tab[onclick="showTab('${tab}')"]`).classList.add('active-tab');
    activeTab = tab;
}

document.addEventListener('DOMContentLoaded', function() {
const yearSelect = document.getElementById('year-select');
const makeSelect = document.getElementById('make-select');
const modelSelect = document.getElementById('model-select');
const efficiencyOutput = document.getElementById('vehicleEfficiency');
const vehicleType = document.getElementById('vehicleType');

fetch('https://raw.githubusercontent.com/ethanb123/RealMPGe/main/Data/cars.json')
    .then(response => response.json())
    .then(data => {
        // Populate year dropdown
        for (const year in data) {
            let option = new Option(year, year);
            yearSelect.add(option);
        }

        yearSelect.addEventListener('change', function() {
            const selectedYear = yearSelect.value;
            const makes = data[selectedYear];
            
            makeSelect.innerHTML = '<option>Select Make</option>'; // Reset make dropdown
            for (const make in makes) {
                let option = new Option(make, make);
                makeSelect.add(option);
            }
        });

        makeSelect.addEventListener('change', function() {
            const selectedYear = yearSelect.value;
            const selectedMake = makeSelect.value;
            const models = data[selectedYear][selectedMake];
            
            modelSelect.innerHTML = '<option>Select Model</option>'; // Reset model dropdown
            for (const model in models) {
                let option = new Option(model, model);
                modelSelect.add(option);
            }
        });

        modelSelect.addEventListener('change', function() {
            const selectedYear = yearSelect.value;
            const selectedMake = makeSelect.value;
            const selectedModel = modelSelect.value;
            const vehicle = data[selectedYear][selectedMake][selectedModel];
            
            efficiencyOutput.value = vehicle.comb; // Show combined efficiency
            vehicleType.value = vehicle.fuelType.toLowerCase().includes('electric') ? 'electric' : 'gas';
        });

    });
});

function updateLineChart() {
    var yearsOwnership = document.getElementById('yearsOwnership').value;
    var milesYear = document.getElementById('milesYear').value;
    var gasPrice = document.getElementById('gasPrice').value;
    var electricPrice = document.getElementById('electricPrice').value;

    var lineSeries = vehicles.map(vehicle => {
        var data = [];
        for (var year = 1; year <= yearsOwnership; year++) {
            var cost;
            if (vehicle.type === 'gas') {
                cost = (milesYear / vehicle.efficiency) * gasPrice * year;
            } else {
                cost = (milesYear / vehicle.efficiency) * electricPrice * year;
            }
            data.push(Math.round(cost));
        }
        return {
            name: `${vehicle.model.split(' ').slice(0,2).join(' ')}`,
            data: data
        };
    });

    var lineOptions = {
        chart: {
            type: 'line',
            height: '510px'
        },
        series: lineSeries,
        xaxis: {
            title: {
                text: 'Years',
                style: {
                    fontSize: '20px'
                },
                offsetY: -40,
            },
            labels: {
                style: {
                    fontSize: '20px',
                }
            },
            categories: Array.from({length: yearsOwnership}, (_, i) => i + 1),
        },
        yaxis: {
            title: {
                text: 'Total Fuel Cost',
                style: {
                    fontSize: '20px'
                }
            },
            labels: {
                style: {
                    fontSize: '20px'
                }
            }
        },
        legend: {
            fontSize: '20px'
        },
    };
    lineChart.updateSeries(lineSeries);
    lineChart.updateOptions(lineOptions)
}

function updateBarChart() {
    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);

    // Calculate EV-MPG for each vehicle in the array
    var vehicleEfficiencies = vehicles.map(function(vehicle) {
        var efficiency = vehicle.efficiency;
        if (vehicle.type === 'electric') {
            efficiency = (efficiency / (electricPrice / gasPrice)).toFixed(2);
        }
        return efficiency;
    });

    // Set the colors based on the type of vehicles
    var vehicleColors = vehicles.map(function(vehicle) {
        return vehicle.type === 'electric' ? '#72b644' : '#000000';
    });

    // Update the chart colors
    chart.updateOptions({
        //colors: vehicleColors,
        
        chart: {
            type: 'bar',
            height: '480px'
        },
        xaxis: {
            categories: vehicles.map(vehicle => vehicle.model.split(' ').slice(0,2).join(' ')),
            labels: {
                style: {
                    colors: vehicleColors
                }
            }            
        }
    });

    // Update the chart data with the new efficiency values
    chart.updateSeries([{
        data: vehicleEfficiencies
    }]);
}

function showTooltip(id) {
    var tooltip = document.getElementById(id);
    tooltip.style.display = 'block';
    
    // Hide the tooltip after 3 seconds
    setTimeout(function() {
      tooltip.style.display = 'none';
    }, 3000);
  }
  