# Web Service

## Project Description

Welcome to this awesome web service! It was build using Node.js, Express.js, and InfluxDB.

## Requirements

You need to have Node.js on your computer. If you do not have it, you can install it [here](https://nodejs.org/es/). I recommend you to install the LTS version.

## Steps To Get Started

Follow the next steps to get started:

1. Download InfluxDB Time-Series Data Storage v1.7.4

    You can download it [here](https://portal.influxdata.com/downloads/)

2. Download this repository

    `$ git clone https://github.com/japoveda10/webservice.git`

3. Open a terminal window, and go inside the webservice folder

    `$ cd webservice`

4. Install the required dependencies

    `$ sudo npm install`

5. Now, run the InfluxDB server:

    `$ influxd`

6. Open a new terminal window (do not close the other one) and run the next command to have access to the InfluxDB Command Line Interface:

    `$ influx`
    
7. In that terminal window, you should see a ">". If so, enter the following and hit enter:

    `$ CREATE DATABASE monitor`

8. Open a new terminal window (do not close the other two) and make sure you are inside the webservice folder. Then, run:

    `$ node app.js`
    
    If you have nodemon installed, you can also run:
    
    `$ nodemon app.js`
    
    Nodemon restarts the server when it detects changes in app.js. If you do not have Nodemon installed on your computer, you can run the following command to install it globally on your computer:
    
    `$ npm install -g nodemon`

9. Now you are ready to test endpoints!

## Test endpoints

This is the home endpoint:

* GET http://localhost:3000/ (gets a Hello World)

You can try the next endpoints for the historical measure:

* GET http://localhost:3000/api/historical (gets all points in historical)
* GET http://localhost:3000/api/historical/:id (gets a specific point given its id)
* POST http://localhost:3000/api/historical

Example of a POST request body:

{<br />
    "cpu": "cpu 1",<br />
    "deviceId": 1,<br />
    "deviceInstanceId": 1,<br />
    "frequencyOfDataTransmission": "frequency of data transmission 1",<br />
    "host": "host 1",<br />
    "networkIn": "network in 1",<br />
    "networkOut": "network out 1",<br />
    "ram": "ram 1",<br />
    "region": "region 1",<br />
    "release": "release 1",<br />
    "releaseId": 1,<br />
    "software": "software 1"<br />
}

* PUT http://localhost:3000/api/historical (it just returns a message that it received a request)
* DELETE http://localhost:3000/api/historical (deletes all points in historical)


You can try the next endpoints for the device_state measure:

* GET http://localhost:3000/api/device_state (gets all points in device_state)
* GET http://localhost:3000/api/device_state/:id (gets a specific point given its id)
* POST http://localhost:3000/api/device_state

Example of a POST request body:

{<br />
    "deviceId": 1,<br />
    "deviceInstanceId": 1,<br />
    "host": "host 1",<br />
    "region": "region 1",<br />
    "release": "release 1",<br />
    "software": "software 1",<br />
    "state": "state 1"<br />
}

* PUT http://localhost:3000/api/device_state (it just returns a message that it received a request)
* DELETE http://localhost:3000/api/device_state (deletes all points in device_state)


## InfluxDB

InfluxDB is an open source Time Series database. It is written in Go and has various optimizations. The database this web service uses is called monitor. It has 2 measurements (or tables in the Relational Databases world vocabulary):

- historical
- device_state

Each measurement has fields and tags.

