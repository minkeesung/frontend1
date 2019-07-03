import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from '../../actions/project_actions'
import ProjectIndexItem from './project_index_item';
import HeaderCarousel from './header_carousel'
import '../../css/project_index.css'
import { selectAllProjects } from '../../reducers/selectors'

class ProjectIndex extends Component {
  componentDidMount() {
    this.props.fetchProjects()
  }

  render() {
    return (
      <section className="projects-index">
        <HeaderCarousel />
        <div className="projects-index-content">
          <h2>Featured Projects</h2>
          <ul className="projects">
            {this.props.projects.map(
                project => <ProjectIndexItem key={project.id} project={project} />
              )}
          </ul>
        </div>

      </section>
    )
  }
}

const mapStateToProps = state => {
  return { projects: selectAllProjects(state) }
}

export default connect(mapStateToProps, { fetchProjects })(ProjectIndex)
