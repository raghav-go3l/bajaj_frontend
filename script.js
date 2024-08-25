async function submitJson() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const errorMessage = document.getElementById('error-message');
    const responseDiv = document.getElementById('response');
    const dropdownSection = document.getElementById('dropdown-section');

    try {
        const parsedData = JSON.parse(jsonInput);
        
        // Hide previous error and response
        errorMessage.style.display = 'none';
        responseDiv.style.display = 'none';

        // Send request to the backend
        const responseData = await fetchDataFromBackend(parsedData);

        if (responseData.is_success) {
            // Store the response for later filtering
            window.apiResponse = responseData;

            // Show the checkbox section for filtering
            dropdownSection.style.display = 'block';
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Failed to process the request. Please try again.';
        }
    } catch (error) {
        // Display error if JSON is invalid
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Invalid JSON input. Please enter a valid JSON.';
    }
}

async function fetchDataFromBackend(data) {
    try {
        const response = await fetch('https://bajaj-backend-w2s6.onrender.com/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return await response.json();
        } else {
            return { is_success: false, message: 'Error in fetching data' };
        }
    } catch (error) {
        console.error('Error:', error);
        return { is_success: false, message: 'Request failed' };
    }
}

function displayFilteredResponse() {
    const selectedOptions = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(input => input.value);
    const filteredResponse = {};
    
    // Filter the stored API response based on selected options
    selectedOptions.forEach(option => {
        if (window.apiResponse[option]) {
            filteredResponse[option] = window.apiResponse[option];
        }
    });

    // Display the filtered response
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = `<pre>${JSON.stringify(filteredResponse, null, 2)}</pre>`;
    responseDiv.style.display = 'block';
}
