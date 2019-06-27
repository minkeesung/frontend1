import React, { Component } from 'react';
import ProjectIndexItem from '../project_index/project_index_item';
import { fetchCategoryProjects } from '../../actions/category_actions'
import { connect } from 'react-redux'

class CategoryShow extends Component {
  componentDidMount() {
    this.props.fetchCategoryProjects(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match.params.id !== newProps.match.params.id) {
      this.props.fetchCategoryProjects(newProps.match.params.id);
    }
  }

  render() {
    if (this.props.category) {
      return (
        <section className="category-show">
          <div className="category-show-content">
            <h2 className="category-show-header">
              <span className="category-show-name">{this.props.category.name}</span>
              &nbsp;
              projects
            </h2>
            <ul className="projects">
              {this.props.projects.map(
                project => <ProjectIndexItem key={project.id} project={project} />
              )}
            </ul>
          </div>
        </section>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const category = state.categories[ownProps.match.params.id];
  let projects = [];

  if (category && category.project_ids) {
    projects = category.project_ids.map(projectId => state.projects[projectId]);
  }

  return { category, projects };
}

export default connect(mapStateToProps, { fetchCategoryProjects })(CategoryShow)
