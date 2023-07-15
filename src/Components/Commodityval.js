import React, { useState, useEffect } from 'react'
import { Col, Row, Modal, Button } from 'react-bootstrap'
import { compareDate } from '../Utils';
import Badges from './Badges';
import Commodityinput from "./Commodityinput"
import Options from './Options';
import { reverseDate } from '../Utils';
import axios from 'axios';
import PropTypes from "prop-types"
const Commodityval = (props) => {
    const { comGroup, selected_index, selectIndexes, check, all, start, end, trade, charge, cargo, loadingArea, dischargeArea,
        loadingPort, dischargePort, conflict, loadingCountry, dischargeCountry, pod, pol, denomination, status, floors, setFloors,
        index, setDuplicate, setPublishCount } = props;

    let [menu, toggleMenu] = useState(false);
    let [del, setDel] = useState(false);
    let [modal, showModal] = useState(false);
    useEffect(() => {
        setDel(props.del)
    }, [props.del])
    let [editPerm, setEditPerm] = useState(false) //manages permisssion for a given BU



    useEffect(() => {
        setDel(props.del)
    }, [props.del])
    useEffect(() => {
        if (status === "DELETED")
            setDel(true)
    }, [props.status])
    //looks for the change in permission in the parent
    useEffect(() => {
        let perm = (props.permission === "Update")
        setEditPerm(perm);
    }, [props.permission])


    //Function for rule duplication
    const duplicateRule = () => {
        let object = { duplicate: true, all, start, end, trade, charge, comGroup, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, conflict: true, loadingCountry, dischargeCountry, pod, pol, denomination, status: "DUPLICATE", floors, setFloors, index };
        setFloors([object, ...floors]);
        let val = selected_index;
        val.push(0);
        setDuplicate(true);
        selectIndexes(val);
        props.setAlarm(!props.alarm)
    }

    //Function for rule deletion
    const deleteRule = async () => {
        try {
            let result = {
                accessToken: props.user.accessToken,
                ID: props.ID,
                RULE_TYPE: "comm",
                TRADE: trade,
                BU: props.currentBu,
                POL_AREA: (loadingArea !== "") ? loadingArea : null,
                POL_COUNTRY: (loadingCountry !== "") ? loadingCountry : null,
                POL_GROUP_CODE: (pol !== "") ? pol : null,
                POL_CODE: (loadingPort !== "") ? loadingPort : null,
                POD_AREA: (dischargeArea !== "") ? dischargeArea : null,
                POD_COUNTRY: (dischargeCountry !== "") ? dischargeCountry : null,
                POD_GROUP_CODE: (pod !== "") ? pod : null,
                POD_CODE: (dischargePort != "") ? dischargePort : null,
                CONTAINER_TYPE: cargo,
                START: start,
                END: end,
                USER: props.user.ID,
                param1: denomination,
                param2: charge,
                param3: comGroup,
            }
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removeRule`, result);
            if (res.data) {
                props.setInfo("change");

                floors[index].status = "DELETED";
                setDel(true);
                setFloors(floors);
                showModal(false);
                props.setAlarm(!props.alarm);
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
            }
            else {
                window.alert("Not allowed")
            }
        }
        catch (e) {
            if (e.response.data) {
                window.alert(e.response.data.message)
            }
        }
    }

    //Function for rule split
    const splitRule = async (start_date, end_date) => {
        if (compareDate(`${start_date}`, reverseDate(start, "input")) && compareDate(reverseDate(end, "input"), end_date)) {
            let array = []
            props.floors.map(val => {
                array.push(val);
            });
            try {
                let result = {
                    accessToken: props.user.accessToken,
                    ID: props.ID,
                    RULE_TYPE: "comm",
                    TRADE: trade,
                    BU: props.currentBu,
                    POL_AREA: (loadingArea !== "") ? loadingArea : null,
                    POL_COUNTRY: (loadingCountry !== "") ? loadingCountry : null,
                    POL_GROUP_CODE: (pol !== "") ? pol : null,
                    POL_CODE: (loadingPort !== "") ? loadingPort : null,
                    POD_AREA: (dischargeArea !== "") ? dischargeArea : null,
                    POD_COUNTRY: (dischargeCountry !== "") ? dischargeCountry : null,
                    POD_GROUP_CODE: (pod !== "") ? pod : null,
                    POD_CODE: (dischargePort != "") ? dischargePort : null,
                    CONTAINER_TYPE: cargo,
                    START: reverseDate(start, "input"),
                    END: reverseDate(end, "input"),
                    USER: props.user.ID,
                    param1: denomination,
                    param2: charge,
                    param3: comGroup,
                    splitedTO: start_date,
                    splitedFROM: end_date
                }
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roulSplit`, result);

                let resulted_array = res.data;
                var first = Object.assign({}, props.floors[index]);
                first.end = reverseDate(start_date, "output");
                first.status = "SPLIT"
                first.ID = resulted_array[0].ID;
                var second = Object.assign({}, props.floors[index]);
                second.start = reverseDate(end_date, "output");
                second.status = "SPLIT"
                second.ID = resulted_array[1].ID;
                array.splice(index, 1);
                setFloors([first, second, ...array])
                props.setInfo("change")
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
                return true;
            }
            catch (e) {
                if (e.response.data) {
                    window.alert(e.response.data.message)
                }
                return false;
            }


        }
        else {
            window.alert("Date not in range")
            return false;

        }
    }

    //For toggeling check box
    const toggleCheckbox = () => {
        //checks if editor permisssion is there or not
        if (editPerm) {

            let el = selected_index.findIndex(val => val == index)
            if (el >= 0) {
                selected_index.splice(el, 1);
            }
            else {
                selected_index.push(index);
            }
            selectIndexes(selected_index);
            props.setAlarm(!props.alarm)//in order to rerender Floor
        }
    }
    //Function that looks up for edit or show toggle
    const renderMain = () => {
        let editSection = (selected_index.length > 0) ? (selected_index.findIndex(val => val == index) >= 0) : false;

        if (editSection) {
            return (
                <Commodityinput
                    {...props}
                    key={`edit_input_${index}`}
                />)

        }
        else {
            return (<Row noGutters className="flex-nowrap comval align-items-center  " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} onMouseLeave={() => {
                toggleMenu(false);
            }} onMouseEnter={() => toggleMenu(true)} >

                <Col className="p-0 pr-1 position-relative " xs={1}>

                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }}  >
                        <div className="col-3 p-0 pr-1">
                            <input checked={all || check} onChange={toggleCheckbox} type="checkbox" />
                        </div>
                        <div className="col-9 p-0">
                            <label className="text-secondary m-0 ">{trade}</label>
                        </div>
                    </div>

                </Col>
                <Col className="p-0 pr-1" xs={1}>

                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >
                        <div className="col-12 p-0 pr-1 left-border">
                            <label className=" m-0 text-secondary">{comGroup}</label>
                        </div>

                    </div>
                </Col>
                <Col className="p-0" xs={5}>
                    <Row noGutters>
                        <Col className="p-0 " xs={6}>

                            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >
                                <div className="col-2 p-0 left-border">
                                    <label className=" m-0 text-secondary">{loadingArea}</label>
                                </div>
                                <div className="col-5 p-0 pr-1 pl-1 left-border">
                                    <label className=" m-0 text-secondary">{pol}</label>
                                </div>
                                <div className="col-3 p-0 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{loadingCountry}</label>
                                </div>
                                <div className="col-2 left-border">
                                    <label className=" m-0 text-secondary">{loadingPort}</label>
                                </div>
                            </div>

                        </Col>
                        <Col className="p-0 " xs={6}>
                            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >
                                <div className="col-2 p-0 left-border">
                                    <label className=" m-0 text-secondary">{dischargeArea}</label>
                                </div>
                                <div className="col-5 p-0 pl-1 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{pod}</label>
                                </div>
                                <div className="col-3 p-0 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{dischargeCountry}</label>
                                </div>
                                <div className="col-2 left-border">
                                    <label className=" m-0 text-secondary">{dischargePort}</label>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={5} className="p-0">
                    <Row noGutters>
                        <Col className="p-0 pr-1" xs={2}>

                            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >
                                <div className="col-12 p-0 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{cargo}</label>
                                </div>

                            </div>
                        </Col>
                        <Col className="p-0 pr-1" xs={4}>

                            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >
                                <div className="col-6 p-0 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{start}</label>
                                </div>
                                <div className="col-6 p-0 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{end}</label>
                                </div>

                            </div>
                        </Col>
                        <Col className="p-0 pr-1" xs={2}>

                            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >
                                <div className="col-12 p-0 pr-1 left-border">
                                    <label className=" m-0 text-secondary">{denomination}</label>
                                </div>

                            </div>
                        </Col>

                        <Col className="p-0" xs={4}>

                            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content " style={{ backgroundColor: (check || all) ? "#dfe9fb" : (menu) ? "#EAF1FF" : (del) ? "#eeeeee" : "" }} >

                                <div className="col-5 p-0 pr-1 position-relative left-border">

                                    <label className=" m-0 text-secondary">{charge}</label>
                                </div>
                                <div className="col-7 p-0 pr-1 left-border">
                                    <Row noGutters className="justify-content-center align-items-center">
                                        <Badges conflict={conflict} status={status} />
                                        {(props.split == props.index || menu) && editPerm && <Options
                                            selected_index={selected_index}
                                            selectIndexes={selectIndexes}
                                            start={start} end={end}
                                            index={index}
                                            showModal={showModal}
                                            duplicateRule={duplicateRule}
                                            setSplitModal={props.setSplitModal}
                                            splitRule={splitRule}
                                            setAlarm={props.setAlarm}
                                            toggleMenu={toggleMenu}
                                            alarm={props.alarm}
                                        />}
                                    </Row>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </Col>


            </Row>)
        }
    }
    return (
        <>
            {
                renderMain()
            }
            <Modal
                size="md"
                show={modal}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-4">
                    <h4 className="text-center mb-3">Are You Sure You want to delete this item?</h4>
                    <Row noGutters className="justify-content-center">
                        <Button onClick={() => { showModal(false) }} className="mr-1" variant="secondary">Close</Button>
                        <Button onClick={deleteRule} variant="danger">Delete</Button>
                    </Row>
                </Modal.Body>

            </Modal>
        </>
    )
}

