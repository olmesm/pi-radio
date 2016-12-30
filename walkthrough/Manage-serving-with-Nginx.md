# Manage serving with Nginx

1. Run a server

    This is possibly overkill, but we're going to use Nginx for the web server.

    ```bash
    pi: $ sudo apt-get update
    pi: $ sudo apt-get upgrade              # this can take a while
    pi: $ sudo apt-get autoremove           # clean up
    pi: $ sudo apt-get install nginx
    pi: $ sudo service nginx start
    ```

1. Access Server via network

    Visit the ip address of the pi in your PC's browser and you should see a welcome message from Nginx.

        Welcome to nginx on Debian!

        If you see this page, the nginx web server is successfully installed and working on Debian. Further configuration is required.

    We now know that is working. Lets stop it and come back to this later.

    ```bash
    pi: $ sudo service nginx stop
    ```

1. Port forwarding

    Since we are going to use nginx to forward out pi ports to be accessible from the network we need to add the configuration to nginx.

    First create the project folder for the pi-radio, then a configuration for it in nginx.

    ```bash
    pi: $ mkdir ~/pi-radio
    pi: $ cd /etc/nginx/sites-available/
    sudo vi pi-radio
    ```

    A new vi editor window will appear. Press `i` then copy and right-click paste the following text into the shell session.

    ```
    server {
      listen 80;
      root /home/pi/pi-radio/;
      location / {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
      }
    }
    ```

    Then press `esc` followed by `ZZ` - thats two capital `Z`'s. This is to save and close. To just close without a save use `ZQ`.

    Next you will want to create a sim link in the `nginx/sites-enabled` folder, delete the default configuration of nginx, and then restart it.

    ```bash
    pi: $ sudo ln -s /etc/nginx/sites-available/pi-radio /etc/nginx/sites-enabled/pi-radio
    pi: $ sudo rm -rf /etc/nginx/sites-enabled/default
    pi: $ sudo service nginx reload
    ```

    Thanks to [this blog](https://www.toptal.com/raspberry-pi/how-to-turn-your-raspberry-pi-into-a-development-server) for the idea's on how to set up nginx.

1. Copy files to the pi

    ```bash
    $ scp -rp package.json public private pi@192.168.1.148:~/pi-radio # <- Note this is not the pi's shell!
    ```

    Install all the node packages required

    ```bash
    pi: $ cd ~/pi-radio
    pi: $ npm i
    ```

    Start the server on the pi

    ```bash
    pi: $ npm start
    ```

    Open a browser on your local machine and go to http://raspberrypi or the ip address of the raspberry pi - http://192.168.1.148 (your's will be different). If you see the webpage - you've done it!

### Audio issues

Depending on the configuration of your pi, it may not play any audio. This is usually because the audio device needs to be plugged in before powering on the pi. If you need to plug in a device simply pull out the power cable, add your device and power the pi back on.
