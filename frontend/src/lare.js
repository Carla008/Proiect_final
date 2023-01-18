import  {Outlet, Navigate,Link } from 'react-router-dom'
import React, { Component } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const appState = {
loggedIn: false,
utilizatorId: null
}
class Index extends Component
{
render() {
  
  if (appState.loggedIn) {
    return <h1>Bugtrack</h1>;
  } else {
    return <h1>Bugtrack</h1>;
  }
}
}

class Logare extends Component
{
constructor (props) {
  super(props)
  this.state = {
    LogareSuccess: false,
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
  if (this.state.LogareSuccess || appState.loggedIn) {
    return (<Navigate to="/dashboard" />)
  }
  return (
    <form method="post" onSubmit={this.submit}>
      Utilizator <input type="text" name="utilizator" placeholder="utilizator" onChange={this.punereBD('email')} /><br/><br/>
      Parola: <input type="password" name="parola" placeholder="parola" onChange={this.punereBD('parola')} /><br/><br/>
      <input type="submit" value="Conectare" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

   fetch('/Logare-submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  }).then(function (response) {
    return response.json()
  }).then((data) => {
    if (data.LogareSuccess) {
      appState.loggedIn = true
      appState.utilizatorId = data.utilizatorId
      this.setState({LogareSuccess: true})
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
    const newForm = {nume: this.state.form.nume, prenume: this.state.form.prenume, email: this.state.form.email, parola: this.state.form.parola}
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
      Zi de nastere: <input type="date" name="date" onChange={this.punereBD('nastere')} /><br/><br/>
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
  fetch('/Alemeleproiecte/' + appState.utilizatorId, {
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
    <li key={index}><Link to={'/proiect/' + number.proiect_id}>{number.nume_proiect}</Link></li>
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
  fetch('/Alteproiecte/' + appState.utilizatorId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({proiectArray: data})
  })
}

joinproiect = (proiect_id) => {
  return (e) => {
    fetch('/joinproiect/' + proiect_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({utilizator_id: appState.utilizatorId})
  })
      
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  
  const listaObiecte = this.state.proiectArray.map((number,index) =>
    <li key={index}>{number.nume_proiect} <a href="#" onClick={this.joinproiect(number.proiect_id)}>Inscriere proiect</a></li>
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

  fetch('/Creeazaproiect-submit', {
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
      proiect_id: null,
      status: null,
      gravitate: null,
      url: null
    }
  }
  fetch('/Alemeleproiecte/' + appState.utilizatorId, {
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
    const newForm = {numetest: this.state.form.numetest, proiect_id: this.state.form.proiect_id, status: this.state.form.status, gravitate: this.state.form.gravitate, url: this.state.form.url}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/Logare" />)
  }
  
  const listaObiecte = this.state.proiectArray.map((number,index) =>
    <option value={number.proiect_id} key={index}>{number.nume_proiect}</option>
  );
  return (
    <form method="post" onSubmit={this.submit}>
      test name: <input type="text" name="numetest" placeholder="numele test-ului" onChange={this.punereBD('numetest')}/><br/><br/>
     
      <select onChange={this.punereBD('proiect_id')}> <option>choose proiect</option>{listaObiecte}</select> <br/><br/>
      <select onChange={this.punereBD('status')}> 
        <option>done</option>
        <option>in progress</option>
        <option>in testing</option>
      </select> <br/><br/>
      
      <select onChange={this.punereBD('gravitate')}> 
        <option>low</option>
        <option>medium</option>
        <option>high</option>
        <option>critical</option>
        <option>hotfix</option>
      </select> <br/><br/>
      
       Commit URL: <input type="text" name="url" placeholder="url" onChange={this.punereBD('url')}/><br/><br/>
      
      
      
      <input type="submit" value="Creeaza test" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/Creeazatest-submit/'+ appState.utilizatorId, {
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
  fetch('/teste/' + this.props.match.params.proiect_id, {
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
      gravitate: "",
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
      this.setState({form: {numetest: data.name_test, status: data.status, gravitate: data.gravitate, url: data.url}})
  })
}

punereBD = (fieldName) => {
  return (e) => {
    const newForm = {numetest: this.state.form.numetest, status: this.state.form.status, gravitate: this.state.form.gravitate, url: this.state.form.url}
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
      <select value={this.state.form.status} onChange={this.punereBD('status')}> 
        <option value="done">done</option>
        <option value="in progress">in progress</option>
        <option value="in testing">in testing</option>
      </select> <br/><br/>
      
      <select value={this.state.form.gravitate} onChange={this.punereBD('gravitate')}> 
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
        <option value="critical">critical</option>
        <option value="hotfix">hotfix</option>
      </select> <br/><br/>
      
        URL: <input type="text" name="url" placeholder="url" value={this.state.form.url} onChange={this.punereBD('url')}/><br/><br/>
      
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
      <li><Link to="/Logare">Logare</Link></li>
      <li><Link to="/Inregistrare">Inregistrare</Link></li>
      <li><Link to="/Alemeleproiecte">Proiecte mele</Link></li>
      <li><Link to="/Alteproiecte">Alte proiecte</Link></li>
      <li><Link to="/Creeazaproiect">Creeaza proiect</Link></li>
      <li><Link to="/Creeazatest">Creeaza test</Link></li>
    </ul>
    </nav>
    <Routes>
      <Route path="/Logare" element={<Logare/>}></Route>
      <Route path="/Inregistrare" element={<Inregistrare/>}></Route>
      <Route path="/Alemeleproiecte" element={<Alemeleproiecte/>}></Route>
      <Route path="/Alteproiecte" element={<Alteproiecte/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/Creeazaproiect" element={<Creeazaproiect/>}></Route>
      <Route path="/Creeazatest" element={<Creeazatest/>}></Route>
      <Route path="/proiect/:proiect_id" element={<Proiectteste/>}></Route>
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
