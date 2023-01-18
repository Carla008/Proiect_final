import  {Outlet, Navigate,Link } from 'react-router-dom'
import React, { Component } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const appState = {
loggedIn: false,
userId: null
}
class Index extends Component
{
render() {
  
  if (appState.loggedIn) {
    return <h1>Testare bug</h1>;
  } else {
    return <h1>Testare bug</h1>;
  }
}
}

class Logare extends Component
{
constructor (props) {
  super(props)
  this.state = {
    loginSuccess: false,
    form: {
      utilizator: null,
      parola: null
    }
  }
}

punereBD = (fieldName) => {
  return (e) => {
    const newForm = {utilizator: this.state.form.utilizator, parola: this.state.form.parola}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  if (this.state.loginSuccess || appState.loggedIn) {
    return (<Navigate to="/dashboard" />)
  }
  return (
    <form method="post" onSubmit={this.submit}>
      utilizator <input type="text" name="utilizator" placeholder="utilizator" onChange={this.punereBD('utilizator')} /><br/><br/>
      Parola: <input type="password" name="parola" placeholder="parola" onChange={this.punereBD('parola')} /><br/><br/>
      <input type="submit" value="Conectare" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

   fetch('/logare-submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  }).then(function (response) {
    return response.json()
  }).then((data) => {
    if (data.loginSuccess) {
      appState.loggedIn = true
      appState.userId = data.userId
      this.setState({loginSuccess: true})
    }
  })
}
}

class Inregistrare extends Component
{
constructor (props) {
  super(props)
  this.state = {
    form: {
      nume: null,
      prenume: null,
      email: null,
      parola: null,
      utilizator: null,
      telefon: null,
      nastere: null,
      descriere: null,
      tip:null
    }
  }
}

punereBD = (fieldName) => {
  return (e) => {
    const newForm = {nume: this.state.form.nume, prenume: this.state.form.prenume, email: this.state.form.email, parola: this.state.form.parola,
      utilizator: this.state.form.utilizator, telefon: this.state.form.telefon, nastere: this.state.form.nastere, 
      descriere: this.state.form.descriere,tip: this.state.form.tip}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  return (
    <form method="post" onSubmit={this.submit}>
      Nume: <input type="text" name="nume" placeholder="prenume" onChange={this.punereBD('nume')} /><br/><br/>
      Prenume: <input type="text" name="prenume" placeholder="nume" onChange={this.punereBD('prenume')} /><br/><br/>
      Utilizator: <input type="text" name="utilizator" onChange={this.punereBD('utilizator')} /><br/><br/>
      Email: <input type="text" name="email" placeholder="ex: exemplu@mail.com" onChange={this.punereBD('email')} /><br/><br/>
      Parola: <input type="password" name="parola" placeholder="parola" onChange={this.punereBD('parola')} /><br/><br/>
      Telefon: <input type="number" name="telefon" placeholder="telefon" onChange={this.punereBD('telefon')} /><br/><br/>
      Zi de nastere: <input type="date" name="nastere" onChange={this.punereBD('nastere')} /><br/><br/>
      Descriere: <input type="text" name="descriere" placeholder="descriere" onChange={this.punereBD('descriere')} /><br/><br/>
      Tip:
      <fieldset>
      <input type="radio" id="MP" name="contact" value="MP" onChange={this.punereBD('tip')}/>
      <label htmlFor="MP">MP</label>

      <input type="radio" id="TST" name="contact" value="TST" onChange={this.punereBD('tip')} />
      <label htmlFor="TST">TST</label>
      </fieldset>
      <input type="submit" value="Inregistrare" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/Inregistrare-submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  })
}
}

class Alemeleproiecte extends Component
{
constructor (props) {
  super(props)
  this.state = {
    proiectArray: []
  }
  fetch('/Alemeleproiecte/' + appState.userId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({proiectArray: data})
  })
}

render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  
  const listaObiecte = this.state.proiectArray.map((number,index) =>
    <li key={index}><Link to={'/proiect/' + number.id_proiect}>{number.nume_proiect}</Link></li>
  );
  return (
    <div>
    <ul>{listaObiecte}</ul>
    </div>
  )
}
}

class Alteproiecte extends Component
{
constructor (props) {
  super(props)
  this.state = {
    proiectArray: []
  }
  fetch('/Alteproiecte/' + appState.userId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({proiectArray: data})
  })
}

