import { useState } from 'react';
import { Field, QueryBuilder, RuleGroupType, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import 'bootstrap/scss/bootstrap.scss';
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.scss';

const fields: Field[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'age', label: 'Age', inputType: 'number' },
  { name: 'address', label: 'Address' },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email', validator: ({ value }) => /^[^@]+@[^@]+/.test(value) },
  { name: 'twitter', label: 'Twitter' },
  { name: 'isDev', label: 'Is a Developer?', valueEditorType: 'checkbox', defaultValue: false },
];

const initialQuery: RuleGroupType = {
  combinator: 'and',
  rules: [],
};

const CustomQueryBuilder = () => {
  const [query, setQuery] = useState(initialQuery);
  return (
    <>
     <QueryBuilderBootstrap>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={(q) => setQuery(q)}
      />
    </QueryBuilderBootstrap>
    <div className="card mt-5">
    <div className='p-3 text-center'>
          <pre>
            {formatQuery(query, 'sql')}
          </pre>
    </div>
    </div>
    
    </>
   
    
  );
  
}


export default CustomQueryBuilder
