import { useState } from 'react';
import { QueryBuilder, RuleGroupType, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import 'bootstrap/scss/bootstrap.scss';
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import DbFields from '../../data/db-fields.json';
import DatabaseList from '../../data/databases.json';
import DbTableList from '../../data/dbTables.json';
import MultiSelectDropdown from '../MultiSelect';

//#region component types
let fields = DbFields;

const initialQuery: RuleGroupType = {
  combinator: 'and',
  rules: [],
};
interface Option {
  value: string;
  label: string;
}
const options: Option[] = fields.map(val => ({
  label: val.label,
  value: val.value
}))

interface Database {
  id: string;
  databaseName: string;
}

interface DbTables {
  id: string;
  databaseId: string;
  tableName: string;
  displayName: string
}

let databaseList: Database[] = DatabaseList;
let databaseTableList: DbTables[] = DbTableList

//#endregion




const CustomQueryBuilder = () => {

  //#region hooks sections 
  const [selectedDb, setSelectedDb] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [query, setQuery] = useState(initialQuery);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [dbFields, setDbFields] = useState(DbFields);
  //#endregion

  //#region methods
  const handleQueryChange = (q: any) => {
    setQuery(q)
  }
  const handleMultiSelectChange = (newSelectedOptions: string[]) => {
    setSelectedOptions(newSelectedOptions);
    setDbFields(fields.filter((f) => newSelectedOptions.includes(f.value)))
  };

  const handleDbChange = (db: any) => {
    const dbName = db.target.value;
    setSelectedDb(dbName);
    //databaseTableList = databaseTableList.filter(t=>t.databaseId === databaseList.find(d=>d.databaseName === dbName)?.id);
  };
  const handleTableChange = (table: any) => {
    setSelectedTable(table.target.value);
  }
  //#endregion

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Select Database</label>
                <select
                  className='form-control'
                  onChange={(e) => handleDbChange(e)}>
                  <option value="">Select</option>
                  {databaseList.map(db => (
                    <option key={db.id} value={db.databaseName}>{db.databaseName}</option>
                  ))}

                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Select Table</label>
                <select className='form-control'
                  onChange={(e) => handleTableChange(e)}>
                  <option value="">Select</option>
                  {databaseTableList.map(dbTable => (
                    <option key={dbTable.id} value={dbTable.databaseId}>{dbTable.displayName}</option>
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
          </div>
        </div>
        <div className="card-footer text-center">
          <button
            className='btn btn-primary btn-sm'><i className="bi bi-bar-chart"></i> Get Report</button>

        </div>
      </div>
      <div className="row">
        <div className="col-md-6">

        </div>
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

}


export default CustomQueryBuilder
