import React, { Component } from "react"
import CreateStakeholderForm from '../components/CreateStakeholderForm'
import StockTypeTag from '../components/StockTypeTag'
import AccountStatusItem from '../components/AccountStatusItem'
import { Table, Tag, Button, Icon } from "antd"
import { formatNumber } from "../../config/constants"
import Uppy from "@uppy/core"
import { connect } from 'react-redux'
import { uploadFile } from '../../actions'
import UserProfile from './UserProfile'
import Chart from "react-google-charts"

class Captable extends Component {
  constructor(props) {
    super(props);
    this.uppy = Uppy({ id: "uppy1", autoProceed: true, debug: true });
    this.uppy.on("upload", data => {
      props.uploadFile(data, this.state.profile, this.uppy);
    })
    this.onClickRow = this.onClickRow.bind(this);
    this.prepareCaptableArray = this.prepareCaptableArray.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.state = {
      visible: false,
      profile: {},
      formVisible: false,
      captableUsersWithOwnership: [],
      userStocks: [],
      userConvertibles: [],
      totalShares: 0,
      pieChartData: []
    };
  }

  toggleForm() {
    this.setState({formVisible: !this.state.formVisible})
  }

  componentDidUpdate(prevProps) {
    if (this.props.users !== prevProps.users) {
      this.prepareCaptableArray()
    }

    if (this.props.captableUsers !== prevProps.captableUsers) {
     this.prepareCaptableArray()
    }

    if (this.props.organization.stocks !== prevProps.organization.stocks) {
     this.prepareCaptableArray()
    }
  }

  componentDidMount() {
    this.prepareCaptableArray()
  }

  componentWillUnmount() {
    this.uppy.close();
  }

  onClose() {
    this.setState({ visible: false });
  }

  onClickRow(e, record) {
    this.setState({ profile: record, visible: true });
  }

