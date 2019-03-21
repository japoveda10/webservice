const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

const app = express()

// Adding a piece of middleware
app.use(express.json());

// Creates new Influx client
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'monitor',
    schema: [
        {
            measurement: [
                'historical',
                'device_state'
            ],
            fields: {
                id: Influx.FieldType.INTEGER,
                cpu: Influx.FieldType.VARCHAR,
                ram: Influx.FieldType.VARCHAR,
                networkIn: Influx.FieldType.VARCHAR,
                networkOut: Influx.FieldType.VARCHAR,
                frequencyOfDataTransmission: Influx.FieldType.VARCHAR,
                deviceInstanceId: Influx.FieldType.INTEGER,
                releaseId: Influx.FieldType.INTEGER,
                deviceId: Influx.FieldType.INTEGER,
                release: Influx.FieldType.VARCHAR,
                software: Influx.FieldType.VARCHAR, 
                state: Influx.FieldType.VARCHAR
            },
            tags: [
                'host',
                'region'
            ]
        }
    ]
})

// Makes sure the database exists and boot the app
influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('monitor')) {
            return influx.createDatabase('monitor');
        }
    })
    .then(() => {
        http.createServer(app).listen(3000, function () {
            console.log('Listening on port 3000')
        })
    })
    .catch(err => {
        console.log('Error creating Influx database!');
    })

//---------------------------------------------
// Historical Measurement Endpoints
//---------------------------------------------

// req can be used with params, query, and body

// GETS

app.get('/', function (req, res) {
    res.send('<h1>Hello World</h1>')
});

app.get('/api/historical', function (req, res) {
    influx.query(`
    select * from historical
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

app.get('/api/historical/:id', function (req, res) {
    influx.query(`
    select * from historical where id = ${req.params.id}
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

// POSTS

identification_historical = 0

app.post('/api/historical', function (req, res) {

    if (!req.body){
        // 400 Bad Request
        res.status(400).send("The request needs a body")
        return;
    }

    influx.writePoints([
        {
            measurement: 'historical',
            tags: { 
                host: req.body.host,
                region: req.body.region,
                id: identification_historical + 1,
                releaseId: req.body.release_id,
                deviceId: req.body.device_id,
                release: req.body.release,
                software: req.body.software
            },
            fields: { 
                cpu: req.body.cpu,
                ram: req.body.ram,
                networkIn: req.body.network_in,
                networkOut: req.body.network_out,
                frequencyOfDataTransmission: req.body.frequency_of_data_transmission,
                deviceInstanceId: req.body.device_instance_id
            }
        }
    ]).then(result => {
        res.send({
            id: identification_historical + 1,
            cpu: req.body.cpu,
            ram: req.body.ram,
            networkIn: req.body.network_in,
            networkOut: req.body.network_out,
            frequencyOfDataTransmission: req.body.frequency_of_data_transmission,
            deviceInstanceId: req.body.device_instance_id,
            releaseId: req.body.release_id,
            deviceId: req.body.device_id,
            release: req.body.release,
            software: req.body.software
        })
    }).catch(err => {
        console.error('Error saving data to InfluxDB! ${err.stack}')
    })
});

// PUT

app.put('/api/historical', function (req, res) {
    res.send('Got a PUT request at /api/historical');
});

// DELETE

app.delete('/api/historical', function (req, res) {

    influx.query(`
    DELETE FROM historical
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

//---------------------------------------------
// Device State Endpoints
//---------------------------------------------

app.get('/api/device_state', function (req, res) {
    influx.query(`
    select * from device_state
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

identification_device_state = 0

app.post('/api/device_state', function (req, res) {

    if (!req.body){
        // 400 Bad Request
        res.status(400).send("The request needs a body")
        return;
    }

    influx.writePoints([
        {
            measurement: 'device_state',
            tags: { 
                host: req.body.host,
                region: req.body.region,
                id: identification_device_state + 1,
                deviceInstanceId: req.body.device_instance_id,
                deviceId: req.body.device_id,
                release: req.body.release,
                software: req.body.software
            },
            fields: { 
                state: req.body.state
            }
        }
    ]).then(result => {
        res.send({
            id: identification_device_state + 1,
            state: req.body.state,
            deviceInstanceId: req.body.device_instance_id,
            deviceId: req.body.device_id,
            release: req.body.release,
            software: req.body.software
        })
    }).catch(err => {
        console.error('Error saving data to InfluxDB! ${err.stack}')
    })
});

app.put('/api/device_state', function (req, res) {
    res.send('Got a PUT request at /api/device_state');
});

app.delete('/api/device_state', function (req, res) {

    influx.query(`
    DELETE FROM device_state
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});


