import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Form, Card, List, Avatar, Button, Collapse, Empty } from 'antd'
import CompleteMissionButton from './components/completeMissionButton'
import { connect } from 'react-redux'
import { uploadFile } from '../../../actions'
import Uppy from "@uppy/core"
import { Dashboard } from "@uppy/react"
import { completeMission } from '../../../actions'

const Panel = Collapse.Panel

const gridStyle = {
  width: '25%',
  textAlign: 'center',
}

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
}

class UploadDocument extends Component {
  constructor(props) {
    super(props);
    this.uppy = Uppy({ id: "uppy1", autoProceed: true, debug: true });
    this.uppy.on("upload", data => {
      props.uploadFile(data, props.user, this.uppy);
    });
  }
  render() {
    const { name } = this.props.user

    return (
      <div>
        <Card type="inner" title={<span><Avatar src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojidex/112/snow-capped-mountain_1f3d4.png" />&nbsp;&nbsp;{name}</span>}>
          {this.props.user.documents &&
            this.props.user.documents.map(file => {
              return (
                <Card.Grid style={gridStyle}>
                  <a
                    key={file.url}
                    rel="noopener noreferrer"
                    href={file.url}
                    target="_blank"
                  >
                    <p style={{ margin: 10 }}>
                      <Icon type="file" style={{ marginRight: 5 }} />
                      {file.name}
                    </p>
                  </a>
                </Card.Grid>
              );
            })}
          {!this.props.user.documents && (
            <Empty
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              imageStyle={{
                height: 60,
              }}
              description={'No documents have been added yet.'}
            >
            </Empty>
          )}
        </Card>
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        >
          <Panel header={<Button size="small"><Icon type="file-pdf" />{`Add Documents for ${name}`}</Button>} style={customPanelStyle}>
            <Dashboard width={'100%'} height={'270px'} uppy={this.uppy}/>
          </Panel>
        </Collapse>
      </div>
    )
  }
}

class Mission6 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      missionComplete: true
    }
    this.uppy = Uppy({ id: "uppy1", autoProceed: true, debug: true });
    this.uppy.on("upload", data => {
      props.uploadFile(data, props.user);
    });


    this.onCompleteMission = this.onCompleteMission.bind(this)
    this.isMissionComplete = this.isMissionComplete.bind(this)
  }


  componentDidMount() {
    this.isMissionComplete()
  }

  componentDidUpdate() {
    this.isMissionComplete()
  }

  isMissionComplete() {
    console.log('check and see if anything has been uploaded? if so isReadyToBeCompleted = true')
    // TODO 2
  }

  onCompleteMission() {
    const nextMission = this.props.missionNumber + 1
    this.props.completeMission(nextMission, this.props.organization)
  }


  render () {
    const { missionComplete } = this.state
    const { capTableArray, next } = this.props
    return (
      <div>
        <div className="blocks mission-steps-container">
          <p className="mission-card-title">Organize your team's legal documents</p>
          <p>A safe and secure place for all your team files.</p>
          <Card
            type="inner"
            title={<span>You can also go to <Link to="/captable"><Icon type="fund" theme="twoTone" />&nbsp;Equity</Link> and click on name to upload and see everyone's documents.</span>}
          >
            <List
              itemLayout="horizontal"
              dataSource={capTableArray}
              renderItem={user => (
                <List.Item>
                  <List.Item.Meta
                    description={
                      <UploadDocument user={user} uploadFile={this.props.uploadFile}/>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>

        <div className="blocks mission-steps-container">
          <div className="next-mission-text">
            <Form>
              <Link to="/captable">
                <Icon type="pie-chart" theme="twoTone" />&nbsp; Continue to view your company cap table.
                <div className="submit-button">
                  Continue <Icon type="right" />
                </div>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({missions: {organization, users}}){
  return { organization, capTableArray: users }
}

export default connect(mapStateToProps, { uploadFile, completeMission })(Mission6)
