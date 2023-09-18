import React, { useEffect, useState } from "react";
import CustomQueryBuilder from "./queryBuilder/CustomQueryBuilder";
import { Tab, Tabs } from "react-bootstrap";
import TreeView from "./Treeview";
import Report from "../components/Report";
import axios from "axios";
import ApiEndpoints from "./services/Api";

const Dashboard = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showReport, setShowReportStaus] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [key, setKey] = useState<any>("basic");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };
  const handleClientIdInputChange = (event: any) => {
    const value = event.target.value;
    // Check if the input value is a valid 6-digit number
    if (/^\d{0,6}$/.test(value)) {
      setClientId(value);
    }
  };

  const handleClientClear = () => {
    setClientId("");
    setShowReportStaus(false);
  };

  const treeData = [
    {
      id: 1,
      label: "Client",
      value: "",
      isParentNode: true,
      children: [
        {
          id: 2,
          label: "Client Plan List",
          value: "ClientPlanList",
        },
        {
          id: 3,
          label: "Client Memeber List",
          value: "ClientMemberList",
          children: [
            {
              id: 2,
              label: "Member By Benefit",
              value: "dsa",
            },
            {
              id: 3,
              label: "Member by Location",
              value: "rwerw",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      label: "Member",
      value: "",
      isParentNode: true,
      children: [
        {
          id: 2,
          label: "Member List By Client",
          value: "MemberBenefitList",
        },
        {
          id: 3,
          label: "Memeber List By Benefit",
          value: "ActiveMemberList",
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
      setShowReportStaus(true);
    }, 1500); // Simulating a 2-second loading time
  };
  return (
    <>
      <Tabs
        defaultActiveKey="profile"
        id="fill-tab-example"
        className="nav nav-tabs nav-tabs-bordered mt-3"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="basic" title="Basic">
          <div className="row mt-3">
            <div className="col md-3 col-lg-3">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Choose Report Type</span>
                  <TreeView
                    data={treeData}
                    selectedValue={selectedValue}
                    onChange={handleRadioChange}
                  />
                  {/* <div className="form-group mt-3">                
                    
                  </div> */}
                  <div className="form-group mt-3">
                    <label>Client Id</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter client id"
                        value={clientId}
                        onChange={handleClientIdInputChange}
                      ></input>
                      <button
                        className="input-group-text"
                        id="basic-addon2"
                        onClick={handleClientClear}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleClick}
                    disabled={
                      isLoading || selectedValue === "" || clientId.length < 6
                    }
                  >
                    <i className="bi bi-bar-chart"></i>{" "}
                    {isLoading ? "Generating Report..." : "Get Report"}
                  </button>
                </div>
              </div>
            </div>
            <div className="col md-9 col lg-9">
              {showReport === true && isLoading === false ? (
                <div className="card ">
                  <div className="card-body p-3 float-right">
                    <div className="row">
                      <div className="col-md-10">
                        <h5 className="card-title">
                          Client <span>/Report</span>
                        </h5>
                      </div>
                      <div className="col-md-2 card-title text-end">
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-arrow-bar-down"></i> Export
                        </button>
                      </div>
                    </div>
                    <Report Type={selectedValue} />
                  </div>
                </div>
              ) : (
                <div className="no-record-found">
                  {isLoading ? "Loading report data..." : "No records found."}
                </div>
              )}
            </div>
          </div>
        </Tab>
        <Tab eventKey="advance" title="Advance">
          {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h5>Add Report Filter</h5>
          </div> */}
          <div className="row mt-3">
            <div className="col-md-5">
              <CustomQueryBuilder></CustomQueryBuilder>
            </div>
            <div className="col-md-7">
              <div className="card">
                <div className="card-body">
                  <Report Type={selectedValue} />
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default Dashboard;
