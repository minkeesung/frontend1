import React, { Component } from 'react'
import { List, Avatar, Card, Tag, Button, Icon, Form, Alert } from 'antd'
import CompleteMissionButton from './components/completeMissionButton'
import { connect} from 'react-redux'
import { completeMission } from '../../../actions'

function StatusItem({ user, inviteUser }) {
  const notInvited = user.created === false && user.invited === false;
  const invitationSent = user.created === false && user.invited === true;
  const activeFounder = user.accountOwner;

  if (activeFounder) {
    return <Tag className="not-a-link" color={"green"}>{"Account Owner"}</Tag>;
  } else if (notInvited) {
    return (
      <span>
        <Button
          size="small"
          className="margin-right-5"
          type="primary"
          onClick={() => {
            inviteUser(user);
          }}
        >
          <Icon type="mail" />
          Send invitation
        </Button>
        <Tag className="not-a-link" color={"blue"}>{`${user.email} not invited`}</Tag>
      </span>
    );
  } else if (invitationSent) {
    return (
      <span>
        <Button
          size="small"
          className="margin-right-5"
          onClick={() => {
            inviteUser(user);
          }}
        >
          <Icon type="mail" />
          Resend invitation
        </Button>
        <Tag className="not-a-link" color={"gold"}>{`Invitation sent to ${user.email}`}</Tag>
      </span>
    );
  } else {
    return null;
  }
}

class Mission4 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      missionComplete: true
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
  }

  componentDidMount() {
    this.isMissionComplete(this.props.organization)
  }

  isMissionComplete(organization) {
    if (organization.currentMission > 4) { this.setState({missionComplete: true})}
  }

  onCompleteMission() {
    const nextMission = this.props.missionNumber + 1
    this.props.completeMission(nextMission, this.props.organization)
  }

  render () {
    const { users, next } = this.props
    const { missionComplete } = this.state

    return (
      <div>
        <div className="blocks mission-steps-container">
          <p className="mission-card-title">Give stakeholders access to their equity</p>
          <p>You can invite any of your organization's stakeholders to create an account and log in to view their equity.</p>
          <Alert message=" Each invited user will count as a seat, and the monthly pricing is based on your number of seats." type="info" showIcon />
          <Card
            type="inner"
            title="Invite teammates"
            className="margin-top-20"
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
                        inviteUser={this.props.inviteUser}
                      />}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <div className="blocks mission-steps-container">
          <div className="next-mission-text">
            Continue to Legal documents...
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

export default connect(mapStateToProps, {completeMission})(Mission4)
