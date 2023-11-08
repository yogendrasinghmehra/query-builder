interface DBServer {
  id: string;
  name: string;
}

interface Database {
  id: string;
  serverId: string;
  databaseName: string;
}

interface DbTables {
  id: string;
  databaseId: string;
  tableName: string;
  displayName: string;
  tableAlias:string;
}

interface Option {
  value: string;
  label: string;
}

interface DbField {
  id:string;
  tableId:string;
  name:string;
  value: string;
  label: string;
}

interface JoinTable
{
  tableID:string;
  selectedColumns:DbField[];
  joinWithColumnId:string;
  joinType:string;
}


export type { DBServer, Database, Option, DbTables,DbField,JoinTable };
