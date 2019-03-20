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
                'deviceState'
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
    select * from historical where id = ${req.body.id}
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

// POSTS

identification = 0

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
                region: req.body.region
            },
            fields: { 
                id: identification + 1,
                cpu: req.body.cpu,
                ram: req.body.ram,
                networkIn: req.body.network_in,
                networkOut: req.body.network_out,
                frequencyOfDataTransmission: req.body.frequency_of_data_transmission,
                deviceInstanceId: req.body.device_instance_id,
                releaseId: req.body.release_id,
            }
        }
    ]).then(result => {
        res.send({
            id: identification + 1,
            cpu: req.body.cpu,
            ram: req.body.ram,
            networkIn: req.body.network_in,
            networkOut: req.body.network_out,
            frequencyOfDataTransmission: req.body.frequency_of_data_transmission,
            deviceInstanceId: req.body.device_instance_id,
            releaseId: req.body.release_id,
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
    //res.send('Got a DELETE request at /user');

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


