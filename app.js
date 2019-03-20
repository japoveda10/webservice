const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

const app = express()

// Adding a piece of middleware
app.use(express.json());

// Users array to test endpoints
const users = [
    { id: 1, name: 'user1' },
    { id: 2, name: 'user2' },
    { id: 3, name: 'user3' },
]

// Creates new Influx client
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'historical',
    schema: [
        {
            measurement: [
                'cpu',
                'ram',
                'networkIn',
                'networkOut',
                'frequencyOfDataTransmission',
            ],
            fields: {
                value: Influx.FieldType.INTEGER,
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
        if (!names.includes('historical')) {
            return influx.createDatabase('historical');
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
// Endpoints
//---------------------------------------------

// req can be used with params, query, and body

// GETS

app.get('/', function (req, res) {
    res.send('<h1>Hello World</h1>')
});

app.get('/api/users', function (req, res) {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) res.status(404).send('The user with the given ID was not found.');
    res.send(user)
})

app.get('/api/cpu_measurements', function (req, res) {
    influx.query(`
    select * from cpu
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});

// POSTS

app.post('/api/users', function (req, res) {
    const user = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(user);
    res.send(user);
});

app.post('/api/cpu_measurements', function (req, res) {

    if (!req.body.value || req.body.value < 0){
        // 400 Bad Request
        res.status(400).send("The value is required and should be possitive")
        return;
    }

    influx.writePoints([
        {
            measurement: 'cpu',
            tags: { 
                host: req.body.host,
                region: req.body.region
            },
            fields: { 
                value: req.body.value 
            }
        }
    ]).then(result => {
        res.send({
            host: req.body.host,
            region: req.body.region,
            value: req.body.value 
        })
    }).catch(err => {
        console.error('Error saving data to InfluxDB! ${err.stack}')
    })
});

// PUT

app.put('/api/cpu_measurements', function (req, res) {
    res.send('Got a PUT request at /api/cpu_measurements');
});

// DELETE

app.delete('/api/cpu_measurements', function (req, res) {
    //res.send('Got a DELETE request at /user');

    influx.query(`
    DELETE FROM cpu
  `).then(result => {
        res.json(result)
    }).catch(err => {
        res.status(500).send(err.stack)
    })
});
