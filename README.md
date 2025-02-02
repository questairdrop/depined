# Depined Automation tool

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![banner](depined.jpg)

## Features

- **Automatic Ping connection maintenance**
- **Supports multi-account management**
- **Supports proxy configuration**

## How to get a token

1. Open the Depined dashboard [https://app.depined.org/dashboard](https://app.depined.org/dashboard)

2. Log in with your email

3. Press F12 to open the developer tools and find the Application tab

4. Find `token` in Local Storage and copy its value

5. Example : eyJhbGc , eyJhbGc

### 1. Preparation

Make sure your VPS meets the following conditions:
- Operating system: Ubuntu/Debian/CentOS
- Node.js version >= 16
- Memory >= 1GB
- Hard disk space >= 10GB

### 2. Install necessary software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install Screen (for background operation)
apt install -y screen
```

### 3. Download project

```bash
# Clone project
git clone https://github.com/questairdrop/depined.git
cd depined

# Install dependencies
npm install
```

### 4. Background run settings

```bash
# Create a new screen session
screen -S depined

# Run a program
npm run start

# Detach a screen session (press Ctrl+A then D)
```

### 5. Common commands

```bash
# View all screen sessions
screen -ls

# Reconnect to a screen session
screen -r depined

# End a program
# 1. Reconnect to a screen session
# 2. Press Ctrl+C to stop the program
# 3. Type exit to close the session
```

### 6. Proxy settings instructions

Support two proxy formats:
- Format 1: `ip:port:username:password`
- Format 2: `ip:port`

Example:
```
208.192.117.126:6533:username:password
```

### 7. Operation and maintenance

1. **Log viewing**
```bash
# Real-time log viewing
tail -f depined.log
```

2. **Automatic restart settings**
Create `restart.sh`:
```bash
#!/bin/bash
while true; do
npm run start
sleep 5
done
```

Set permissions and run:
```bash
chmod +x restart.sh
screen -S depined ./restart.sh
```

3. **Memory monitoring**
```bash
# View memory usage
free -h

# View the resources occupied by the program
top | grep node
   ```

### 8. Troubleshooting

1. **Program not responding**
```bash
# Find and kill all Node.js processes
pkill -f node

# Restart the program
screen -S depined
npm run start
```

2. **Memory usage is too high**
```bash
# Clean up system cache
sync && echo 3 > /proc/sys/vm/drop_caches
```

3. **Network problem**
```bash
# Test network connection
ping app.depined.org

# Check network status
netstat -tunlp | grep node
```

## Disclaimer

- This script is for learning and communication only
- Any consequences of using this script are at the user's own risk
- The author is not responsible for any losses caused by using this script

## License

This project is open source based on the MIT license - see the [LICENSE](LICENSE) file for detail
