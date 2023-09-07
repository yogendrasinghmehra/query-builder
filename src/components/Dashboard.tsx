import React, { useState } from 'react'
import CustomQueryBuilder from './queryBuilder/CustomQueryBuilder'
import { Tab, Tabs } from 'react-bootstrap'
import TreeView from './Treeview';
import Report from "../components/Report";

const Dashboard = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReportStaus] = useState(false);
  const [key, setKey] = useState<any>('basic');

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const treeData = [
    {
      id: 1,
      label: 'Client',
      value: '',
      isParentNode: true,
      children: [
        {
          id: 2,
          label: 'Client Plan List',
          value: 'ClientPlanList',
        },
        {
          id: 3,
          label: 'Client Memeber List',
          value: 'ClientMemberList',
          children: [
            {
              id: 2,
              label: 'Member By Benefit',
              value: 'dsa',
            },
            {
              id: 3,
              label: 'Member by Location',
              value: 'rwerw'
              
            },
          ]
          
        },
      ]
    },
    {
      id: 5,
      label: 'Member',
      value: '',
      isParentNode: true,
      children: [
        {
          id: 2,
          label: 'Member Benefit List',
          value: 'MemberBenefitList',
        },
        {
          id: 3,
          label: 'Active Memeber List',
          value: 'ActiveMemberList'
        },
      ],
    },
  ];

  const handleClick = () => {
    // Simulate an asynchronous operation (e.g., API request) here
    setIsLoading(true);

    // After the operation is complete (e.g., API response received), set isLoading to false
    setTimeout(() => {
      setIsLoading(false);
      setShowReportStaus(true)
    }, 1500); // Simulating a 2-second loading time
  };

  return (
    <>
      <Tabs
        defaultActiveKey="profile"
        id="fill-tab-example"
        className="nav nav-tabs nav-tabs-bordered mt-3"
        
        activeKey={key}
        onSelect={(k) => setKey(k)}>
        <Tab eventKey="basic" title="Basic">
          <TreeView data={treeData}
            selectedValue={selectedValue}
            onChange={handleRadioChange} />
          <hr />
          <div className="text-center">
            <button
              className='btn btn-primary'
              onClick={handleClick}
              disabled={isLoading || selectedValue === ''}><i className="bi bi-bar-chart"></i> {isLoading ? 'Generating Report...' : 'Get Report'}</button>

          </div>
          {showReport === true && isLoading === false?  
          <div className="card mt-3">
            <div className='card-body p-3 float-right'>
            <h5 className="card-title">Client <span>/Report</span></h5>
            <Report />
            </div>
          </div> : '' }
         
        </Tab>
        <Tab eventKey="advance" title="Advance">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h5>Add Report Filter</h5>
          </div>
          <CustomQueryBuilder></CustomQueryBuilder>
        </Tab>
      </Tabs>


    </>
  )
}

export default Dashboard
