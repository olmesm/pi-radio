# Setup Pi

I had various problems with nvm not starting up on booting the pi. Largely it was taking too long to start node via nvm.

[Thanks to this dude](https://github.com/audstanley/NodeJs-Raspberry-Pi) for his script, you can copy and paste the following within the node ssh session.

```bash
sudo apt-get update
sudo apt-get install git -y
git clone https://github.com/audstanley/NodeJs-Raspberry-Pi
cd NodeJs-Raspberry-Pi
chmod +x Install-Node.sh
sudo ./Install-Node.sh
cd .. && rm -R -f NodeJs-Raspberry-Pi/
node -v
```
