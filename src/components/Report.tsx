import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

interface Client {
  id:number;
  name: string;
  lastName: string;
  policyNumber:number
  age: number;
  city: string;
  effectiveDate:string;
  status:string;
}
interface Data
{
  headers:string[];
  data:Client[]
}
interface ReportProps
{
  Type:string
}
const Report:React.FC<ReportProps> = ({Type}) => {

  const [rowData, setData] = useState<Data>();

  useEffect(() => {
    axios.get("/data/clientData.json").then((res) => {    
      setData(res.data)        
    });
  }, []);

  return (
    <div className='table-responsive'>
    <Table className='table table-hover'>
      <thead>
        <tr>
          {rowData?.headers.map((header,index)=>(
            <th key={index}>{header}</th>
          ))}
          
        </tr>
      </thead>
      <tbody>
        {rowData?.data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.lastName}</td>
            <td>{row.policyNumber}</td>
            <td>{row.age}</td>
            <td>{row.city}</td>
            <td>{row.effectiveDate}</td>
            <td>{row.status === "1" ? <span className='badge bg-success'>Active</span> : row.status === "2" ? <span className='badge bg-warning'>Inactive</span> : row.status ==="3" ? <span className='badge bg-danger'>Terminated</span> : ""}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
  
  );
}

export default Report
