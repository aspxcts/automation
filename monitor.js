const axios = require('axios');

// Your Discord bot's endpoint to send data
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1247407237966856264/2Ur4B1NA7tRm3glsJJmj9x-aypQbqTF24WjrCNsm8V8S4ZcOhJFdLm6R_cwHuPuAqzMb';

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
async function sendDataToDiscord(cpuTemp, getWattage) {
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `Server Machine #3: CPU Temperature: ${cpuTemp}, CPU Wattage: ${getWattage}`
            }),
        });
    } catch (error) {
        console.error('Error sending data to Discord:', error);
    }
}

// Main function to monitor and report status
async function monitorAndReport() {
    const cpuTemp = await getCpuTemperature();
    const wattage = await getWattage();
    await sendDataToDiscord(cpuTemp, wattage);
}

// Schedule the function to run every 5 minutes
setInterval(monitorAndReport, 5 * 60 * 1000);

// Run immediately on startup
monitorAndReport();