joinproiect = (id_proiect) => {
  return (e) => {
    fetch('/joinproiect/' + id_proiect, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({utilizator_id: appState.userId})
  })
      
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  
  const listaObiecte = this.state.proiectArray.map((number,index) =>
    <li key={index}>{number.nume_proiect} <a href="#" onClick={this.joinproiect(number.id_proiect)}>Inscriere proiect</a></li>
  );
  return (
    <div>
    <ul>{listaObiecte}</ul>
    </div>
  )
}
}

class Creeazaproiect extends Component
{
constructor (props) {
  super(props)
  this.state = {
    form: {
      numeproiect: null,
      repourl: null
    }
  }
}

punereBD = (fieldName) => {
  return (e) => {
    const newForm = {numeproiect: this.state.form.numeproiect, repourl: this.state.form.repourl}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  return (
    <form method="post" onSubmit={this.submit}>
      Nume proiect: <input type="text" name="numeproiect" placeholder="numele proiectului" onChange={this.punereBD('numeproiect')} /><br/><br/>
      Repository URL: <input type="text" name="repourl" placeholder="link-ul catre repository" onChange={this.punereBD('repourl')} /><br/><br/>
      
      <input type="submit" value="Creeaza proiect" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/creeazaproject-submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  })
}
}

class Creeazatest extends Component
{
constructor (props) {
  super(props)
  this.state = {
    proiectArray: [],
    form: {
      numetest: null,
      id_proiect: null,
      status: null,
      severitate: null,
      url: null,
      descriere_proiect:null
    }
  }
  fetch('/Alemeleproiecte/' + appState.userId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({proiectArray: data})
  })
}

punereBD = (fieldName) => {
  return (e) => {
    const newForm = {numetest: this.state.form.numetest, id_proiect: this.state.form.id_proiect, status: this.state.form.status, severitate: this.state.form.severitate, url: this.state.form.url,
      descriere_proiect:this.state.form.descriere_proiect}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  
  const listaObiecte = this.state.proiectArray.map((number,index) =>
    <option value={number.id_proiect} key={index}>{number.nume_proiect}</option>
  );
  return (
    <form method="post" onSubmit={this.submit}>
      test name: <input type="text" name="numetest" placeholder="numele test-ului" onChange={this.punereBD('numetest')}/><br/><br/>
     
    
      Status:<br></br>
      <input type="radio" id="MP" name="contact" value="gata" onChange={this.punereBD('status')}/>
      <label htmlFor="gata">gata</label><br></br>

      <input type="radio" id="TST" name="contact" value="in progres" onChange={this.punereBD('status')} />
      <label htmlFor="in progres">in progres</label><br></br>
      <input type="radio" id="TST" name="contact" value="in testare" onChange={this.punereBD('status')} />
      <label htmlFor="in testare">in testare</label><br></br>
      
      Severitate:<br></br>
      <input type="radio" id="MP" name="contact1" value="putin" onChange={this.punereBD('severitate')}/>
      <label htmlFor="putin">putin</label><br></br>

      <input type="radio" id="TST" name="contact1" value="mediu" onChange={this.punereBD('severitate')} />
      <label htmlFor="mediu">mediu</label><br></br>
      <input type="radio" id="TST" name="contact1" value="puternic" onChange={this.punereBD('severitate')} />
      <label htmlFor="puternic">puternic</label><br></br>
      <input type="radio" id="TST" name="contact1" value="critic" onChange={this.punereBD('severitate')} />
      <label htmlFor="puternic">critic</label><br></br>
      
      
       Commit URL: <input type="text" name="url" placeholder="url" onChange={this.punereBD('url')}/><br/><br/>
      
       Descriere: <input type="text" name="descriere_proiect" placeholder="descriere" onChange={this.punereBD('descriere_proiect')}/><br/><br/>
      
      <input type="submit" value="Creeaza test" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/Creeazatest-submit/'+ appState.userId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  })
}
}

class Dashboard extends Component
{
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  return (
    <h1>
      Conectat
    </h1>
  )
}
}

class Proiectteste extends Component
{
constructor (props) {
  super(props)
  this.state = {
    testArray: []
  }
  fetch('/teste/' + this.props.match.params.id_proiect, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({testArray: data})
  })
}

