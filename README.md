# HRD Webtask

Sample project for creating an Express-based server that runs on webtask.io 

### Version
0.0.1
# Initial Setup & Configuration
```bash
# Create a new wt-cli profile
npm install -g wt-cli
wt init

# Or, if you already use wt-cli:
wt profile ls
```

### Initialization
```sh
$ wt create hrd-wt.js --name hrd 
    -s CLIENT_ID=YOUR_NON_INTERACTIVE_AUTH0_CLIENT_ID
    -s CLIENT_SECRET=YOUR_NON_INTERACTIVE_AUTHO_CLIENT_SECRET
    -s ACCOUNT_NAME=YOUR_AUTH0_TENANT_NAME
```
The above command would create a webtask and give you a url like this
```
Webtask created

You can access your webtask at the following url:

https://{tenant}.webtask.io/hrd

```
# Usage
```sh
https://{tenant}.webtask.io/hrd?domain=example.com
```

# Running index.html

```sh
$ cd /path/to/index.html
$ serve .
```
