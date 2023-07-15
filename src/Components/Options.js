import React, { useState } from 'react'
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Sloading from "../Utils/Svgs/sloading.svg"
import Sdischarge from "../Utils/Svgs/sdischarge.svg"
import Button from "./Button"
import EditIcon from "../Utils/Svgs/pencil-outline.svg"
import DeleteIcon from "../Utils/Svgs/delete-outline.svg"
import SplitIcon from "../Utils/Svgs/table-split-cell.svg"
import DuplicateIcon from "../Utils/Svgs/content-duplicate.svg"
const Options = ({ selected_index, selectIndexes, showModal, duplicateRule, splitRule, start, end, index, setAlarm, alarm, setSplitModal, toggleMenu }) => {

    let [open, setOpen] = useState(false);
    let [split, setSplit] = useState(false);
    let [start_date, setStart] = useState("");
    let [end_date, setEnd] = useState("");


    return (
        <div className="ml-2 text-secondary menu-opt position-relative">
            <i className="fa fa-ellipsis-v" onClick={() => setOpen(!open)} aria-hidden="true"></i>
            {
                (open) &&
                <div className="position-absolute option-menu shadow p-3" onBlur={() => {
                    setOpen(true)
                }}>
                    {

                        (!split) ? <> <div className="mb-1 cursor text-color" onClick={() => {

                            selected_index.push(index);

                            console.log(selected_index)
                            selectIndexes(selected_index);
                            setAlarm(!alarm)
                        }}><span className="mr-1"><img src={EditIcon} /></span>Edit</div>
                            <div className="w-100 bg-secondary mt-2 mb-2 " style={{ height: 1 }}></div>
                            <div className="mb-2 cursor text-color" onClick={duplicateRule}><span className="mr-1"><img src={DuplicateIcon} /></span>Duplicate</div>
                            <div className="w-100 bg-secondary mt-2 mb-2  " style={{ height: 1 }}></div>
                            <div className="mb-2 cursor text-color" onClick={() => {
                                setSplit(true)
                                setSplitModal(index)
                            }}><span className="mr-1"><img src={SplitIcon} /></span>Split</div>
                            <div className="w-100 bg-secondary mt-2 mb-2 " style={{ height: 1 }}></div>
                            <div className="cursor" style={{ color: "red" }} onClick={() => { showModal(true) }} ><span className="mr-1"><img src={DeleteIcon} /></span>Delete</div></> :
                            <div className="split-date-option ">
                                <div style={{ color: "#505050", fontWeight: "bold" }}>SPLIT VALIDITY DATE</div>
                                <div className="w-100 bg-secondary mt-1 mb-3 " style={{ height: 1 }}></div>
                                <Row noGutters className="align-items-center justify-content-between mb-4">
                                    <span><img src={Sloading}></img>Loading</span>
                                    <span>{start}</span>
                                    <input val={start_date} type="date" onChange={(e) => {
                                        setStart(e.target.value);
                                        console.log(new Date(e.target.value))
                                        let date = new Date(e.target.value);
                                        if (start !== end) {
                                            date.setDate(date.getDate() + 1);
                                        }
                                        let input_format = `${date.getFullYear()}-${(date.getMonth() + 1 < 10) ?
                                            `0${date.getMonth() + 1}` : date.getMonth() + 1}-${(date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()}`;
                                        setEnd(input_format);

                                    }} />
                                </Row>
                                <Row noGutters className="align-items-center justify-content-between mb-4">
                                    <span><img src={Sdischarge} />Discharge</span>
                                    <input
                                        readOnly
                                        value={end_date}
                                        type="date" />
                                    <span>{end}</span>
                                </Row>
                                <Row noGutters className="justify-content-end">
                                    <Button onClick={() => {
                                        setSplit(false); setOpen(false);
                                        setSplitModal(null);
                                        toggleMenu(false)
                                    }} text="CANCEL" className="mr-3 bg-white text-secondary" />
                                    <Button disabled={(start_date === "")} text="SPLIT" height={32} onClick={() => {
                                        if (splitRule(start_date, end_date))
                                            setSplit(false);
                                        setOpen(false);
                                        setSplitModal(null);
                                        toggleMenu(false);
                                    }} />
                                </Row>
                            </div>
                    }


                </div>
            }
        </div>
    )
}

Options.propTypes = {
    selected_index: PropTypes.array,
    selectIndexes: PropTypes.func,
    showModal: PropTypes.func,
    duplicateRule: PropTypes.func,
    splitRule: PropTypes.func,
    start: PropTypes.string,
    end: PropTypes.string,
    index: PropTypes.number,
    setAlarm: PropTypes.func,
    alarm: PropTypes.bool,
    setSplitModal: PropTypes.func,
    toggleMenu: PropTypes.func
}

export default Options;