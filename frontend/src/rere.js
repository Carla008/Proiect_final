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
    return <h1>RR</h1>
  } else {
   return <h1>FF</h1>
  }
}
}

class Login extends Component
{
constructor (props) {
  super(props)
  this.state = {
    loginSuccess: false,
    form: {
      email: null,
      password: null
    }
  }
}

handleInput = (fieldName) => {
  return (e) => {
    const newForm = {email: this.state.form.email, password: this.state.form.password}
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
      Email: <input type="text" name="email" placeholder="ex: exemplu@mail.com" onChange={this.handleInput('email')} /><br/><br/>
      Parola: <input type="password" name="password" placeholder="parola" onChange={this.handleInput('password')} /><br/><br/>
      <input type="submit" value="Conectare" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

   fetch('/login-submit', {
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

class Register extends Component
{
constructor (props) {
  super(props)
  this.state = {
    form: {
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      birth:null
    }
  }
}

handleInput = (fieldName) => {
  return (e) => {
    const newForm = {firstname: this.state.form.firstname, lastname: this.state.form.lastname, email: this.state.form.email, password: this.state.form.password,birth:this.state.form.birth}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  return (
    <form method="post" onSubmit={this.submit}>
      Prenume: <input type="text" name="firstname" placeholder="prenume" onChange={this.handleInput('firstname')} /><br/><br/>
      Nume: <input type="text" name="lastname" placeholder="nume" onChange={this.handleInput('lastname')} /><br/><br/>
      Email: <input type="text" name="email" placeholder="ex: exemplu@mail.com" onChange={this.handleInput('email')} /><br/><br/>
      Parola: <input type="password" name="password" placeholder="parola" onChange={this.handleInput('password')} /><br/><br/>
      B: <input type="date" name="birth" placeholder="parola" onChange={this.handleInput('birth')} /><br/><br/>
      <input type="submit" value="Inregistrare" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/register-submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  })
}
}

class MyProjects extends Component
{
constructor (props) {
  super(props)
  this.state = {
    projectArray: []
  }
  fetch('/myprojects/' + appState.userId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({projectArray: data})
  })
}

render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/login" />)
  }
  
  const listItems = this.state.projectArray.map((number,index) =>
    <li key={index}><Link to={'/project/' + number.project_id}>{number.name_project}</Link></li>
  );
  return (
    <div>
    <ul>{listItems}</ul>
    </div>
  )
}
}

class OtherProjects extends Component
{
constructor (props) {
  super(props)
  this.state = {
    projectArray: []
  }
  fetch('/otherprojects/' + appState.userId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({projectArray: data})
  })
}

joinProject = (project_id) => {
  return (e) => {
    fetch('/joinproject/' + project_id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user_id: appState.userId})
  })
      
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/login" />)
  }
  
  const listItems = this.state.projectArray.map((number,index) =>
    <li key={index}>{number.name_project} <a href="#" onClick={this.joinProject(number.project_id)}>Join project</a></li>
  );
  return (
    <div>
    <ul>{listItems}</ul>
    </div>
  )
}
}

class CreateProject extends Component
{
constructor (props) {
  super(props)
  this.state = {
    form: {
      projectname: null,
      repourl: null
    }
  }
}

handleInput = (fieldName) => {
  return (e) => {
    const newForm = {projectname: this.state.form.projectname, repourl: this.state.form.repourl}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/login" />)
  }
  return (
    <form method="post" onSubmit={this.submit}>
      Project name: <input type="text" name="projectname" placeholder="numele proiectului" onChange={this.handleInput('projectname')} /><br/><br/>
      Repository URL: <input type="text" name="repourl" placeholder="link-ul catre repository" onChange={this.handleInput('repourl')} /><br/><br/>
      
      <input type="submit" value="Create project" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/createproject-submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.form)
  })
}
}

class CreateTicket extends Component
{
constructor (props) {
  super(props)
  this.state = {
    projectArray: [],
    form: {
      ticketname: null,
      project_id: null,
      status: null,
      severity: null,
      commit_url: null
    }
  }
  fetch('/myprojects/' + appState.userId, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({projectArray: data})
  })
}

