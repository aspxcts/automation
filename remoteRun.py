import os

def run_as_admin(filepath):
    print("inside func")
    os.system(f'"{filepath}"')

if __name__ == '__main__':
    print("inside start")
    filepath = "C:\\Users\\serve\\Downloads\\xmrig-6.21.3-gcc-win64\\xmrig-6.21.3\\start.cmd"
    run_as_admin(filepath)
