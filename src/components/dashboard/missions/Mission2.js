import React, { Component } from 'react'
import { Form, Alert, Card, List, Avatar } from 'antd'
import { connect } from 'react-redux'
import StockTypeTag from '../../components/StockTypeTag'
import CreateStakeholderForm from '../../components/CreateStakeholderForm'
import CompleteMissionButton from './components/completeMissionButton'
import { completeMission } from '../../../actions'

class Mission2 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      missionComplete: false,
      users: []
    }
    this.onCompleteMission = this.onCompleteMission.bind(this)
    this.isMissionComplete = this.isMissionComplete.bind(this)
  }

  isMissionComplete(organization, capTableArray) {
    if (organization.currentMission > 2 || capTableArray.length > 0) { this.setState({missionComplete: true})}
  }

  componentDidUpdate(prevProps) {
    if (!this.state.missionComplete && this.props.organization !== prevProps.organization) {
      this.setState({organization: this.props.organization}, () => {
        this.isMissionComplete(this.props.organization, this.props.capTableArray)
      })
    }
    if (!this.state.missionComplete && this.props.capTableArray.length !== prevProps.capTableArray.length) {
      this.isMissionComplete(this.props.organization, this.props.capTableArray)
    }
  }

  componentDidMount() {
    this.isMissionComplete(this.props.organization, this.props.capTableArray)
  }

  onCompleteMission() {
    const nextMission = this.props.missionNumber + 1
    this.props.completeMission(nextMission, this.props.organization)
  }

  render () {
    const { organization, currentUser, next, capTableArray } = this.props
    const { missionComplete } = this.state
    return (
      <div>
        <div className="blocks mission-steps-container">
          <p className="mission-card-title">Add each team member to the {organization.basics.legalName || organization.name} Cap Table</p>
          <p>Let's track everyone's equity...</p>
          <Alert message=" A cap table is legal record that shows capitalization, otherwise known as ownership stakes, in a company.
          Ownership can come in the form of equity shares, preferred shares, options and more." type="info" showIcon />
        </div>
        <div className="form-group">
          <CreateStakeholderForm />
        </div>

        <Card
          type="inner"
          title={`${organization.name} teammates`}
        >
          <List
            itemLayout="horizontal"
            dataSource={capTableArray}
            renderItem={user => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojidex/112/snow-capped-mountain_1f3d4.png" />}
                  title={user.personName || user.name}
                  description={<StockTypeTag type={user.stockTypes || ''} />}
                />
              </List.Item>
            )}
          />
        </Card>

        <div className="blocks mission-steps-container">
          <div className="next-mission-text">
            Continue on to invite your teammates to the platform.
            <Form style={{float: 'right'}}>
              <CompleteMissionButton isDisabled={!missionComplete} completeMission={this.onCompleteMission} next={next} />
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({missions: {users, organization}}){
  return {capTableArray: users, organization}
}

export default connect(mapStateToProps, {completeMission})(Mission2)
