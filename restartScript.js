const { exec } = require('child_process');

// Path to the start.cmd script
const scriptPath = 'C:\\Users\\serve\\Downloads\\xmrig-6.21.3-gcc-win64\\xmrig-6.21.3\\start.cmd';

exec(`start cmd.exe /K ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error starting XMRig: ${error}`);
        process.exit(1);
    }
    console.log(`XMRig started successfully: ${stdout}`);
    process.exit(0);
});
