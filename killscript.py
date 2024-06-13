import ctypes
import sys
import os

def run_as_admin(command):
    try:
        # Check if the script is already running with admin privileges
        if ctypes.windll.shell32.IsUserAnAdmin():
            print("Running command with admin privileges...")
            os.system(command)
        else:
            print("Attempting to run the command with admin privileges...")
            params = f'/c {command}'
            ctypes.windll.shell32.ShellExecuteW(None, "runas", "cmd.exe", params, None, 1)
            sys.exit(0)  # Exit the current script, the new one will continue

    except Exception as e:
        print(f"Failed to elevate privileges: {e}")
        sys.exit(1)

if __name__ == "__main__":
    command = 'taskkill /IM xmrig.exe /T /F'
    run_as_admin(command)