handleInput = (fieldName) => {
  return (e) => {
    const newForm = {ticketname: this.state.form.ticketname, project_id: this.state.form.project_id, status: this.state.form.status, severity: this.state.form.severity, commit_url: this.state.form.commit_url}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}
render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/login" />)
  }
  
  const listItems = this.state.projectArray.map((number,index) =>
    <option value={number.project_id} key={index}>{number.name_project}</option>
  );
  return (
    <form method="post" onSubmit={this.submit}>
      Ticket name: <input type="text" name="ticketname" placeholder="numele ticket-ului" onChange={this.handleInput('ticketname')}/><br/><br/>
     
      <select onChange={this.handleInput('project_id')}> <option>choose project</option>{listItems}</select> <br/><br/>
      <select onChange={this.handleInput('status')}> 
        <option>done</option>
        <option>in progress</option>
        <option>in testing</option>
      </select> <br/><br/>
      
      <select onChange={this.handleInput('severity')}> 
        <option>low</option>
        <option>medium</option>
        <option>high</option>
        <option>critical</option>
        <option>hotfix</option>
      </select> <br/><br/>
      
       Commit URL: <input type="text" name="commit_url" placeholder="url" onChange={this.handleInput('commit_url')}/><br/><br/>
      
      
      
      <input type="submit" value="Create ticket" />
    </form>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/createticket-submit/'+ appState.userId, {
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
    return (<Navigate to="/login" />)
  }
  return (
    <h1>
      Conectat
    </h1>
  )
}
}

class ProjectTickets extends Component
{
constructor (props) {
  super(props)
  this.state = {
    ticketArray: []
  }
  fetch('/tickets/' + this.props.match.params.project_id, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({ticketArray: data})
  })
}

render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/login" />)
  }
  const listItems = this.state.ticketArray.map((number,index) =>
    <li key={index}><Link to={'/ticket/' + number.id_ticket}>{number.name_ticket}</Link></li>
  );
  return (
    <div>
    <ul>{listItems}</ul>
    </div>
  )
}
}

class TicketEdit extends Component
{
constructor (props) {
  super(props)
  this.state = {
    ticket: null,
    form: {
      ticketname: "",
      status: "",
      severity: "",
      commit_url: ""
    }
  }
  fetch('/ticket-info/' + this.props.match.params.ticket_id, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json()
  }).then((data) => {
      this.setState({form: {ticketname: data.name_ticket, status: data.status, severity: data.severity, commit_url: data.commit_url}})
  })
}

handleInput = (fieldName) => {
  return (e) => {
    const newForm = {ticketname: this.state.form.ticketname, status: this.state.form.status, severity: this.state.form.severity, commit_url: this.state.form.commit_url}
    newForm[fieldName] = e.target.value
    this.setState({form: newForm})
  }
}

render () {
  if (!appState.loggedIn) {
    return (<Navigate to="/login" />)
  }
  
  
  return (
    <div>
      <form method="post" onSubmit={this.submit}>
      Ticket name: <input type="text" name="ticketname" placeholder="numele ticket-ului" value={this.state.form.ticketname} onChange={this.handleInput('ticketname')}/><br/><br/>
      <select value={this.state.form.status} onChange={this.handleInput('status')}> 
        <option value="done">done</option>
        <option value="in progress">in progress</option>
        <option value="in testing">in testing</option>
      </select> <br/><br/>
      
      <select value={this.state.form.severity} onChange={this.handleInput('severity')}> 
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
        <option value="critical">critical</option>
        <option value="hotfix">hotfix</option>
      </select> <br/><br/>
      
       Commit URL: <input type="text" name="commit_url" placeholder="url" value={this.state.form.commit_url} onChange={this.handleInput('commit_url')}/><br/><br/>
      
      <input type="submit" value="Edit ticket" />
    </form>
    </div>
  )
}
submit = (e) => {
  e.preventDefault();
  console.log('submitted')

  fetch('/editticket-submit/' + this.props.match.params.ticket_id, {
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
    <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/myprojects">My Projects</Link></li>
      <li><Link to="/otherprojects">Other Projects</Link></li>
      <li><Link to="/createproject">Create Project</Link></li>
      <li><Link to="/createticket">Create Ticket</Link></li>
    </ul>
    </nav>
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/myprojects" element={<MyProjects/>}></Route>
      <Route path="/otherprojects" element={<OtherProjects/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/createproject" element={<CreateProject/>}></Route>
      <Route path="/createticket" element={<CreateTicket/>}></Route>
      <Route path="/project/:project_id" element={<ProjectTickets/>}></Route>
      <Route path="/ticket/:ticket_id" element={<TicketEdit/>}></Route>
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