render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  const listaObiecte = this.state.testArray.map((number,index) =>
    <li key={index}><Link to={'/test/' + number.id_test}>{number.name_test}</Link></li>
  );
  return (
    <div>
    <ul>{listaObiecte}</ul>
    </div>
  )
}
}

class Testeditare extends Component
{
constructor (props) {
  super(props)
  this.state = {
    test: null,
    form: {
      numetest: "",
      status: "",
      severitate: "",
      url: ""
    }
  }
  fetch('/test-info/' + this.props.match.params.test_id, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({form: {numetest: data.name_test, status: data.status, severitate: data.severitate, url: data.url}})
  })
}

punereBD = (fieldName) => {
  return (e) => {
    const newForm = {numetest: this.state.form.numetest, status: this.state.form.status, severitate: this.state.form.severitate, url: this.state.form.url}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}

render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  
  
  return (
    <div>
      <form method="post" onSubmit={this.submit}>
      Nume test: <input type="text" name="numetest" placeholder="numele test-ului" value={this.state.form.numetest} onChange={this.punereBD('numetest')}/><br/><br/>
      Status:<br></br>
      <input type="radio" id="MP" name="contact" value="gata" onChange={this.punereBD('status')}/>
      <label htmlFor="gata">gata</label><br></br>

      <input type="radio" id="TST" name="contact" value="in progres" onChange={this.punereBD('status')} />
      <label htmlFor="in progres">in progres</label><br></br>
      <input type="radio" id="TST" name="contact" value="in testare" onChange={this.punereBD('status')} />
      <label htmlFor="in testare">in testare</label><br></br>
      
      Severitate:<br></br>
      <input type="radio" id="MP" name="contact1" value="putin" onChange={this.punereBD('severitate')}/>
      <label htmlFor="putin">putin</label><br></br>

      <input type="radio" id="TST" name="contact1" value="mediu" onChange={this.punereBD('severitate')} />
      <label htmlFor="mediu">mediu</label><br></br>
      <input type="radio" id="TST" name="contact1" value="puternic" onChange={this.punereBD('severitate')} />
      <label htmlFor="puternic">puternic</label><br></br>
      <input type="radio" id="TST" name="contact1" value="critic" onChange={this.punereBD('severitate')} />
      <label htmlFor="puternic">critic</label><br></br>
      
      
      
        URL: <input type="text" name="url" placeholder="url" value={this.state.form.url} onChange={this.punereBD('url')}/><br/><br/>

        Descriere: <input type="text" name="descriere_proiect" placeholder="descriere" onChange={this.punereBD('descriere_proiect')}/><br/><br/>
      
      
      <input type="submit" value="editare test" />
    </form>
    </div>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/editaretest-submit/' + this.props.match.params.test_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  })
}
}

class NotFound extends Component
{
render () {
  return (
    <h1>
      404 Not found
    </h1>
  )
}
}

class App extends Component
{
render() {
    return( <>
    <nav className="horizontal_navbar">
    <ul>
      <li><Link to="/">Acasa</Link></li>
      <li><Link to="/logare">Logare</Link></li>
      <li><Link to="/Inregistrare">Inregistrare</Link></li>
      <li><Link to="/Alemeleproiecte">Proiecte mele</Link></li>
      <li><Link to="/Alteproiecte">Alte proiecte</Link></li>
      <li><Link to="/creeazaproiect">Creeaza proiect</Link></li>
      <li><Link to="/Creeazatest">Creeaza test</Link></li>
    </ul>
    </nav>
    <Routes>
      <Route path="/logare" element={<Logare/>}></Route>
      <Route path="/Inregistrare" element={<Inregistrare/>}></Route>
      <Route path="/Alemeleproiecte" element={<Alemeleproiecte/>}></Route>
      <Route path="/Alteproiecte" element={<Alteproiecte/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/creeazaproiect" element={<Creeazaproiect/>}></Route>
      <Route path="/Creeazatest" element={<Creeazatest/>}></Route>
      <Route path="/proiect/:id_proiect" element={<Proiectteste/>}></Route>
      <Route path="/test/:test_id" element={<Testeditare/>}></Route>
      <Route path="/" index element={<Index/>}></Route>
      <Route element={<NotFound/>}></Route>
    </Routes>
</>
    );
}
}
function initReact() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render( <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>);
  
}
window.onload = initReact;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
