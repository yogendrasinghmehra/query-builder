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
}

interface Option {
  value: string;
  label: string;
}

interface DbField {
  id:string;
  name:string;
  value: string;
  label: string;
  inputType:string;
  dbTableName:string;
  dbName:string;
  relationShip:string;
}

export type { DBServer, Database, Option, DbTables,DbField };
