# Web Service

## Project Description

Welcome to this awesome web service! It was build using Node.js, Express.js, and InfluxDB.

## Steps To Get Started

Follow the next steps to get started:

1. Download InfluxDB Time-Series Data Storage v1.7.4

    You can download it [here](https://portal.influxdata.com/downloads/)

2. Download this repository

3. Open a terminal window, and go inside the webservice folder

    `$ cd webservice`

4. Install the required dependencies

    `$ sudo npm install`

5. Now, run InfluxDB server:

    `$ influxd`

6. Open a new terminal window (do not close the other one) and run InfluxDB Command Line Interface:

    `$ influx`
    
7. In that terminal window, you should see ">". If so, type CREATE DATABASE monitor

8. Open a new terminal window (do not close the other two) and make sure you are inside the webservice folder. Then, run:

    `$ node app.js`

9. Now you are ready to test endpoints!

## Test endpoints

You can try the next endpoints:

* localhost:3000

