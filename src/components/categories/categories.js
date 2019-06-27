import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectAllCategories } from '../../reducers/selectors'
import { fetchCategories } from '../../actions/category_actions'
import { Link } from 'react-router-dom';
import '../../css/categories.scss'

class Categories extends Component {
  componentDidMount() {
    this.props.fetchCategories();
  }

  render() {
    return (
      <section className="categories">
        <h2>Categories</h2>
        <ul>
          {this.props.categories.map(category =>
            <li value={category.id} key={category.id}>
              <Link to={`/categories/${category.id}`}>{category.name}</Link>
            </li>
          )}
        </ul>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return { categories: selectAllCategories(state)}
}

export default connect(mapStateToProps, { fetchCategories })(Categories)
