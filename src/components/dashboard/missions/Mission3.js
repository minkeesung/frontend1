import React, { Component } from 'react'
import { Icon, Form, Tag, Card, List, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import CompleteMissionButton from './components/completeMissionButton'
import CreateStakeholderForm from '../../components/CreateStakeholderForm'
import { connect } from 'react-redux'
import { completeMission } from '../../../actions'

function StatusItem({ user }) {
  return (
    <Tag color={"green"}>{moment(user.dateIssued).format("MMM Do, YYYY")}</Tag>
  );
}


class Mission3 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      missionComplete: true,
      users: []
    }
    this.onCompleteMission = this.onCompleteMission.bind(this)
    this.isMissionComplete = this.isMissionComplete.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!this.state.missionComplete && this.props.organization !== prevProps.organization) {
      this.setState({organization: this.props.organization}, () => {
        this.isMissionComplete(this.props.organization)
      })
    }

    if (this.props.users !== prevProps.users) {
      this.setState({users: this.props.users})
    }
  }

  componentDidMount() {
    this.isMissionComplete(this.props.organization)
    this.setState({users: this.props.users})
  }

  isMissionComplete(organization) {
    if (organization.currentMission > 3) { this.setState({missionComplete: true})}
  }

  onCompleteMission() {
    const nextMission = this.props.missionNumber + 1
    this.props.completeMission(nextMission, this.props.organization)
  }

  render () {
    const { next } = this.props
    const { missionComplete, users } = this.state

    return (
      <div>
        <div className="blocks mission-steps-container">
          <div className="mission-card-title">
            Add the rest of your team to the Cap Table
          </div>

          <div className="form-group margin-top-20">
            <CreateStakeholderForm />
          </div>

          <div className="margin-top-20">
            <Card
              type="inner"
              title="Added teammates"
              extra={<span><span>Full captable:&nbsp;&nbsp;</span><Link to='/captable'><Icon type='fund' theme='twoTone' />&nbsp;Equity</Link></span>}
            >
              <List
                itemLayout="horizontal"
                dataSource={users}
                renderItem={user => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojidex/112/snow-capped-mountain_1f3d4.png" />}
                      title={user.personName || user.name}
                      description={
                        <StatusItem
                          user={user}
                        />}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </div>

        <div className="blocks mission-steps-container">
          <div className="next-mission-text">
            Continue to "Invite Teammates" and add more members.
            <Form style={{float: 'right'}}>
              <CompleteMissionButton isDisabled={!missionComplete} completeMission={this.onCompleteMission} next={next} />
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({missions: {organization, users}}){
  return { organization, users }
}

export default connect(mapStateToProps, {completeMission})(Mission3)
