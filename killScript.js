// killScript.js
const { exec } = require('child_process');

// Command to kill a process with the title "XMRig 6.21.3"
const command = 'taskkill /FI "WINDOWTITLE eq XMRig 6.21.3" /T /F';

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error killing process: ${error}`);
        process.exit(1);
    }
    console.log('Process with title "XMRig 6.21.3" killed');
    process.exit(0);
});
