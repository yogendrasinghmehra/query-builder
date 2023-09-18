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

export type { DBServer, Database, Option, DbTables };
