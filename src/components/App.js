import React, { Component } from 'react'
import NavBar from './nav_bar/nav_bar'
import ProjectIndex from './project_index/project_index'
import { Route, Switch } from 'react-router-dom'
import Categories from './categories/categories'
import CategoryShow from './categories/category_show'
import ProjectFormContainer from './project_form/project_form_container'
import EditFormContainer from './project_form/edit_form_container'
import ProjectShowContainer from './project_show/project_show_container'
import { AuthRoute, ProjectCreateRoute } from '../util/route_util'
import SessionForm from './session_form/session_form'
import '../css/app.scss'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <NavBar />
        </header>
        <Route exact path="/" component={ProjectIndex} />
        <Switch>
          <ProjectCreateRoute exact path="/projects/new" component={ProjectFormContainer} />
          <Route exact path="/projects/:id/edit" component={EditFormContainer} />
          <Route exact path="/projects/:id" component={ProjectShowContainer} />
        </Switch>
        <Route exact path="/categories" component={Categories} />
        <Route exact path="/categories/:id" component={CategoryShow} />
        <AuthRoute path="/login" component={SessionForm} />
        <AuthRoute path="/signup" component={SessionForm} />
      </div>
    );
  }
}

export default App;
