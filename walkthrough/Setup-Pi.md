# Setup Pi

1. Install Jessie

    [Download the Lite Raspbian](https://www.raspberrypi.org/downloads/raspbian/) release - I'm using Jessie Lite (November 2016). Instructions to set it up are on the website.

    Since I'm going headless and too lazy to get a keyboard, you will need to enable SSH on boot. Do this by placing a blank file saved with the name `ssh` - no extension, on the SD card boot partition.

    Finally plug in the pi to your router, slip in the SD card, FINALLY power it on.

1. SSH in

    Either use Angry IP, or login to your home router (normally 192.168.0.1 or 192.168.1.1) and find the IP address of the pi.
    My pi ip address is 192.168.1.148. You can also try using the pi device name `raspberrypi`

    Open terminal and start up an ssh session, logging in as the default user pi, password raspberry.

    ```
    $ ssh pi@192.168.1.148 # or ssh pi@raspberrypi

    The authenticity of host '192.168.1.148 (192.168.1.148)' can't be established.
    ECDSA key fingerprint is SHA256:xxxxxxxxxxxx.
    Are you sure you want to continue connecting (yes/no)?
    $ yes

    Warning: Permanently added '192.168.1.148' (ECDSA) to the list of known hosts.
    pi@192.168.1.148's password:
    $ raspberry

    The programs included with the Debian GNU/Linux system are free software;
    the exact distribution terms for each program are described in the
    individual files in /usr/share/doc/*/copyright.

    Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
    permitted by applicable law.

    SSH is enabled and the default password for the 'pi' user has not been changed.
    This is a security risk - please login as the 'pi' user and type 'passwd' to set a new password.

    pi@raspberrypi:~ $
    ```

    We're in!

    From now on, I will differentiate between the pi's shell and local shell by prefixing the pi's terminal with `pi: $`

1. Raspi-config

    Two important steps are to expand your pi's filesystem and change the password. This is done via `raspi-config`

    ```bash
    pi: $ sudo raspi-config

    # Select first option
    # Once complete change your pi user's password via option 2

    pi: $ sudo reboot
    ```

1. Install NVM and Node.js

    ```
    # Get NVM
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.6/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

    # Install node
    pi: $ nvm install node

    pi: $ sudo reboot

    # Let pi reboot then SSH back in
    pi: $ node -v
    v7.3.0
    ```
1. Install Mplayer

    ```bash
    pi: $ sudo apt-get install mplayer2 -y
    ```
