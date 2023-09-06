import React, { useState } from 'react';

interface TreeNode {
  id: number;
  label: string;
  children?: TreeNode[];
  isParentNode?:boolean;
  value:string;
}

interface TreeViewProps {
  data: TreeNode[];
  selectedValue:string;
  onChange:(value: string) => void;
}

const TreeNodeItem: React.FC<{ node: TreeNode,selectedValue:string,onChange:(value: string) => void }> = ({ node,selectedValue,onChange }) => {
  const [isCollapsed, setCollapsed] = useState(true);
  const toggleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <li className='list-group-item'>
      <div className="d-flex align-items-center">
        { node.children ? 
        ( 
        <button onClick={toggleCollapse} className="btn btn-link">
          {isCollapsed ? <i className="bi bi-plus fs-2"></i> : <i className="bi bi-dash fs-2"></i>}
        </button>
         ) : !node.isParentNode ? (
           <input 
            type='radio' 
            className='fs-2'
            checked={selectedValue === node.value}
            onChange={() => onChange(node.value)}></input>)
         :'' 
        }
       
        <span className='ms-2'>{node.label}</span>
      </div>
      {!isCollapsed && node.children && (
        <ul className='list-group'>
          {node.children.map((child) => (
            <TreeNodeItem 
            key={child.id} 
            node={child}
            selectedValue={selectedValue}
            onChange={() => onChange(child.value)}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ data,selectedValue, onChange }) => {
    const handleChange = (value:string) => {
        onChange(value);
      };
  return (
    <ul className='list-group mt-3'>
      {data.map((node) => (
        <TreeNodeItem 
        key={node.id} 
        node={node}
        selectedValue={selectedValue}
        onChange={handleChange}
        />
      ))}
    </ul>
  );
};

export default TreeView;