  prepareCaptableArray() {
    let captableUsersWithOwnership = this.props.captableUsers.filter(user => { return user.stocks.length > 0 })
    let totalShares = 0
    captableUsersWithOwnership.forEach(user => {
      if (user.totalSharesIssued) { totalShares += user.totalSharesIssued }
    })
    this.setState({totalShares})
    captableUsersWithOwnership.forEach(user => {
      const percentageOwnership = (user.totalSharesIssued / totalShares) || ''
      user.percentageOwnership = percentageOwnership.toLocaleString('en-us', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
    })
    const pieChartData = this.formatDataForPieChart(captableUsersWithOwnership)
    const userStocks = this.formatDataForUserStocks(captableUsersWithOwnership, ['commonStock', 'stock'])
    const userConvertibles = this.props.organization.stocks.filter(stock => { return ['convertibleInstrument'].indexOf(stock.stockType) > -1 })
    this.setState({captableUsersWithOwnership})
    this.setState({pieChartData})
    this.setState({userStocks})
    this.setState({userConvertibles})
  }

  formatDataForUserStocks(captableUsersWithOwnership, holdingsArr) {
    let userStocks = []
    captableUsersWithOwnership.forEach(user => {
      let securities =  user.stocks.filter(stock => { return holdingsArr.indexOf(stock.stockType) > -1 })
      if (securities.length > 0) {
        user.stocks = securities
        userStocks.push(user)
      }
    })
    // sort by percentageOwnership
    return userStocks.sort((a,b) => (parseFloat(a.percentageOwnership) < parseFloat(b.percentageOwnership)) ? 1 : ((parseFloat(b.percentageOwnership) < parseFloat(a.percentageOwnership)) ? -1 : 0))
  }

  formatDataForPieChart(captableUsersWithOwnership) {
    let pieChartData = captableUsersWithOwnership
      .filter(user => { return user.percentageOwnership })
      .sort((a,b) => (a.percentageOwnership < b.percentageOwnership) ? 1 : ((b.percentageOwnership < a.percentageOwnership) ? -1 : 0))
      .map(user => { return [`${user.name} (${user.percentageOwnership})`, parseFloat(user.percentageOwnership)] })
    pieChartData.unshift(['Name', 'Percentage Ownership'])
    return pieChartData
  }

  render() {
    const { captableUsersWithOwnership, userStocks, userConvertibles } = this.state

    userStocks.map((row, index) => {
      row.key = index;
      return row;
    })

    userConvertibles.map((row, index) => {
      row.key = index;
      return row;
    })

    const userStocksColumns = [
      {
        title: "Name",
        width: 250,
        dataIndex: "name",
        key: "0",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span className="subtle-link bold">{value || "~~"}</span>,
        fixed: "left"
      },
      {
        title: "Account Status",
        dataIndex: "status",
        key: "1",
        render: (value, record, rowIndex) => (
          <span>
            {(
              <AccountStatusItem
                rowIndex={rowIndex}
                columns={captableUsersWithOwnership}
                inviteUser={this.props.inviteUser}
              />
            ) || "~~"}
          </span>
        )
      },
      {
        title: "Securities",
        dataIndex: "stockTypes",
        key: "2",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{<StockTypeTag type={value} /> || "~~"}</span>
      },
      {
        title: "Common Shares",
        dataIndex: "sumCommonSharesIssued",
        key: "3",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{`${formatNumber(value)}`|| "~~"}</span>
      },
      {
        title: "Capital Contribution",
        dataIndex: "sumCapitalContribution",
        key: "4",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{`$${formatNumber(value)}`|| "~~"}</span>
      },
      {
        title: "Ownership",
        key: "5",
        dataIndex: "percentageOwnership",
        fixed: "right",
        render:  value => <span>{value || "~~"}</span>
      }
    ]

    const userConvertiblesColumns = [
      {
        title: "Name",
        width: 250,
        dataIndex: "name",
        key: "0",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span className="subtle-link bold">{value || "~~"}</span>,
        fixed: "left"
      },
      {
        title: "Account Status",
        dataIndex: "status",
        key: "1",
        render: (value, record, rowIndex) => (
          <span>
            {(
              <AccountStatusItem
                rowIndex={rowIndex}
                columns={captableUsersWithOwnership}
                inviteUser={this.props.inviteUser}
              />
            ) || "~~"}
          </span>
        )
      },
      {
        title: "Type",
        dataIndex: "stockType",
        key: "2",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{<StockTypeTag type={value} /> || "~~"}</span>
      },
      {
        title: "Principal Amount",
        dataIndex: "principal",
        key: "3",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{`$${formatNumber(value)}`|| "~~"}</span>
      },
      {
        title: "Interest Rate",
        dataIndex: "interest",
        key: "4",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{`${value.toFixed(2)}%` || "~~"}</span>
      },
      {
        title: "Valuation Cap",
        dataIndex: "valuationCap",
        key: "5",
        onCell: record => {
          return {
            onClick: event => {
              this.onClickRow(event, record);
            }
          };
        },
        render: value => <span>{`$${formatNumber(value)}`|| "~~"}</span>
      },
      {
        title: "Discount",
        key: "6",
        dataIndex: "conversionDiscount",
        render:  value => <span>{`${value.toFixed(2)}%` || "~~"}</span>
      }
    ]

    return (
      <div>
        <div className="form-group">
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 10}}>
            <Button type="primary" onClick={this.toggleForm}><Icon type="user-add" /> Add new stakeholder</Button>
          </div>
          { this.state.formVisible && (
            <CreateStakeholderForm />
          )}
        </div>

        <div className="blocks mission-steps-container margin-top-20">
          <p className="mission-card-title">Ownership Breakdown</p>
            <Chart
             chartType="PieChart"
             width="100%"
             height="400px"
             data={this.state.pieChartData}
             options={{is3D: true, backgroundColor: '#f8f8ff'}}
            />
        </div>

        <div className="blocks mission-steps-container margin-top-20">
          <p className="mission-card-title">Securities</p>
          <Table
            columns={userStocksColumns}
            dataSource={userStocks}
            locale={{ emptyText: "No securities have been added to your cap table yet." }}
            scroll={{ x: 1300 }}
            pagination={false}
          />
        </div>

        <div className="blocks mission-steps-container margin-top-20">
          <p className="mission-card-title">Convertible Notes</p>
          <Table
            columns={userConvertiblesColumns}
            dataSource={userConvertibles}
            locale={{ emptyText: "No convertible instruments have been added to your cap table yet." }}
            scroll={{ x: 1300 }}
            pagination={false}
          />
        </div>

        <UserProfile
          onClose={this.onClose}
          visible={this.state.visible}
          profile={this.state.profile}
          uppy={this.uppy}
        />
      </div>
    );
  }
}

function mapStateToProps({ missions: {users, organization, captableUsers }}){
  return { users: users, organization, captableUsers }
}

export default connect(mapStateToProps, { uploadFile })(Captable)
