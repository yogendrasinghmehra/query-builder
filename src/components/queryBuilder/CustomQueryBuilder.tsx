import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { QueryBuilder, RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";

import MultiSelectDropdown from "../MultiSelect";
import ApiEndpoints from "../services/Api";
import { DBServer, Database, DbField, DbTables, Option } from "../types/Common";
import axios from "axios";
import { Accordion, Badge, Stack } from "react-bootstrap";

//#region component types

const initialQuery: RuleGroupType = {
  combinator: "and",
  rules: [],
};

//#endregion

const CustomQueryBuilder = () => {
  //#region hooks sections
  const [serverList, setServerList] = useState<DBServer[]>([]);
  const [databaseList, setDataBaseList] = useState<Database[]>([]);
  const [dbTableList, setDBTableList] = useState<DbTables[]>([]);
  // const [dbFields, setDbFields] = useState<DbField[]>([]);
  const [options, setOptions] = useState<DbField[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [selectedOptions, setSelectedOptions] = useState<DbField[]>([]);

  //#endregion

  //#region methods
  const handleQueryChange = (q: any) => {
    setQuery(q);
  };
  const handleMultiSelectChange = (newSelectedOptions: DbField[]) => {
    console.log(newSelectedOptions);
    setSelectedOptions(newSelectedOptions);
    // setDbFields([
    //   ...dbFields.filter((f) => newSelectedOptions.includes(f)),
    // ]);
  };

  const handleServerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDataBaseList([]);
    setDBTableList([]);
    //setDbFields([]);
    getDataBaseList(event.target.value);
  };

  const handleDbChange = (db: any) => {
    const dbName = db.target.value;
    setSelectedDb(dbName);
    setDBTableList([]);
    //setDbFields([]);
    getDBTableList(db.target.value);
  };
  const handleTableChange = (table: any) => {
    setSelectedTable(table.target.value);
    //setDbFields([]);
    getColumnsList(table.target.value);
  };

  // getting server list
  const getServerList = () => {
    axios.get("/data/server.json").then((res) => {
      setServerList(res.data);
    });
  };
  //getting database list
  const getDataBaseList = (serverId: string) => {
    axios.get("/data/databases.json").then((res) => {
      const dbList: Database[] = res.data;
      const filterDbList = dbList.filter((d) => d.serverId === serverId);
      setDataBaseList(filterDbList);
    });
  };

  //getting database table list
  const getDBTableList = (dbId: string) => {
    axios.get("/data/dbTables.json").then((res) => {
      const tableList: DbTables[] = res.data;
      const filterData = tableList.filter((t) => t.databaseId === dbId);
      setDBTableList(filterData);
    });
  };

  //getting database column list
  const getColumnsList = (tableId: string) => {
    axios.get("/data/db-fields.json").then((res) => {
      // setDbFields([...res.data.filter((f: any) => f.tableId === tableId)]);

      const opt = [...res.data.filter((f: any) => f.tableId === tableId)];
      setOptions(opt);
    });
  };

  //#endregion

  // useEffect(() => {
  //   const apiUrl = ApiEndpoints.getAll().then((res) => {
  //     //console.log(res.data);
  //   });
  // }, []);
  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="input-group mb-3">
                <select
                  className="form-select"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  onChange={(e) => handleServerChange(e)}
                >
                  <option value="">Select Server</option>
                  {serverList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary"
                  type="button"
                  id="button-addon1"
                  onClick={getServerList}
                >
                  Fetch Database's
                </button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>DataBase List</label>
                <select
                  className="form-select"
                  onChange={(e) => handleDbChange(e)}
                >
                  <option value="">Select</option>
                  {databaseList.map((db) => (
                    <option key={db.id} value={db.id}>
                      {db.databaseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Table List</label>
                <select
                  className="form-select"
                  onChange={(e) => handleTableChange(e)}
                >
                  <option value="">Select</option>
                  {dbTableList.map((dbTable) => (
                    <option key={dbTable.id} value={dbTable.id}>
                      {dbTable.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Select Columns</label>
                <MultiSelectDropdown
                  options={options}
                  selectedOptions={selectedOptions}
                  onChange={handleMultiSelectChange}
                />
              </div>
            </div>
            {/* <div className="col-md-12 mt-3">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Selected Columns</Accordion.Header>
                  <Accordion.Body>
                    <span className="badge bg-primary m-1 p-2">Primary <i className="bi bi-x-circle"></i></span>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div> */}
            <div className="col-md-12 mt-3">
              <QueryBuilderBootstrap>
                <QueryBuilder
                  fields={selectedOptions}
                  query={query}
                  onQueryChange={handleQueryChange}
                />
              </QueryBuilderBootstrap>
            </div>

            <div className="col-md-12 mt-3">
              <label>Schedule Report Date & Time</label>
              <div className="input-group">
                <input
                  type="date"
                  min={new Date().toJSON().slice(0, 10)}
                  className="form-control"
                  name=""
                  id=""
                />
                <input type="time" className="form-control" name="" id="" />
                <input
                  type="button"
                  value="Schedule"
                  className="btn btn-primary btn-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-bar-chart"></i> Get Report
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="p-3 ">
                    <code>
                      {selectedDb && selectedTable && selectedOptions.length > 0
                        ? `USE ${
                            databaseList.find((d) => d.id === selectedDb)
                              ?.databaseName
                          }; 
                  SELECT ${selectedOptions.map((o) => o.value).join(",")} 
                  FROM
                  ${selectedTable}
                  WHERE
                  ${formatQuery(query, "sql")}
                  `
                        : ""}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomQueryBuilder;
