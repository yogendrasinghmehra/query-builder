import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { QueryBuilder, RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { QueryBuilderBootstrap } from "@react-querybuilder/bootstrap";

import MultiSelectDropdown from "../MultiSelect";
import ApiEndpoints from "../services/Api";
import { DBServer, Database, DbField, DbTables, Option } from "../types/Common";
import axios from "axios";

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
  const [dbFields, setDbFields] = useState<DbField[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  //#endregion

  //#region methods
  const handleQueryChange = (q: any) => {
    setQuery(q);
  };
  const handleMultiSelectChange = (newSelectedOptions: string[]) => {
    setSelectedOptions(newSelectedOptions);
    setDbFields(dbFields.filter((f) => newSelectedOptions.includes(f.value)));
  };

  const handleServerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    getDataBaseList();
  };

  const handleDbChange = (db: any) => {
    const dbName = db.target.value;
    setSelectedDb(dbName);
    getDBTableList();
  };
  const handleTableChange = (table: any) => {
    setSelectedTable(table.target.value);
  };

  // getting server list
  const getServerList = () => {
    axios.get("/data/server.json").then((res) => {
      setServerList(res.data);
    });
  };
  //getting database list
  const getDataBaseList = () => {
    axios.get("/data/databases.json").then((res) => {
      setDataBaseList(res.data);
      getColumnsList();
    });
  };

  //getting database table list
  const getDBTableList = () => {
    axios.get("/data/dbTables.json").then((res) => {
      setDBTableList(res.data);
    });
  };

  //getting database table list
  const getColumnsList = () => {
    axios.get("/data/db-fields.json").then((res) => {
      setDbFields(res.data);
      setOptions(
        [...dbFields.map((val) => ({
          label: val.label,
          value: val.value,
        }))]
      );
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
                    <option key={db.id} value={db.databaseName}>
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
                    <option key={dbTable.id} value={dbTable.databaseId}>
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
            <div className="col-md-12 mt-3">
              <QueryBuilderBootstrap>
                <QueryBuilder
                  fields={dbFields}
                  query={query}
                  onQueryChange={handleQueryChange}
                />
              </QueryBuilderBootstrap>
            </div>
            <div className="col-md-3 `mt-3">
              <div className="form-group">
                <label>Schedule Report Date</label>
                <input type="date" className="form-control" name="" id="" />                
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="form-group">
                <label>Schedule Report Time</label>              
                <input type="time" className="form-control" name="" id="" />
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
        <div className="col-md-6"></div>
        {/* <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className='p-3 '>
                    <code>
                      {selectedDb && selectedTable && selectedOptions.length > 0 ? (
                        `USE ${selectedDb}; 
                  SELECT ${selectedOptions.join(',')} 
                  FROM
                  ${selectedTable}
                  WHERE
                  ${formatQuery(query, 'sql')}
                  `
                      ) : ''}
                    </code>
                  </div>
                </div>

              </div>
            </div>


          </div>
        </div> */}
      </div>
    </>
  );
};

export default CustomQueryBuilder;
