import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface AppModalComponentProps{
  childComponent:React.FC,
  showModal:boolean,
  onHide:React.MouseEventHandler<HTMLButtonElement> | undefined
}

const AppModal:React.FC<AppModalComponentProps> = ({showModal,childComponent:DynamicComponent,onHide}) => {
  return (
    <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Get Report Data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DynamicComponent></DynamicComponent>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} className='btn btn-default'>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AppModal
