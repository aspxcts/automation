import ctypes
import sys
import os

def run_as_admin(cmd_path):
    try:
        # Check if the script is running with admin privileges
        if ctypes.windll.shell32.IsUserAnAdmin():
            print("Running command with admin privileges...")
            os.system(f'cmd /c "{cmd_path}"')
        else:
            print("Attempting to run the command with admin privileges...")
            params = f'/c "{cmd_path}"'
            # Elevate the script to run as admin
            ctypes.windll.shell32.ShellExecuteW(None, "runas", "cmd.exe", params, None, 1)
            sys.exit(0)  # Exit the current script, the new one will continue

    except Exception as e:
        print(f"Failed to elevate privileges: {e}")
        sys.exit(1)

if __name__ == "__main__":
    cmd_path = r'C:\Users\serve\Downloads\xmrig-6.21.3-gcc-win64\xmrig-6.21.3\start.cmd'
    run_as_admin(cmd_path)