Commodityval.propTypes = {
    selected_index: PropTypes.array,
    selectIndexes: PropTypes.func,
    check: PropTypes.bool,
    all: PropTypes.bool,
    start: PropTypes.string,
    end: PropTypes.string,
    trade: PropTypes.string,
    charge: PropTypes.string,
    comGroup: PropTypes.cieling,
    cargo: PropTypes.string,
    loadingArea: PropTypes.string,
    dischargeArea: PropTypes.string,
    loadingPort: PropTypes.string,
    dischargePort: PropTypes.string,
    conflict: PropTypes.bool,
    loadingCountry: PropTypes.bool,
    dischargeCountry: PropTypes.string,
    pod: PropTypes.string,
    pol: PropTypes.string,
    denomination: PropTypes.string,
    status: PropTypes.string,
    floors: PropTypes.string,
    setFloors: PropTypes.string,
    index: PropTypes.number,
    setDuplicate: PropTypes.func,
    setPublishCount: PropTypes.func,
    currentBu: PropTypes.string,
    del: PropTypes.bool,
    user: PropTypes.object,
    ID: PropTypes.string,
    alarm: PropTypes.bool,
    setAlarm: PropTypes.func,
    permission: PropTypes.string,
    split: PropTypes.number,
    setSplitModal: PropTypes.func,
    duplicate: PropTypes.bool,
    setInfo: PropTypes.func

}

export default Commodityval;