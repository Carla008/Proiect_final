const express = require('express')
const app = express() // trimmite inapoi la server hello world si va face un requeesc de tip get
const fs = require('fs')
const vm = require("vm")
//servesc fiserele din directorul frontend
app.use('/js/', express.static('js'))
//app.use('/css/', express.static('css'))

// creeaza db.json from db.sample.json
const dbConfig = require('./config/db.json')
const mysql = require('mysql');
const db = mysql.createConnection(dbConfig);

db.connect();

// a luat de aici https://expressjs.com/en/4x/api.html#req.body
//utilizand  codul de mai jos(2 linii) nu mai amm undefined in consola
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/logare-submit', function (request, response) {
  const formular = request.body;
  console.log(formular);
  db.query('SELECT * FROM utilizatori WHERE utilizator = ?', [formular.utilizator], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }
    let logareSuccess = false
    let utilizatorId = null

    if (results.length) {
      const utilizator = results[0];

      if (utilizator.parola === formular.parola) {
         utilizatorId = utilizator.id_utilizator
        logareSuccess = true;
      }
    }

    response.json({logareSuccess: logareSuccess, utilizatorId: utilizatorId})

  })
})

app.post('/Inregistrare-submit', function (request, response) {
  const formular = request.body;
  console.log(formular);
  db.query('INSERT INTO utilizatori(nume,prenume,email,parola,utilizator,telefon,nastere,descriere,tip) VALUES (?, ?, ?, ?,?,?,?,?,?)', [formular.nume, formular.prenume, 
    formular.email, formular.parola,formular.utilizator, formular.telefon,formular.nastere,formular.descriere,formular.tip], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    console.log(results, results.length)
    response.json({ok: true})
  })
})

app.post('/creeazaproject-submit', function (request, response) {
  const formular = request.body;
  console.log(formular);
  db.query('INSERT INTO proiecte(nume_proiect, repo_url) VALUES (?,?)', [formular.numeproiect, formular.repourl], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    console.log(results, results.length)
    response.json({ok: true})
  })
})

app.get('/myprojects/:id', function (request, response) {

  console.log(request);
  db.query('SELECT pu.id_proiect, p.nume_proiect FROM proiecte_utilizatori pu, proiecte p WHERE pu.id_utilizator = ? and p.id_proiect = pu.id_proiect;', [request.params.id], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    response.json(results)

  })
})

app.get('/otherprojects/:id', function (request, response) {

  console.log(request);
  db.query('SELECT p.id_proiect, p.nume_proiect FROM proiecte p LEFT JOIN proiecte_utilizatori pu ON p.id_proiect = pu.id_proiect WHERE (pu.id_utilizator is null or pu.id_utilizator = ?);', [request.params.id], function (error, results) {
    if (error) { 
      response.status(500).send('Error in query')
      return
    }

    response.json(results)

  })
})

app.post('/joinproject/:id_proiect', function (request, response) {
  const formular = request.body;
  console.log(formular);
  db.query('INSERT INTO proiecte_utilizatori(id_utilizator,id_proiect) VALUES (?,?)', [formular.utilizator_id,request.params.id_proiect], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    console.log(results, results.length)
    response.json({ok: true})
  })
})

app.post('/creeazatest-submit/:utilizator_id', function (request, response) {
  const formular = request.body;
  console.log(formular);
  db.query('INSERT INTO test(nume_test, id_proiect,status, gravitate, id_utilizator, url) VALUES (?,?,?,?,?,?)', [formular.numetest, formular.id_proiect, formular.status, formular.gravitate, request.params.utilizator_id, formular.url], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    console.log(results, results.length)
    response.json({ok: true})
  })
})

app.get('/teste/:id_proiect', function (request, response) {

  console.log(request);
  db.query('SELECT id_test, nume_test,status, gravitate, url FROM test WHERE id_proiect = ?', [request.params.id_proiect], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    response.json(results)

  })
})

app.get('/test-info/:id_test', function (request, response) {

  console.log(request);
  db.query('SELECT id_test, nume_test,status, gravitate, url FROM test WHERE id_test = ?', [request.params.id_test], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    response.json(results[0])

  })
})

app.post('/modificatest-submit/:id_test', function (request, response) {
  const formular = request.body;
  console.log(formular);
  db.query('UPDATE test SET nume_test = ?, status = ?, gravitate = ?, url = ? WHERE id_test = ?', [formular.numetest, formular.status, formular.gravitate, formular.url, request.params.id_test], function (error, results) {
    if (error) {
      response.status(500).send('Error in query')
      return
    }

    console.log(results, results.length)
    response.json({ok: true})
  })
})

app.get('*', function (request, response, next) {
  if (/\.(js|css)$/.test(request.url)) {
    return next()
  }

  //var fileContent = fs.readFileSync('frontend/index.html')
  /*var fileContent = fs.readFileSync('front-end/src/index.js')
  response.type('text/js').send(fileContent)*/
 /* var data = fs.readFileSync('./front-end/src/index.js');
const script = new vm.Script(data);
script.runInThisContext();*/
})

const PORT = 4000; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
