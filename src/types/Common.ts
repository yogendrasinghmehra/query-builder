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
  tableName: string;
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
  tableAlias?:string
}

interface AddedJoinTable
{
  tableName:string;
  selectedTableColumns:DbField[];
  selectedJoinTableColumns?:DbField[];
  joinWithColumnId:string;
  joinTableName:string;
  joinType:string;

}

interface TableRelationShip
{
  databaseName:string;
  tableName:string;
  columnName:string;
  T2:JoinRelation[]
 
}
interface JoinRelation
{
 tableName:string;
 columnName:string
 tableAlias:string;
}

interface JoinColumn
{
 columnName:string
}



export type { DBServer, Database, Option, DbTables,DbField,AddedJoinTable,TableRelationShip,JoinRelation,JoinColumn };
