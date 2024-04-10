import json

# Load the JSON data from the file
with open('/cars4.json') as file:
    cars_data = json.load(file)

# Process the data to nest models within makes within years
nested_cars_data = {}

for car in cars_data:
    year = str(car["year"])
    make = car["make"]
    model = car["model"]
    
    # Remove the keys that are being used to nest the data
    del car["year"]
    del car["make"]
    del car["model"]
    
    if year not in nested_cars_data:
        nested_cars_data[year] = {}
    if make not in nested_cars_data[year]:
        nested_cars_data[year][make] = {}
    
    # Add the model information
    nested_cars_data[year][make][model] = car

# Save the nested data to a new JSON file
output_filepath = '/nested_cars.json'
with open(output_filepath, 'w') as file:
    json.dump(nested_cars_data, file, indent=2)

output_filepath
