import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import clientData from '../data/clientData.json';
interface Client {
  id:number;
  name: string;
  planNumber:number
  age: number;
  city: string;
  price:string;
  status:string;
}
interface Data
{
  headers:string[];
  data:Client[]
}
const Report = () => {

  const [rowData, setData] = useState<Data>();

  useEffect(() => {
    setData(clientData)
    // fetch('../data/clientData.json') // URL to your local JSON file
    //   .then((response) => response.json())
    //   .then((json) => setData(json))
    //   .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className='table-responsive'>
    <Table className='table table-hover'>
      <thead>
        <tr>
          {rowData?.headers.map((header)=>(
            <th>{header}</th>
          ))}
          
        </tr>
      </thead>
      <tbody>
        {rowData?.data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.planNumber}</td>
            <td>{row.age}</td>
            <td>{row.city}</td>
            <td>{row.price}</td>
            <td>{row.status === "1" ? <span className='badge bg-success'>Active</span> : row.status === "2" ? <span className='badge bg-warning'>Inactive</span> : row.status ==="3" ? <span className='badge bg-danger'>Terminated</span> : ""}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
  
  );
}

export default Report
