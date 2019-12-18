import React, { Component } from 'react'
import { Icon, Input, InputNumber, Popover, Button, DatePicker, Upload, Form } from 'antd'
import moment from 'moment'
import CompleteMissionButton from './components/completeMissionButton'
import * as actions from '../../../actions'
import { connect } from 'react-redux'
import { firestore } from '../../../config/constants'

const { TextArea } = Input
const dateFormat = "LL"

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
)

function uploadButtonSuccess(logoUrl) {
  return (<div>
    <img src={logoUrl} alt="logo" />
    <Icon type="sync" />
    <div className="ant-upload-text">Replace</div>
  </div>
  )
}

class Mission1 extends Component {

  constructor(props) {
    super(props)

    this.state = {
      organization: props.organization,
      fileList: [],
      missionComplete: false
    }


    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePreview = this.handlePreview.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
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
    if (organization.currentMission > 1) { this.setState({missionComplete: true})}
  }

  isMissionReadyToBeCompleted() {
    this.props.form.validateFields((errors, values) => {
      if (errors === null) {
        this.setState({missionComplete: true})
      }
    })
  }

  handlePreview(file) {
    this.props.handlePreview(file)
  }

  handleImageChange(e){
    this.props.handleImageChange(e)
  }

  handleSubmit(event) {
    event.preventDefault()
    const newXP = 5 + this.props.xp
    this.props.addXPtoOrg(newXP)
    firestore.collection('organizations').doc(this.props.organization.handle).set({xp: newXP}, { merge: true })
    this.props.saveOrganization()
    this.isMissionReadyToBeCompleted()
  }

  onCompleteMission() {
    const nextMission = this.props.missionNumber + 1
    this.props.completeMission(nextMission, this.props.organization)
  }

  render () {
    const { handleOrgChange, next, handleDate, handleNumShares } = this.props
    const { fileList, organization, missionComplete } = this.state
    const { getFieldDecorator } = this.props.form
    const DEFAULT_LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/equity-token-1.appspot.com/o/orgLogos%2FEQUITY%20TOKEN%20Default%20Avatar.png?alt=media&token=d78e922d-5bca-4821-9bc8-d7a92188db26'

    return (
      <div>
        <div className="blocks mission-steps-container">
          <div className="mission-card-title">Welcome to {organization.basics.legalName || organization.name}!</div>
        </div>

        <div className="mission-input-container">
          <p className="mission-card-title">Company Basics</p>
          <Form.Item
            label="What is the company's legal name?"
            colon={false}
            hasFeedback
          >
            {getFieldDecorator('legalName', {
                initialValue: organization.basics.legalName,
              rules: [{ required: true, message: 'Please fill out this field.' }]
            })(
              <Input placeholder="SpaceX, Inc" onChange={handleOrgChange} onPressEnter={this.handleSubmit} onBlur={this.handleSubmit} name="legalName" />
            )}
          </Form.Item>

          <Form.Item
            label="Describe your company's mission statement"
            colon={false}
            hasFeedback
          >
            {getFieldDecorator('description', {
                initialValue: organization.basics.description,
              rules: [{ required: true, message: 'Please fill out this field.' }]
            })(
              <TextArea placeholder="SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets." autosize={{ minRows: 2 }} onPressEnter={this.handleSubmit} onBlur={this.handleSubmit} onChange={handleOrgChange} name="description" />
            )}
          </Form.Item>

          <Form.Item>
            <label className="registration-label">Upload your company logo</label>
            <br />
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleImageChange}
            >
              {organization.basics.logoUrl !== DEFAULT_LOGO_URL ? uploadButtonSuccess(organization.basics.logoUrl) : uploadButton}
            </Upload>
            <div style={{clear: 'both'}}></div>
          </Form.Item>

        </div>

        <div className="mission-input-container">
          <p className="mission-card-title">Equity Basics</p>
          <p className="float-right">
            <Popover content="This information is provided on your Certificate of Incorporation" trigger="hover">
              <Button><Icon type="info-circle" /></Button>
            </Popover>
          </p>

          <Form.Item
            label="When was your company incorporated?"
            colon={false}
            hasFeedback
          >
            <DatePicker onChange={handleDate} size="large" format={dateFormat} value={moment(organization.basics.dateCreated)} />
          </Form.Item>


          <Form.Item
            label="How many shares of your company have been authorized (per the charter)?"
            colon={false}
            hasFeedback
          >
            {getFieldDecorator('totalShares', {
              initialValue: organization.basics.totalShares,
              rules: [{ required: true, message: 'Please fill out this field.' }]
            })(
              <InputNumber
                min={0}
                placeholder="10,000,000"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={handleNumShares}
                onPressEnter={this.handleSubmit}
                onBlur={this.handleSubmit}
              />
            )}
          </Form.Item>

        </div>

        <div className="blocks mission-steps-container">
          <div className="next-mission-text">
            Continue to "My Equity" and document your ownership.
            <Form style={{float: 'right'}}>
              <CompleteMissionButton isDisabled={!missionComplete} completeMission={this.onCompleteMission} next={next} />
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({missions: {xp, organization}}) {
  return { xp, organization }
}

export default connect(mapStateToProps, actions)(Form.create()(Mission1))
