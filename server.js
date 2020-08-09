const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()
const getDate = require('./db/clients')

//criando conexão com o banco de dados
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'customerx'
})

const db = conn.connect((error) => {
    if(error) {
        console.log('Problema na conexão com o banco ' + error)
    } else {
        console.log('Conectado!');
    }
})

//Definindo a template engine
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Adicionando diretorio dos arquivos
app.use('/css', express.static('css'))
app.use('/scripts', express.static('scripts'))
//app.set('views', path.join(__dirname, 'views'))
//app.set('public', path.join(__dirname, 'public'))

//criando rotas para as paginas
//Clientes
app.get('/', (req, res) => {
    conn.query("SELECT * FROM client", (err, rows) => {
        if(err) throw err
        res.render('index', {client: rows} )
    })
})

// Insert
app.post('/', (req, res) => {

    conn.query("INSERT INTO client VALUES (?, ?, ?, ?, ?)",
    [ null, req.body.name, req.body.email, req.body.phone, "getDate" ])

    res.redirect('/')
})

// Update
app.get('/edit/:clientId', (req, res) => {
    const id = req.params.clientId
    conn.query(`SELECT * FROM client WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.render('edit', { client: result[0] })
    })
})

app.post('/update', (req, res) => {
    conn.query(`
    UPDATE client 
    SET name="${req.body.name}", email="${req.body.email}", phone="${req.body.phone}"
    WHERE id="${req.body.id}";
    `), (err, results) => {
        if(err) throw err
        res.redirect('/')
    }
})

// Delete
app.get('/delete/:clientId', (req, res) => {
    const id = req.params.clientId
    conn.query(`DELETE FROM client WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.redirect('/')
    })
})

//Contatos
app.get('/contacts.ejs', (req, res) => {
    conn.query("SELECT * FROM contact", (err, rows) => {
        if(err) throw err
        res.render('contacts', { contact: rows })
    })
})

// Insert
app.post('/contacts.ejs', (req, res) => {
    conn.query("INSERT INTO contact VALUES (?, ?, ?, ?)",
    [ null, req.body.name, req.body.email, req.body.phone ])

    res.redirect('/contacts')
})

// Update
app.get('/edit-contacts/:contactId', (req, res) => {
    const id = req.params.contactId
    conn.query(`SELECT * FROM contact WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.render('edit', { client: result[0] })
    })
})

app.post('/update-contacts', (req, res) => {
    conn.query(`
    UPDATE contact 
    SET name="${req.body.name}", email="${req.body.email}", phone="${req.body.phone}"
    WHERE id="${req.body.id}";
    `), (err, results) => {
        if(err) throw err
        res.redirect('/contacts')
    }
})

// Delete
app.get('/delete/:contactId', (req, res) => {
    const id = req.params.clientId
    conn.query(`DELETE FROM contact WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.redirect('/contacts')
    })
})

//Servidor "iniciado"
app.listen(3000,() => {
    console.log("Servidor executando")
})