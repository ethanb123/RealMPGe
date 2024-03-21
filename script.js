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
    
const carSelectorModule = (() => {
    let carData = []; // Store the car data for use in the event listener
  
    // Function to fetch the JSON and return a promise with the car data
    function fetchCars(url) {
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(jsonData => {
          carData = jsonData.Cars;
          return carData.map(car => ({
            make: car.Make,
            model: car.Model
          }));
        });
    }
  
    // Function to fill the dropdown menu with options
    function fillDropdown(dropdownId, cars) {
      const dropdown = document.getElementById(dropdownId);
      cars.forEach(car => {
        const option = document.createElement('option');
        option.value = `${car.make} ${car.model}`;
        option.textContent = option.value;
        dropdown.appendChild(option);
      });
    }
  
    // Function to update the efficiency text input based on the selection
    function updateEfficiencyInput(dropdownId, inputId) {
      const dropdown = document.getElementById(dropdownId);
      //const efficiencyinput = document.getElementById(efficiencyinput);
  
      dropdown.addEventListener('change', () => {
        const selectedValue = dropdown.value;
        const selectedCar = carData.find(car => `${car.Make} ${car.Model}` === selectedValue);
        console.log("MPG: "+selectedCar['Cmb MPG']);
        if (selectedCar) {
            //efficiencyinput.value = selectedCar['Cmb MPG'];
            document.getElementById('vehicle1Efficiency').value=selectedCar['Cmb MPG']
        } else {
            //efficiencyinput.value = ''; // Clear the input if the selection doesn't match
        }
      });
    }
  
    // Expose the functions
    return {
      fetchCars,
      fillDropdown,
      updateEfficiencyInput
    };
  })();
  
  // Example usage:
  // Fetch the JSON data from the URL and then fill the dropdown
  carSelectorModule.fetchCars('https://raw.githubusercontent.com/ethanb123/RealMPGe/main/EPA-Data/2023.json')
    .then(cars => {
      carSelectorModule.fillDropdown('car-dropdown', cars);
      carSelectorModule.updateEfficiencyInput('car-dropdown', 'efficiency-input');
    })
    .catch(error => console.error('Failed to fetch cars', error));
  