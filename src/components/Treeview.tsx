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
  const handleChange = (value:string) => {
    onChange(value);
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
          <div className="form-check">
            <input 
            type='radio' 
            className="form-check-input"
            name="flexRadioDefault" 
            id="flexRadioDefault1"
            checked={selectedValue === node.value}
            onChange={() => onChange(node.value)}></input>                     
        </div>
           ): '' 
        }               
        <label className="form-check-label">
        {node.label}
          </label>
      </div>
      {!isCollapsed && node.children && (
        <ul className='list-group'>
          {node.children.map((child) => (
            <TreeNodeItem 
            key={child.id} 
            node={child}
            selectedValue={selectedValue}
            onChange={handleChange}
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
