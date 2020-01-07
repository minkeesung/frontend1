import React, { Component } from 'react'
import { STRIPE_LIVE_KEY, firestore } from '../../../config/constants'
import { Card, Form, Tag, List, Avatar, Comment, Icon } from 'antd'
import CheckoutForm from '../../components/CheckoutForm'
import {StripeProvider, Elements, injectStripe } from 'react-stripe-elements'
import CompleteMissionButton from './components/completeMissionButton'
import { connect } from 'react-redux'
import { completeMission } from '../../../actions'

const InjectedCheckoutForm = injectStripe(CheckoutForm)

const gridStyle = {
  width: '50%',
  textAlign: 'center',
}

function StatusItem({ user, inviteUser }) {
  const accountCreated = user.created;
  const notInvited = user.created === false && user.invited === false;
  const invitationSent = user.created === false && user.invited === true;
  const activeFounder = user.founderActive;

  if (activeFounder) {
    return <Tag color={"green"}>{"Account Owner"}</Tag>;
  } else if (accountCreated) {
    return <Tag color={"green"}>{"Invited User"}</Tag>;
  } else if (notInvited) {
    return (
      <span>
        <Tag>{"Not Invited (no charge)"}</Tag>
      </span>
    );
  } else if (invitationSent) {
    return (
      <span>
        <Tag color={"green"}>{"Invited User"}</Tag>
      </span>
    );
  } else {
    return <Tag>{"Not Invited (no charge)"}</Tag>;
  }
}


class Mission7 extends Component {

  constructor(props) {
    super(props)
    this.state = {
      missionComplete: false
    }

    this.onCompleteMission = this.onCompleteMission.bind(this)
    this.isMissionComplete = this.isMissionComplete.bind(this)
  }

  componentDidMount() {
    this.isMissionComplete()
  }

  componentDidUpdate(prevProps) {
    if (this.props.organization !== prevProps.organization) {
      this.isMissionComplete()
    }
  }

  isMissionComplete() {
    if (this.props.organization.currentMission > 5) { this.setState({missionComplete: true})}
    let esta = this
    if (this.props.organization.isPayingCustomer) {
      this.setState({missionComplete: true})
    } else {
      var stripeRef = firestore.collection('stripe_customers')
      var query = stripeRef.where("company", "==", this.props.organization.handle)
      query.get().then(doc => {
        if (!doc.size) {
          esta.setState({missionComplete: false})
        }
      })
    }
  }

  onCompleteMission() {
    const nextMission = this.props.missionNumber + 1
    this.props.completeMission(nextMission, this.props.organization)
  }

  render () {
    const { users, currentUser, organization, cost, next } = this.props
    const { missionComplete } = this.state
    const invitedUsers = users.filter(user => user.invited || user.founderActive)
    const payingUsers = invitedUsers.length || 1
    const price = (cost * payingUsers).toFixed(2)
    const peoples = payingUsers === 1 ? 'user' : 'users'

    const listData = [
      {
        author: 'Manage your cap table',
        avatar: <Avatar shape="square" style={{backgroundColor: '#6C91C2'}} icon="pie-chart" />,
        content: (
          <p>
            Issue equity in real time with one click. Simplify your
            equity with our automated smart contracts.
          </p>
        ),
      },

      {
        author: 'Invite your teammates to join the platform',
        avatar: <Avatar shape="square" style={{color: '#f56a00', backgroundColor: '#fde3cf'}} icon="usergroup-add" />,
        content: (
          <p>
            Teammates can view their own holdings.
          </p>
        ),
      },

      {
        author: 'Tokenize Equity',
        avatar: <Avatar shape="square" style={{backgroundColor: '#545775'}} icon="link" />,
        content: (
          <p>
            Cryptographic certificates &middot; backed up on
            blockchain &middot; automated transactions &middot;
            immutable buy/sell ledger
          </p>
        ),
      },

      {
        author: 'Investor Access',
        avatar: <Avatar shape="square" style={{ backgroundColor: '#87d068' }} icon="fund" />,
        content: (
          <p>
            Be the first to submit your company to Equity Token's private deal flow.
          </p>
        ),
      }]

    return (
      <div>
        <div className="blocks mission-steps-container">
          <p className="mission-card-title">Activate your account</p>
          <div className="mission-input-container margin-top-20">
            {missionComplete ? (
              <p><span aria-label="lock" role="img">🔒</span> Your payment has gone through successfully.</p>
            ) : (
              <StripeProvider apiKey={STRIPE_LIVE_KEY}>
                <Elements>
                  <InjectedCheckoutForm currentUser={currentUser} organization={organization} quantity={payingUsers} price={price} />
                </Elements>
              </StripeProvider>
            )}
          </div>
          <Card type="inner" title="" style={{padding: '5px 10px'}}>
            <List
              className="comment-list"
              header={`Joining as a premium member enables you to...`}
              itemLayout="horizontal"
              dataSource={listData}
              renderItem={item => (
                <li style={{padding: '0 0 5px 0', borderBottom: '1px solid #e8e8e85c'}}>
                  <Comment
                    author={item.author}
                    avatar={item.avatar}
                    content={item.content}
                  />
                </li>
              )}
            />
          </Card>
          <Card
            type="inner"
            title={`$${price} discounted total per month`}
            extra={`Discounted Price of Account: $${cost} x ${payingUsers} invited ${peoples}, per month`}
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
            Continue to "Company Basics" to begin managing your ownership.
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
  return { organization, users: users }
}

export default connect(mapStateToProps, { completeMission })(Mission7)
