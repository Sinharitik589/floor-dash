import React from 'react'
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from "./Button"

const MasterEdit = ({ duplicateAllSelected, cancelAllSelected, deleteAllSelected, editAllSelected, showModal }) => {

    return (
        <Row className="w-100 justify-content-center mt-4 no-gutters">
            <Row className="master-edit shadow-lg  p-2 justify-content-between align-items-center" style={{ width: 400 }}>
                <span onClick={cancelAllSelected} style={{ borderRight: "2px solid " }} className=" text-secondary pr-2">CANCEL</span>
                <div onClick={() => {
                    deleteAllSelected(true)
                }}><i className="far fa-trash-alt" ></i></div>
                <div><i onClick={() => { showModal(true) }} className="fa fa-random" aria-hidden="true"></i></div>
                <div onClick={duplicateAllSelected}><i className="far fa-clone" ></i></div>
                <Button onClick={editAllSelected} width={150} height={32} text={"SAVE CHANGES"} />
            </Row>
        </Row>
    )
}


MasterEdit.propTypes = {
    duplicateAllSelected: PropTypes.func,
    deleteAllSelected: PropTypes.func,
    editAllSelected: PropTypes.func,
    cancelAllSelected: PropTypes.func,
    showModal: PropTypes.func
}

export default MasterEdit;