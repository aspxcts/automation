const axios = require('axios');
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');


const CENTRAL_SERVER_URL = 'http://192.168.1.35:3000/data';
// Your Discord bot's endpoint to send data

async function runFile() {
    const pythonScriptPath = path.join(__dirname, 'remoteRun.py');
    console.log('before spawn');
    
    const pythonProcess = spawn('python', [pythonScriptPath]);

    // Log standard output from the Python script
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    // Log any errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Log the exit code when the Python script finishes
    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
}


// Function to get CPU temperature
async function getCpuTemperature() {
    try {
        const response = await axios.get('http://localhost:8085/data.json');
        const data = response.data;
        const cpuSensors = data.Children[0].Children[1].Children[1].Children;
        for (const sensor of cpuSensors) {
            if (sensor.Text === 'CPU Package') {    
                return sensor.Value;
            }
        }
        return 'N/A'; // If CPU Package sensor is not found
    } catch (error) {
        console.error('Error getting CPU temperature from Open Hardware Monitor:', error);
        return 'Error';
    }
}

async function getWattage() {
    try {
        const response = await axios.get('http://localhost:8085/data.json');
        const data = response.data;
        const cpuWattage = data.Children[0].Children[1].Children[3].Children;
        for (const value of cpuWattage) {
            if (value.Text === 'CPU Package') {    
                return value.Value;
            }
        }
        return 'N/A'; // If CPU Package sensor is not found
    } catch (error) {
        console.error('Error getting CPU wattage from Open Hardware Monitor:', error);
        return 'Error';
    }
}

// Function to send data to Discord bot
//async function sendDataToDiscord(cpuTemp, getWattage) {
    //try {
        //await fetch(DISCORD_WEBHOOK_URL, {
            //method: 'POST',
            //headers: {
                //'Content-Type': 'application/json',
            //},
            //body: JSON.stringify({
                //content: `Server Machine #3: CPU Temperature: ${cpuTemp}, CPU Wattage: ${getWattage}`
            //}),
        //});
    //} catch (error) {
        //console.error('Error sending data to Discord:', error);
    //}
//}

async function sendDataToServer(cpuTemp, wattage) {
    try {
        await axios.post(CENTRAL_SERVER_URL, {
            hostname: os.hostname(),
            cpuTemp: cpuTemp,
            wattage: wattage
        });
    } catch (error) {
        console.error('Error sending data to central server:', error);
    }
}

// Main function to monitor and report status
async function monitorAndReport() {
    const cpuTemp = await getCpuTemperature();
    const wattage = await getWattage();
    await sendDataToServer(cpuTemp, wattage);
}

// Schedule the function to run every 5 minutes
setInterval(monitorAndReport, 10 * 1000);

// Run immediately on startup
monitorAndReport();
