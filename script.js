document.getElementById('calculate').addEventListener('click', function() {
    // Input values
    var gasPrice = parseFloat(document.getElementById('gasPrice').value);
    var electricPrice = parseFloat(document.getElementById('electricPrice').value);
    
    var vehicle1Type = document.getElementById('vehicle1Type').value;
    var vehicle2Type = document.getElementById('vehicle2Type').value;

    var vehicle1Efficiency = parseFloat(document.getElementById('vehicle1Efficiency').value);
    var vehicle2Efficiency = parseFloat(document.getElementById('vehicle2Efficiency').value);

    // Unused inputs
    var milesYear = parseFloat(document.getElementById('milesYear').value);
    var yearsOwnership = parseFloat(document.getElementById('yearsOwnership').value);

    // Calculate MPGe if the vehicle is electric
    if (vehicle1Type === 'electric') {
        vehicle1Efficiency = (vehicle1Efficiency/(electricPrice/gasPrice)).toFixed(2); // Use the calculated electricCarMPGe value
    }
    if (vehicle2Type === 'electric') {
        vehicle2Efficiency = (vehicle2Efficiency/(electricPrice/gasPrice)).toFixed(2); // Use the calculated electricCarMPGe value
    }

    // Set the color based on the type of vehicle
    var vehicle1Color = vehicle1Type === 'electric' ? '#72b644' : '#f26937';
    var vehicle2Color = vehicle2Type === 'electric' ? '#72b644' : '#f26937';

    // Update the chart colors
    chart.updateOptions({
        colors: [vehicle1Color, vehicle2Color]
    });

    // Update the chart data with the new efficiency values
    chart.updateSeries([{
        data: [vehicle1Efficiency, vehicle2Efficiency]
    }]);

});

  /* For Selection Tabs */
  var activeTab = 'automatic';
    
  function showTab(tab) {
      document.getElementById(activeTab).classList.add('hidden');
      document.getElementById(tab).classList.remove('hidden');
      document.querySelector('.active-tab').classList.remove('active-tab');
      document.querySelector(`.tab[onclick="showTab('${tab}')"]`).classList.add('active-tab');
      activeTab = tab;
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Vehicle 1
    const yearSelect1 = document.getElementById('year-select1');
    const makeSelect1 = document.getElementById('make-select1');
    const modelSelect1 = document.getElementById('model-select1');
    const efficiencyOutput1 = document.getElementById('vehicle1Efficiency');
    const vehicleTypeOutput1 = document.getElementById('vehicle1Type');

    //Vehicle 2
    const yearSelect2 = document.getElementById('year-select2');
    const makeSelect2 = document.getElementById('make-select2');
    const modelSelect2 = document.getElementById('model-select2');
    const efficiencyOutput2 = document.getElementById('vehicle2Efficiency');
    const vehicleTypeOutput2 = document.getElementById('vehicle2Type');
    
    fetch('https://raw.githubusercontent.com/ethanb123/RealMPGe/main/EPA-Data/Transformed_EPA22-23.json')
        .then(response => response.json())
        .then(data => {
            // Populate year dropdown
            for (const year in data) {
                let option = new Option(year, year);
                yearSelect1.add(option);
            }

            yearSelect1.addEventListener('change', function() {
                const selectedYear = yearSelect1.value;
                const makes = data[selectedYear];
                
                makeSelect1.innerHTML = '<option>Select Make</option>'; // Reset make dropdown
                for (const make in makes) {
                    let option = new Option(make, make);
                    makeSelect1.add(option);
                }
            });

            makeSelect1.addEventListener('change', function() {
                const selectedYear = yearSelect1.value;
                const selectedMake = makeSelect1.value;
                const models = data[selectedYear][selectedMake];
                
                modelSelect1.innerHTML = '<option>Select Model</option>'; // Reset model dropdown
                for (const model in models) {
                    let option = new Option(model, model);
                    modelSelect1.add(option);
                }
            });

            modelSelect1.addEventListener('change', function() {
                const selectedYear = yearSelect1.value;
                const selectedMake = makeSelect1.value;
                const selectedModel = modelSelect1.value;
                const vehicle = data[selectedYear][selectedMake][selectedModel];
                
                efficiencyOutput1.value = vehicle.comb; // Show combined efficiency
                vehicleTypeOutput1.value = vehicle.fuelType.toLowerCase().includes('electric') ? 'electric' : 'gas';
            });

            // Vehicle 2
            yearSelect2.addEventListener('change', function() {
              const selectedYear = yearSelect2.value;
              const makes = data[selectedYear];
              
              makeSelect2.innerHTML = '<option>Select Make</option>'; // Reset make dropdown
              for (const make in makes) {
                  let option = new Option(make, make);
                  makeSelect2.add(option);
              }
            });

            makeSelect2.addEventListener('change', function() {
                const selectedYear = yearSelect2.value;
                const selectedMake = makeSelect2.value;
                const models = data[selectedYear][selectedMake];
                
                modelSelect2.innerHTML = '<option>Select Model</option>'; // Reset model dropdown
                for (const model in models) {
                    let option = new Option(model, model);
                    modelSelect2.add(option);
                }
            });

            modelSelect2.addEventListener('change', function() {
                const selectedYear = yearSelect2.value;
                const selectedMake = makeSelect2.value;
                const selectedModel = modelSelect2.value;
                const vehicle = data[selectedYear][selectedMake][selectedModel];
                
                efficiencyOutput2.value = vehicle.comb; // Show combined efficiency
                vehicleTypeOutput2.value = vehicle.fuelType.toLowerCase().includes('electric') ? 'Electric Vehicle' : 'Gas Vehicle';
            });
          });
});
  