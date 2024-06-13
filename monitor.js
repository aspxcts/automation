const axios = require('axios');
const os = require('os');
const path = require('path');


const CENTRAL_SERVER_URL = 'http://192.168.1.35:3000/data';

async function getCpuTemperature() {
    try {
        const response = await axios.get('http://localhost:8085/data.json');
        const data = response.data;
        const cpuSensors = data.Children[0].Children[1].Children[1].Children;
        for (const value of cpuSensors) {
            if (value.Text === 'CPU Package') {    
                return value.Value;
            }
        }
        return 'N/A'; 
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
        return 'N/A'; 
    } catch (error) {
        console.error('Error getting CPU wattage from Open Hardware Monitor:', error);
        return 'Error';
    }
}

async function getCpuLoad() {
    try {
        const response = await axios.get('http://localhost:8085/data.json');
        const data = response.data;
        const cpuLoad = data.Children[0].Children[1].Children[2].Children;
        for (const value of cpuLoad) {
            if (value.Text === 'CPU Total') {    
                return value.Value;
            }
        }
        return 'N/A'; 
    } catch (error) {
        console.error('Error getting CPU wattage from Open Hardware Monitor:', error);
        return 'Error';
    }
}

async function sendDataToServer(cpuTemp, wattage, cpuLoad) {
    try {
        await axios.post(CENTRAL_SERVER_URL, {
            hostname: os.hostname(),
            cpuTemp: cpuTemp,
            wattage: wattage,
            cpuLoad: cpuLoad
        });
    } catch (error) {
        console.error('Error sending data to central server:', error);
    }
}   

async function monitorAndReport() {
    const cpuTemp = await getCpuTemperature();
    const wattage = await getWattage();
    const cpuLoad = await getCpuLoad();
    await sendDataToServer(cpuTemp, wattage, cpuLoad);
}

setInterval(monitorAndReport, 10 * 1000);
monitorAndReport();
