document.getElementById('calculate').addEventListener('click', function() {
    // Input values
    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);

    // Unused inputs
    var milesYear = parseFloat(document.getElementById('milesYear').value);
    var yearsOwnership = parseFloat(document.getElementById('yearsOwnership').value);

    // Calculate MPGe for each vehicle in the array
    var vehicleEfficiencies = vehicles.map(function(vehicle) {
        var efficiency = vehicle.efficiency;
        if (vehicle.type === 'electric') {
            efficiency = (efficiency / (electricPrice / gasPrice)).toFixed(2);
        }
        return efficiency;
    });

    // Set the colors based on the type of vehicles
    var vehicleColors = vehicles.map(function(vehicle) {
        return vehicle.type === 'electric' ? '#72b644' : '#f26937';
    });

    // Update the chart colors
    chart.updateOptions({
        colors: vehicleColors,
        xaxis: {
            categories: vehicles.map(vehicle => vehicle.model)
        }
    });

    // Update the chart data with the new efficiency values
    chart.updateSeries([{
        data: vehicleEfficiencies
    }]);
});

var vehicles = [];

document.getElementById('addVehicleButton').addEventListener('click', function() {
    var year = document.getElementById('year-select').value;
    var make = document.getElementById('make-select').value;
    var model = document.getElementById('model-select').value;
    var efficiency = document.getElementById('vehicleEfficiency').value;

    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);

    var manualSelected = true;

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
    document.getElementById('year-select').value = 'Select Year';
    document.getElementById('make-select').value = 'Select Make';
    document.getElementById('model-select').value = 'Select Model';
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
                    listItem.textContent = `${index + 1}. ${vehicle.make} ${vehicle.model} - ${evMPG.toFixed(2)} ev-mpg`;
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
        vehicleList.appendChild(listItem);
    });
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

    fetch('https://raw.githubusercontent.com/ethanb123/RealMPGe/main/EPA-Data/Transformed_EPA22-23.json')
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
  