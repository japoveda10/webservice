const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

const app = express()

// Adds piece of middleware
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
                cpu: Influx.FieldType.VARCHAR,
                frequencyOfDataTransmission: Influx.FieldType.VARCHAR,
                networkIn: Influx.FieldType.VARCHAR,
                networkOut: Influx.FieldType.VARCHAR,
                ram: Influx.FieldType.VARCHAR,
                sampleDT: Influx.FieldType.VARCHAR,
                state: Influx.FieldType.VARCHAR,
                temperature: Influx.FieldType.VARCHAR
            },
            tags: [
                'id',
                'host',
                'region',
                'release',
                'releaseId',
                'software'
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
    //.catch(err => {
        //console.log('Error creating Influx database!');
    //})

//---------------------------------------------
// Home Endpoint
//---------------------------------------------

app.get('/', function (req, res) {
    res.send('<h1>Hello World</h1>')
});

//---------------------------------------------
// Historical Measurement Endpoints
//---------------------------------------------

// GETS

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
    select * from historical where id = '${req.params.id}'
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

// POST

app.post('/api/historical', function (req, res) {

    if (!req.body){
        // 400 Bad Request
        res.status(400).send("The request needs a body")
        return;
    }

    the_id_historical = Math.ceil(Math.random() * (1000 - 1) + 1)

    influx.writePoints([
        {
            measurement: 'historical',
            tags: { 
                id: the_id_historical,
                deviceId: req.body.deviceId,
                deviceInstanceId: req.body.deviceInstanceId,
                host: req.body.host,
                region: req.body.region,
                release: req.body.release,
                releaseId: req.body.releaseId,
                software: req.body.software
            },
            fields: { 
                cpu: req.body.cpu,
                frequencyOfDataTransmission: req.body.frequencyOfDataTransmission,
                networkIn: req.body.networkIn,
                networkOut: req.body.networkOut,
                ram: req.body.ram,
                sampleDT: req.body.sampleDT,
                temperature: req.body.temperature
            }
        }
    ]).then(result => {
        res.send({
            id: the_id_historical,
            cpu: req.body.cpu,
            deviceId: req.body.deviceId,
            deviceInstanceId: req.body.deviceInstanceId,
            frequencyOfDataTransmission: req.body.frequencyOfDataTransmission,
            host: req.body.host,
            networkIn: req.body.networkIn,
            networkOut: req.body.networkOut,
            ram: req.body.ram,
            region: req.body.region,
            release: req.body.release,
            releaseId: req.body.releaseId,
            sampleDT: req.body.sampleDT,
            software: req.body.software,
            temperature: req.body.temperature
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

app.delete('/api/historical/:id', function (req, res) {
    influx.query(`
    DELETE FROM "historical" WHERE "id" = '${req.params.id}'
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
})

//---------------------------------------------
// Device State Endpoints
//---------------------------------------------

// GETS

app.get('/api/device_state', function (req, res) {
    influx.query(`
    select * from device_state
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

app.get('/api/device_state/:id', function (req, res) {
    influx.query(`
    select * from device_state where id = '${req.params.id}'
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

// POST

identification_device_state = 0

app.post('/api/device_state', function (req, res) {

    if (!req.body){
        // 400 Bad Request
        res.status(400).send("The request needs a body")
        return;
    }

    the_id_device_state = Math.ceil(Math.random() * (1000 - 1) + 1)

    influx.writePoints([
        {
            measurement: 'device_state',
            tags: {
                id: the_id_device_state,
                deviceId: req.body.deviceId,
                deviceInstanceId: req.body.deviceInstanceId,
                host: req.body.host,
                region: req.body.region,
                release: req.body.release,
                software: req.body.software
            },
            fields: { 
                state: req.body.state
            }
        }
    ]).then(result => {
        res.send({
            id: the_id_device_state,
            deviceId: req.body.deviceId,
            deviceInstanceId: req.body.deviceInstanceId,
            host: req.body.host,
            region: req.body.region,
            release: req.body.release,
            software: req.body.software,
            state: req.body.state,
        })
    }).catch(err => {
        console.error('Error saving data to InfluxDB! ${err.stack}')
    })
});

// PUT

app.put('/api/device_state', function (req, res) {
    res.send('Got a PUT request at /api/device_state');
});

// DELETE

app.delete('/api/device_state', function (req, res) {

    influx.query(`
    DELETE FROM device_state
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

app.delete('/api/device_state/:id', function (req, res) {
    influx.query(`
    DELETE FROM "device_state" WHERE "id" = '${req.params.id}'
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
})
