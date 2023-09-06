import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import clientData from '../data/clientData.json';
interface Client {
  id:number;
  name: string;
  age: number;
  city: string;
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
    <h5>Client Data</h5>
    <Table striped bordered hover>
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
            <td>{row.age}</td>
            <td>{row.city}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
  
  );
}

export default Report
