import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Icon, Tooltip } from 'antd'

class CompleteMissionButton extends Component {
  render() {
    const { isDisabled, next, completeMission } = this.props

    return (
      <Route render={({history}) => (
        isDisabled ?
        <Tooltip title="This button will work once the mission requirements are complete.">
          <div className="disabled-submit-button">
            Continue <Icon type="right" />
          </div>
        </Tooltip>
         :
        <div
          onClick={() => { next(history); completeMission()}}
          className="submit-button"
        >
          Continue <Icon type="right" />
        </div>
      )} />
    )
  }
}

export default CompleteMissionButton;
