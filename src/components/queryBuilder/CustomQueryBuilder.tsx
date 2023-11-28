import { ChangeEvent, useEffect, useState } from "react";
import { QueryBuilder, RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";
import MultiSelectDropdown from "../MultiSelect";
import ApiEndpoints from "../../services/Api";
import {
  AddedJoinTable,
  DBServer,
  Database,
  DbField,
  DbTables,
  JoinColumn,
  JoinRelation,
  Option,
  TableRelationShip,
} from "../../types/Common";
import axios from "axios";
import { Accordion } from "react-bootstrap";

//#region component types

const initialQuery: RuleGroupType = {
  combinator: "AND",
  rules: [],
};

//#endregion

const CustomQueryBuilder = () => {
  //#region hooks sections
  const [serverList, setServerList] = useState<DBServer[]>([]);
  const [selectedServer, setSelectedServer] = useState("");
  const [databaseList, setDataBaseList] = useState<Database[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [dbTableList, setDBTableList] = useState<DbTables[]>([]);

  const [dbTableColumn, setDbTableColumn] = useState<DbField[]>([]);
  const [selectedDbTableColumn, setSelectedDbTableColumn] = useState<DbField[]>([]);

  const [dbJoinTableColumn, setDbJoinTableColumn] = useState<DbField[]>([]);
  const [selectedDbJoinTableColumn, setSelectedDbJoinTableColumn] = useState<DbField[]>([]);

  const [selectedTableFields, setSelectedTableFields] = useState<DbField[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [joinColumnList, setJoinColumnList] = useState<JoinColumn[]>([]);
  const [selectedJoinColumn, setSelectedJoinColumn] = useState("");
  const [selectedJoinTable, setSelectedJoinTable] = useState("");
  const [selectedJoinType, setSelectedJoinType] = useState("");
  const [addedJoinTables, setAddedJoinTable] = useState<AddedJoinTable[]>([]);
  const [tableToJoin, setTableToJoin] = useState<JoinRelation[]>([]);
  const [finalQuery, setFinalQuery] = useState("");
  const [addJoinTables, setAddJoinTables] = useState(false);


  //#endregion

  //#region methods
  const handleQueryChange = (q: any) => {
    setQuery(q);
  };
  const handleDbTableColumnChange = (newSelectedOptions: DbField[]) => {
    setSelectedDbTableColumn(newSelectedOptions);
  };

  const handleDbJoinTableColumnChange = (newSelectedOptions: DbField[]) => {
    setSelectedDbJoinTableColumn(newSelectedOptions);
  };

  const handleServerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDataBaseList([]);
    setDBTableList([]);
    //setDbFields([]);
    const envName = event.target.value;
    getDataBaseList(envName);
    setSelectedServer(envName);
  };

  const handleDbChange = (db: any) => {
    const dbName = db.target.value;
    setSelectedDb(dbName);
    setDBTableList([]);
    //setDbFields([]);
  };

  // const handleParentTableChange = (table: any) => {
  //   setSelectedParentTable(table.target.value);
  // };
  const handleTableChange = (table: any) => {
    const selectedTableName = table.target.value;
    setSelectedTable(selectedTableName);
    getColumnsList(selectedTableName,"Table");

    axios.get("/data/sqlRelationship.json").then((res) => {
      const list: TableRelationShip[] = res.data;
      const joinColumnList:JoinColumn[] =[] 
      list.filter(f=>f.databaseName === selectedDb && f.tableName === selectedTableName).map(m=>{
        const found = joinColumnList.some(el => el.columnName === m.columnName);
        if (!found) joinColumnList.push({columnName:m.columnName});        
      })
      setJoinColumnList(joinColumnList)
    });

  };
  const handleJoinTableChange = (table: any) => {
    const selectedTableName = table.target.value;
    setSelectedJoinTable(selectedTableName);
    getColumnsList(selectedTableName,"JoinTable");
  };

  const handleJoinColumnChange = (value: string) => {
    setSelectedJoinColumn(value);
    axios.get("/data/sqlRelationship.json").then((res) => {
      const list: TableRelationShip[] = res.data;
      const filterList = list.filter(
        (d) =>
          d.databaseName === selectedDb &&
          d.tableName === selectedTable &&
          d.columnName === value
      );
      const joinTableList: JoinRelation[] = [];
      filterList.map((f) => f.T2.map((c) => joinTableList.push(c)));
      setTableToJoin(joinTableList);
    });
  };

  const handleAdd = () => {
    if (   selectedJoinTable  
        && selectedJoinColumn 
        && selectedJoinType 
        && selectedDbJoinTableColumn.length > 0
        && selectedTable
        && selectedDbTableColumn.length > 0
        ) {
      addedJoinTables.push({
        tableName: selectedTable,
        selectedTableColumns: selectedDbTableColumn,
        selectedJoinTableColumns:selectedDbJoinTableColumn,
        joinWithColumnId: selectedJoinColumn,
        joinTableName: selectedJoinTable,
        joinType: selectedJoinType,

      });
      setAddedJoinTable([...addedJoinTables]);      
    }

    
    let allSelectedOption = [...selectedTableFields, ...selectedDbTableColumn]; // ...selectedDbJoinTableColumn
    const tableAlias = dbTableList.find((t) => t.tableName === selectedTable)?.tableAlias;
    const updatedOptions = allSelectedOption.map((obj) => {
      //const allTables = [...dbTableList]
      return { ...obj, name: tableAlias + "." + obj.value };
    });
    setSelectedTableFields(updatedOptions);


    //clearing form fields
    //setSelectedTable("");
    //setSelectedOptions([]);
    setSelectedJoinTable("")
    setSelectedJoinColumn("");
    setSelectedJoinType("");
    setSelectedDbJoinTableColumn([])
    setDbJoinTableColumn([])
     
  };

  const handleReset = () =>{
    
    setSelectedTable("");
    setDbTableColumn([]);
    setSelectedDbTableColumn([]);
    setSelectedJoinTable("");
    setSelectedJoinColumn("");
    setSelectedJoinType("");
    setSelectedDbJoinTableColumn([]);
    setDbJoinTableColumn([]);
    setAddedJoinTable([]);
    setAddJoinTables(false);
    setFinalQuery("");
  }
  const removeJoinTable = (tableName: string) => {
    if (tableName) {
      const index = addedJoinTables.findIndex((i) => i.tableName === tableName);
      addedJoinTables.splice(index, 1);

      setAddedJoinTable([...addedJoinTables]);
    }
  };

  const getFinalQuery = (): string => {
    const queryString: string[] = [];
    const joins: string[] = [];
    if (selectedDb && addedJoinTables.length > 0) {
      console.log(addedJoinTables);
      //Database details
      const dbDetails = ` USE ${
        databaseList.find((d) => d.id === selectedDb)?.databaseName
      }; `;
      queryString.push(dbDetails);
      queryString.push(` SELECT `);
      //adding table details
      let selectField: string[] = [];
      const tableDetail = dbTableList.find((t) => t.tableName === addedJoinTables[0].tableName)
      addedJoinTables[0].selectedTableColumns.forEach((f) => {
        selectField.push(tableDetail?.tableAlias + "." + f.value);
      });
      if(addedJoinTables.length > 0)
      {
        queryString.push(` ${selectField.join(",")}, `);
      }
      else
      {
        queryString.push(` ${selectField.join(",")} `);
      }
     
       //adding join table details
      addedJoinTables.forEach((val, idx, array) => {
        let joinFields: string[] = [];
        const joinTableDetail = dbTableList.find(
          (t) => t.tableName === val.joinTableName
        );
        val.selectedJoinTableColumns?.forEach((f) => {
          joinFields.push(joinTableDetail?.tableAlias + "." + f.value);
        });

        if (idx === array.length - 1) {
          queryString.push(` ${joinFields.join(",")} `);
        } else {
          queryString.push(` ${joinFields.join(",")}, `);
        }

        //joins
        if (val.joinType) {
          joins.push(
            `${val.joinType} ${val.joinTableName} ${joinTableDetail?.tableAlias}  ON ${tableDetail?.tableAlias}.${val.joinWithColumnId} = ${joinTableDetail?.tableAlias}.${val.joinWithColumnId} `
          );
        }
      });

      //from condition
      const parentTable = dbTableList.find(
        (t) => t.tableName === addedJoinTables[0].tableName
      );
      queryString.push(
        ` FROM ${parentTable?.tableName} ${parentTable?.tableAlias} `
      );

      queryString.push(joins.join(""));

      // where condition
      const whereConditions = ` WHERE ${formatQuery(query, "sql")} `;
      queryString.push(whereConditions);
    }

    return queryString.join("");
  };

  // // getting server list
  // const getServerList = () => {
  //   axios.get("/data/server.json").then((res) => {
  //     setServerList(res.data);
  //   });
  // };

  //getting database list
  const getDataBaseList = (serverId: string) => {
    axios.get("/data/databases.json").then((res) => {
      const dbList: Database[] = res.data;
      const filterDbList = dbList.filter((d) => d.serverId === serverId);
      setDataBaseList(filterDbList);
    });
  };

  //getting database table list
  const getDBTableList = () => {
    const url = `/Quest?EnvironmentName=${selectedServer}&DatabaseName=${selectedDb}`;
    ApiEndpoints.get(url).then((res) => {
      setDBTableList(res.data.data);
    });
  };

  //getting database column list
  const getColumnsList = (tableName: string, columnsType:string) => {
    const url = `/Quest/Columnlist?EnvironmentName=${selectedServer}&DatabaseName=${selectedDb}&TableName=${tableName}`;
    ApiEndpoints.get(url).then((res) => {
      const fields:DbField[] = res.data.data;
      
      if(columnsType === "Table")
      {
        const updatedFields = fields.map((obj) => {
          const alias = dbTableList.find((t) => t.tableName === obj.value)?.tableAlias;
          return { ...obj, tableAlias: alias};
        });  
        setDbTableColumn(updatedFields);
      }
      else if(columnsType === "JoinTable")
      {
        // const updatedFields = fields.map((obj) => {
        //   const alias = tableToJoin.find((t) => t.tableName === obj.value)?.tableAlias;
        //   return { ...obj, tableAlias: alias};
        // });

        setDbJoinTableColumn(res.data.data);
      }
    });
  };

  //getting report
  const getFinalReport = () => {
    setFinalQuery(getFinalQuery());
  };

  useEffect(() => {
    axios.get("/data/server.json").then((res) => {
      setServerList(res.data);
    });
  }, []);

  //#endregion
  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              <div className="form-group">
                <label>Server List</label>
                <select
                  className="form-select"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  onChange={(e) => handleServerChange(e)}
                >
                  <option value="">Select Server</option>
                  {serverList.map((s, index) => (
                    <option key={index} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
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
                  {databaseList.map((db, index) => (
                    <option key={index} value={db.id}>
                      {db.databaseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3 mt-4">
              <button
                className="btn btn-primary"
                type="button"
                id="button-addon1"
                onClick={() => getDBTableList()}
                disabled={selectedDb === ""}
              >
                Fetch Tables
              </button>
            </div>
            <div className="col-md-12 mt-3">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Add Tables Fields</Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form-group">
                          <label>Table Name</label>
                          <select
                            value={selectedTable}
                            className="form-select"
                            onChange={(e) => handleTableChange(e)}
                            disabled = {addJoinTables}
                          >
                            <option value="">Select</option>
                            {dbTableList.map((dbTable, idx) => (
                              <option key={idx} value={dbTable.tableName}>
                                {dbTable.tableName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group">
                          <label>Select Columns (To Display)</label>
                          <MultiSelectDropdown
                            options={dbTableColumn}
                            selectedOptions={selectedDbTableColumn}
                            onChange={handleDbTableColumnChange}
                            disabled = {addJoinTables}
                          />
                        </div>
                      </div>
                      <div className="col-md-2 mt-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"   
                            checked= {addJoinTables}
                            onChange={(e)=> setAddJoinTables(e.target.checked)}                         
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            Add Join table
                          </label>
                        </div>
                      </div>

                      <div className="col-md-3 mt-3">
                        <div className="form-group">
                          <label>Join On</label>
                          <select
                            value={selectedJoinColumn}
                            className="form-select"
                            disabled = {!addJoinTables}
                            onChange={(e) =>
                              handleJoinColumnChange(e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            {joinColumnList.map((option, index) => (
                              <option key={index} value={option.columnName}>
                                {option.columnName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3 mt-3">
                        <div className="form-group">
                          <label>Join Table</label>
                          <select
                            className="form-select"
                            onChange={(e) =>
                              handleJoinTableChange(e)
                            }
                            value={selectedJoinTable}
                            disabled = {!addJoinTables}
                          >
                            <option value="">Select</option>
                            {tableToJoin.length > 0 &&
                              tableToJoin.map((val, idx) => (
                                <option key={idx} value={val.tableName}>
                                  {val.tableName}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3 mt-3">
                        <div className="form-group">
                          <label>Join Type</label>
                          <select
                            value={selectedJoinType}
                            className="form-select"
                            disabled = {!addJoinTables}
                            onChange={(e) =>
                              setSelectedJoinType(e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="INNER JOIN">INNER JOIN</option>
                            <option value="SELF JOIN">SELF JOIN</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-3 mt-3">
                        <div className="form-group">
                          <label>Select Columns (To Display)</label>
                          <MultiSelectDropdown
                            options={dbJoinTableColumn}
                            selectedOptions={selectedDbJoinTableColumn}
                            onChange={handleDbJoinTableColumnChange}                           
                          />
                        </div>
                      </div>

                      <div className="col-md-12 text-end mt-3">
                        <button
                          type="submit"
                          className="btn btn-sm btn-success"
                          disabled={
                            !selectedTable && selectedDbTableColumn.length === 0
                          }
                          onClick={() => handleAdd()}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className=" ms-1 btn btn-secondary btn-sm"
                          onClick={() => handleReset()}
                        >
                          Reset
                        </button>
                      </div>
                      {addedJoinTables.length > 0 && (
                        <div className="row mt-3">
                          <div className="col-md-12">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col">Table</th>                                 
                                  <th scope="col">Selected Columns</th>                                 
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{addedJoinTables[0].tableName}</td>
                                  <td>
                                      {addedJoinTables[0].selectedTableColumns.map((col) => (
                                        <span className="badge bg-primary me-1">
                                          {col.label}
                                        </span>
                                      ))}
                                      </td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="table">
                              <thead>
                                <tr>
                                 
                                  <th scope="col">Join Table</th>
                                  <th scope="col">Join Column</th>
                                  <th scope="col">Join Type</th>
                                  <th scope="col">Selected Columns</th>
                                  <th scope="col">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {addedJoinTables.map((record, index) => (
                                  <tr key={index}>
                                   
                                    <td>{record.joinTableName}</td>
                                    <td>{record.joinWithColumnId}</td>
                                    <td>{record.joinType}</td>
                                    <td>
                                      {record.selectedJoinTableColumns?.map((col) => (
                                        <span className="badge bg-primary me-1">
                                          {col.label}
                                        </span>
                                      ))}
                                    </td>
                                    <td className="p-1">
                                      <a title="Edit" role="button">
                                        <i className="bi bi-pencil-square fs-6"></i>{" "}
                                      </a>
                                      <a title="Remove" role="button">
                                        <i
                                          className="bi bi-archive ps-3 fs-6"
                                          onClick={() =>
                                            removeJoinTable(record.tableName)
                                          }
                                        ></i>
                                      </a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
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
          <button
            className="btn btn-primary btn-sm"
            onClick={() => getFinalReport()}
          >
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
                    <code>{finalQuery}</code>
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
