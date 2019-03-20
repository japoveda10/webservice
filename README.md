# Web Service

Welcome to this awesome web service! It was build using Node.js, Express.js, and InfluxDB.

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

7. Open a new terminal window (do not close the other two) and make sure you are inside the webservice folder. Then, run:

`$ node app.js`

8. Now, you can go to localhost:3000
