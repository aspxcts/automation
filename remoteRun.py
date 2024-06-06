import os
import ctypes
import sys

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def run_as_admin(filepath):
    if is_admin():
        os.system(f'"{filepath}" {" ".join(params)}')
    else:
        try:
            params = ' '.join(params)
            ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, f'"{filepath}" {params}', None, 1)
        except Exception as e:
            print(f"Failed to elevate privileges: {e}")

if __name__ == '__main__':
    filepath = "C:\Users\serve\Downloads\xmrig-6.21.3-gcc-win64\xmrig-6.21.3\start.cmd"
    run_as_admin(filepath)
