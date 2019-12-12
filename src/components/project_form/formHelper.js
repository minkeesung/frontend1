import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'

class App extends Component {
	componentDidMount() {
		this.props.fetchUser()
	}

	render() {
		return (
			<BrowserRouter>
				<div className="container">
					<a href="/auth/google">log in</a>
				</div>
			</BrowserRouter>
		)
	}
}

export default connect(null, actions)(App)
