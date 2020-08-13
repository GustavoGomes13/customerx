const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()

//criando conexão com o banco de dados
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'customerx'
})

conn.connect((error) => {
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

//criando rotas para as paginas
app.get('/', (req, res) => {
    res.render('index')
})

/***********CLIENTES***********/
app.get('/clients', (req, res) => {
    //select utilizado para já trazer formatado a data para exibição
    conn.query("SELECT id, name, email, phone, date_format(register_date, '%d/%m/%Y') as register_date FROM client;", (err, rows) => {
        if(err) throw err
        res.render('clients', {client: rows} )     
    })
})

// Insert
app.post('/clients', (req, res) => {

    //Tratando data para inserir apenas YYYY-MM-DD
    let date = new Date().toISOString().slice(0, 10)

    conn.query("INSERT INTO client VALUES (?, ?, ?, ?, ?)",
    [ null, req.body.name, req.body.email, req.body.phone, date ])

    res.redirect('/clients')
})

// Update
app.get('/edit-clients/:clientId', (req, res) => {
    const id = req.params.clientId
    conn.query(`SELECT * FROM client WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.render('edit-clients', { client: result[0] })
    })
})

app.post('/update', (req, res) => {
    conn.query(`
    UPDATE client 
    SET name="${req.body.name}", email="${req.body.email}", phone="${req.body.phone}"
    WHERE id="${req.body.id}";
    `)
    res.redirect('/clients')
})

// Delete
app.get('/delete/:clientId', (req, res) => {
    const id = req.params.clientId
    
    /* Deixei com try catch pra não deixar sistema quebrar ao tentar deletar cliente com vinculo de contato.
    Não consegui encontrar outra forma para que fosse exibido mensagem ou redirecionado para uma página de erro,
    sem que parasse o servidor devido ao erro de sql. */
    try {
        conn.query(`DELETE FROM client WHERE id = ${id};`, (result) => {
            res.redirect('/clients')
        })
    } catch (error) {
        
    }
})

/**************CONTATOS************/
// Adicionando contatos
// pegando a id do cliente que recebera o contato
app.get('/add-contacts/:idClient', (req, res) => {
    const id = req.params.idClient
    conn.query(`SELECT * FROM client WHERE id = ${id};`, (err, result) => {
        if(err) throw err
        res.render('add-contacts', { client: result[0] })
    })
})

app.post('/insert-contact', (req, res) => {
    conn.query(`INSERT INTO contact VALUES (?, ?, ?, ?, ?);`,
    [ null, req.body.name, req.body.email, req.body.phone, req.body.clientId ])
    res.redirect('/contacts')
})

// Lista de contatos
app.get('/contacts', (req, res) => {
    conn.query(`SELECT cli.name as cliName, con.id, con.name, con.email, con.phone FROM client AS cli 
        JOIN contact AS con 
        ON cli.id = con.id_client
        ORDER BY con.id_client, con.id;`, (err, rows) => {
        if(err) throw err
        res.render('contacts', { contact: rows })
    })
})

// Update
app.get('/edit-contacts/:contactId', (req, res) => {
    const id = req.params.contactId
    conn.query(`SELECT * FROM contact WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.render('edit-contacts', { contact: result[0] })
    })
})

app.post('/update-contacts', (req, res) => {
    conn.query(`
    UPDATE contact 
    SET name="${req.body.name}", email="${req.body.email}", phone="${req.body.phone}"
    WHERE id="${req.body.id}";
    `)
    res.redirect('/contacts')

})

// Delete
app.get('/delete-contacts/:contactId', (req, res) => {
    const id = req.params.contactId
    conn.query(`DELETE FROM contact WHERE ID = ${id};`, (err, result) => {
        if(err) throw err
        res.redirect('/contacts')
    })
})

//Servidor "iniciado"
app.listen(3000,() => {
    console.log("Servidor executando")
})