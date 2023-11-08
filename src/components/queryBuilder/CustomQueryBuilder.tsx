import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { QueryBuilder, RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";
import MultiSelectDropdown from "../MultiSelect";
import ApiEndpoints from "../services/Api";
import {
  DBServer,
  Database,
  DbField,
  DbTables,
  JoinTable,
  Option,
} from "../types/Common";
import axios from "axios";
import { Accordion } from "react-bootstrap";

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
  const [options, setOptions] = useState<DbField[]>([]);
  const [selectedTableFields, setSelectedTableFields] = useState<DbField[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedParentTable, setSelectedParentTable] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [selectedOptions, setSelectedOptions] = useState<DbField[]>([]);
  const [selectedJoinTable, setSelectedJoinTable] = useState("");
  const [selectedJoinType, setSelectedJoinType] = useState("");

  const [joinTables, setJoinTable] = useState<JoinTable[]>([]);

  //#endregion

  //#region methods
  const handleQueryChange = (q: any) => {
    setQuery(q);
  };
  const handleMultiSelectChange = (newSelectedOptions: DbField[]) => {
    setSelectedOptions(newSelectedOptions);
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

  const handleParentTableChange = (table: any) => {
    setSelectedParentTable(table.target.value);
  };
  const handleTableChange = (table: any) => {
    setSelectedTable(table.target.value);
    getColumnsList(table.target.value);
  };

  const handleAdd = () => {

    if(selectedTable && selectedOptions.length > 0)
    {
      joinTables.push({
        tableID: selectedTable,
        selectedColumns: selectedOptions,
        joinWithColumnId: selectedJoinTable,
        joinType: selectedJoinType,
      });
      setJoinTable([...joinTables]);
    }


    
    setSelectedTableFields([...selectedTableFields, ...selectedOptions]);

    //clearing form fields
    setSelectedTable("");
    setSelectedOptions([]);
    setSelectedJoinTable("");
    setSelectedJoinType("");

  };

  const removeJoinTable = (tableId:string) =>{
    if(tableId)
    {
        const index = joinTables.findIndex(i=>i.tableID === tableId);
        joinTables.splice(index,1);

        setJoinTable([...joinTables]);
    }
  }

  const getFinalQuery =():string=>{

    const queryString:string[] = [];
    const joins:string[]= [] ;
    if(selectedDb && selectedParentTable && selectedTableFields.length > 0) 
    {
      //Database details
      const dbDetails = ` USE ${databaseList.find((d) => d.id === selectedDb)?.databaseName}; `;
      queryString.push(dbDetails);
      queryString.push(` SELECT `)

      //join tables
      joinTables.forEach((val,idx,array)=>{
        let selectField:string[] = []
        const tableDetail = dbTableList.find(t=>t.id === val.tableID);
        const parentTable = dbTableList.find(t=>t.id === selectedParentTable);
        val.selectedColumns.forEach(f=>{
          selectField.push(tableDetail?.tableAlias + "." + f.value)
        })

        if (idx === array.length - 1){ 
          queryString.push(` ${selectField.join(",")} `);
       }
       else
       {
        queryString.push(` ${selectField.join(",")}, `);
       }
        

        //joins
        if(val.joinType)
        {
          joins.push(`${val.joinType} ${tableDetail?.tableName} ${tableDetail?.tableAlias}  ON ${tableDetail?.tableAlias}.${val.joinWithColumnId} = ${parentTable?.tableAlias}.${val.joinWithColumnId}`)
        }
        
      })


      //from condition
      const parentTable = dbTableList.find(t=>t.id === selectedParentTable);
      queryString.push(` FROM ${parentTable?.tableName} ${parentTable?.tableAlias} `);

      queryString.push(joins.join(""));

      // where condition 
      const whereConditions =  ` WHERE ${formatQuery(query, "sql")} `;
      queryString.push(whereConditions);
    }

    return queryString.join("")

;  }

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

            <div className="col-md-6">
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
            <div className="col-md-6">
              <div className="form-group">
                <label>Parent Table</label>
                <select
                  className="form-select"
                  onChange={(e) => handleParentTableChange(e)}
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

            <div className="col-md-12 mt-3">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Table Fields</Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Table</label>
                          <select
                            value={selectedTable}
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
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Join With</label>
                          <select
                            value={selectedJoinTable}
                            className="form-select"
                            disabled = {selectedParentTable === selectedTable}
                            onChange={(e) => setSelectedJoinTable(e.target.value)}>
                            <option value="">Select</option>
                            {options.map((option) => (
                              <option key={option.id} value={option.name}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Join Type</label>
                          <select
                           value={selectedJoinType}
                            className="form-select"
                            disabled = {selectedParentTable === selectedTable}
                            onChange={(e) =>
                              setSelectedJoinType(e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="INNER JOIN">INNER JOIN</option>
                            <option value="LEFT JOIN">LEFT JOIN</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12 text-end mt-3">
                        <button
                          type="submit"
                          className="btn btn-sm btn-success"
                          disabled= {!selectedTable && selectedOptions.length === 0}
                          onClick={() => handleAdd()}
                        >
                          Add
                        </button>
                      </div>
                      {joinTables.length > 0 &&
                      <div className="row mt-3">
                      <div className="col-md-12">
                        <table className="table">
                          <thead>
                            <tr>                                
                              <th scope="col">Joining Table</th>
                              <th scope="col">Selected Columns</th>
                              <th scope="col">Join On</th>
                              <th scope="col">Join Type</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                          {joinTables.map((record,index) => (
                            <tr key={index}>                             
                            <td>{record.tableID}</td>
                            <td>
                              {record.selectedColumns.map((col)=>(
                                <span className="badge bg-primary me-1">{col.label}</span>
                              ))}
                            </td>
                            <td>{record.joinWithColumnId}</td>
                            <td>{record.joinType}</td>
                            <td className="">
                              <i className="bi bi-pencil-square fs-6" role="button"></i> 
                              <i className="bi bi-archive ps-3 fs-6" role="button" onClick={()=>removeJoinTable(record.tableID)}></i>
                              </td>
                          </tr>
                          ))}                              
                          </tbody>
                        </table>
                      </div>
                    </div>
                     
                    }
                      
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>

            <div className="col-md-12 mt-3">
              <QueryBuilderBootstrap>
                <QueryBuilder
                  fields={selectedTableFields}
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
                      {getFinalQuery()}
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
