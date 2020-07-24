(function () {
        
    const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
    const apiKey = '&APPID=e89ebe7698b430ef45846afbd7325cee'

    /**
     * 
     * @description Post data to the server
     */
    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        try {
            const newData = await response.json();
            return newData;
        } catch(error) {
            console.log('error ', error);
        }
    }

    // Retrieve data
    const retrieveData = async (url='') => {
        const request = await fetch(url);
        try {
            return await request.json();
        } catch(error){
            console.log('error', error);
        }    
    }

    /**
     * @description Get weather data by ZIP 
     */
    const getWeatherData = async () => {
        const weatherData = [];
        const zip = document.querySelector('#zip').value;
        await retrieveData(baseUrl+zip+apiKey)
            .then(function(data){     
                try {
                    weatherData.push(data.main.temp)
                    weatherData.push(data.name)
                } catch(error) {
                    console.log('error ', error)
                }

            });
                return weatherData
    }

    /**
     * @param {*} className Class name of element
     * @param {*} label What's the label of the entry
     * @param {*} item Which item is be showing
     * @param {*} element Default element is a div
     * @description Helper function to create an entry
     */

    function createElement(className='', label='', item, element='div'){
        const div = document.createElement(element);
        div.setAttribute('class', className);
        div.innerHTML = `${label} ${item}`;
        return div;
    }

    /**
     * @description Create and show entries
     */
    function buildHTML(data){
        const outputElement = document.querySelector('#entriesWrapper');
        outputElement.innerHTML = '';
        for(let item in data){
            const currentEntry = data[item]
            const entry = document.createElement('div');
            const today = new Date()
            const date = `${today.getUTCDate()}/${today.getUTCMonth()}/${today.getUTCFullYear()}`;
            entry.setAttribute('class', 'entry');
            entry.appendChild(createElement('date', 'Entry date: ', date))
            entry.appendChild(createElement('temp', 'Temperature: ', currentEntry.temp))
            entry.appendChild(createElement('zip', 'ZIP: ', currentEntry.zip))
            entry.appendChild(createElement('city', 'City: ', currentEntry.city))
            entry.appendChild(createElement('feeling', 'How do you feel today: ', currentEntry.feeling))
            outputElement.appendChild(entry)
        };
    }

    /**
     * @description Clear form if it is submitted
     */
    function clearForm(){
        document.querySelector('#zip').value = '';
        document.querySelector('#feeling').value = '';
    }
      /**
     * @description Main function: Is executed if form is submitted. Get weather data, store data on the server and show entries
     */
    const submitForm = async() => {
        const projectData = [];
        const zip = document.querySelector('#zip').value;
        const feeling = document.querySelector('#feeling').value;
        
        projectData.push(zip, feeling);

        await getWeatherData()
            .then(function(data){
                projectData.push(data)
            })
            .then(function(){
                const data = projectData.flat();
                postData('/adding', {temp: data[2], zip: data[0], city: data[3], feeling: data[1]})
            })
            .then(function(){
                return retrieveData('/all')
            })          
            .then(function(data){
                buildHTML(data);
                clearForm();
            });
    }

    document.querySelector('#generate').addEventListener('click', submitForm);
})();