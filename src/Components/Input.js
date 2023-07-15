
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Row, Dropdown, Spinner } from 'react-bootstrap'
import { compareDate, reverseDate } from '../Utils';
import PropTypes from "prop-types"
import Button from "./Button"
import DateIcon from "../Utils/Svgs/date.svg"
const Input = (props) => {

    let [open, setOpen] = useState(true);
    const denomination_array = ["$", "%", "£", "€"];
    const {
        floadingArea,
        fdischargeArea,
        floadingCountry,
        fdischargeCountry,
        floadingPort,
        fdischargePort,
        fpod,
        fpol,
        ftrade,
        fcieling,
        fstart,
        fend,
        fcargo,
        ffloor,
        fdenomination
    } = props;
    useEffect(() => {
        console.log(props.selected_index)
    }, [props.selected_index])

    const cargo_array = [
        {
            CONTAINER_TYPE: "DV20",
            CONTAINER_GROUP: "DRY"
        },
        {
            CONTAINER_TYPE: "DV40",
            CONTAINER_GROUP: "DRY"
        },
        {
            CONTAINER_TYPE: "HC40",
            CONTAINER_GROUP: "DRY"
        }
    ]
    const find = (val, arr) => {
        let index = arr.findIndex(value => {
            return value == val;
        })
        return index;
    }
    let { index } = props;
    let [loader, setLoader] = useState(false);
    let [loadingArea, setLoadingArea] = useState((props.loadingArea) ? props.loadingArea : "");
    let [dischargeArea, setDischargeArea] = useState((props.dischargeArea) ? props.dischargeArea : "");
    let [loadingPort, setLoadingPort] = useState((props.loadingPort) ? props.loadingPort : "");
    let [dischargePort, setDischargePort] = useState((props.dischargePort) ? props.dischargePort : "");
    let [loadingCountry, setLoadingCountry] = useState((props.loadingCountry) ? props.loadingCountry : "");
    let [dischargeCountry, setDischargeCountry] = useState((props.dischargeCountry) ? props.dischargeCountry : "");
    let [pol, setPol] = useState((props.pol) ? props.pol : "");
    let [pod, setPod] = useState((props.pod) ? props.pod : "");
    let [cargo, setCargo] = useState((props.cargo) ? props.cargo : "");
    let [floor, setFloor] = useState((props.floor) ? props.floor : "");
    let [cieling, setCieling] = useState((props.cieling) ? props.cieling : "");
    let [start, setStart] = useState((props.start) ? reverseDate(props.start, "input") : "");
    let [end, setEnd] = useState((props.end) ? reverseDate(props.end, "input") : "");
    let [trade, setTrade] = useState((props.trade) ? props.trade : "");
    let [denomination, setDenomination] = useState((props.denomination) ? find(props.denomination, denomination_array) : -1);
    let [trade_array, setTradeArray] = useState([]);
    let [loading_area_array, setLoadingAreaArray] = useState([])
    let [pol_group_array, setPolGroupArray] = useState([]);
    let [loading_country_array, setPolCountryArray] = useState([])
    let [loading_port_array, setPolPortArray] = useState([])
    let [discharge_area_array, setDischargeAreaArray] = useState([])
    let [pod_group_array, setPodGroupArray] = useState([]);
    let [discharge_country_array, setPodCountryArray] = useState([])
    let [discharge_port_array, setPodPortArray] = useState([])
    let [alarm, setAlarm] = useState(false)
    // let [podValue, setPodValue] = useState("");
    // let [polValue, setPolValue] = useState("");

    //Fetching trade autocompletion based on bus


    useEffect(() => {
        console.log("hey i am changing")
        if ((props.selected_index.length > 1) && (props.selected_index.findIndex(val => val === index) >= 0) && (!props.duplicate)) {
            console.log(props.duplicate)
            if (ftrade !== null) setTrade(ftrade)
            if (floadingArea !== null) setLoadingArea(floadingArea)
            if (floadingCountry !== null) setLoadingCountry(floadingCountry)
            if (floadingPort !== null) setLoadingPort(floadingPort)
            if (fpol !== null) setPol(fpol)
            if (fdischargeArea !== null) setDischargeArea(fdischargeArea)
            if (fdischargeCountry !== null) setDischargeCountry(fdischargeCountry)
            if (fdischargePort !== null) setDischargePort(fdischargePort)
            if (fpod !== null) setPod(fpod)
            if (fend !== null) setEnd(fend)
            if (fcargo !== null) setCargo(fcargo)
            if (fstart !== null) setStart(fstart)
            if (fdenomination !== null) setDenomination(fdenomination)
            if (ffloor !== null) setFloor(ffloor)
            if (fcieling !== null) setCieling(fcieling)
        }
    }, [floadingArea,
        fdischargeArea,
        floadingCountry,
        fdischargeCountry,
        floadingPort,
        fdischargePort,
        fpod,
        fpol,
        ftrade,
        fcieling,
        fstart,
        fend,
        fcargo,
        ffloor,
        fdenomination])


    const fetchTrade = async (e) => {
        setTrade(e.target.value);
        // setTrade(e.target.value)
        if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
            props.setTrade(e.target.value)
        }
        if (props.duplicate && props.selected_index.length > 0) {
            let array = [...props.floors];
            let item = array[index];
            item.trade = e.target.value;
            props.setFloors(array);
        }
        const trades = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/trades`, {
            accessToken: props.user.accessToken,
            BU: props.currentBu,
            text: e.target.value
        });
        setTradeArray([...trades.data]);
    }
    //functions for fetching the autocompletion options

    const fetchLoadingArea = async (e) => {
        //checking if trade is filled or not
        if (trade != "") {
            setLoadingArea(e.target.value)
            setLoadingCountry('')
            setLoadingPort("")
            setPol("");
            //checking if the user is editing or creating new rule
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.loadingArea = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setLoadingArea(e.target.value)
                props.setLoadingCountry("")
                props.setLoadingPort("")
                props.setPol("");
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POL",
                    fuild: "AREA",
                    text: e.target.value,
                })
                setLoadingAreaArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POL",
                    fuild: "AREA",
                    text: e.target.value,
                    Trade: trade
                })
                setLoadingAreaArray(res.data);
            }
        }
        else {
            setLoadingArea("")
            setLoadingCountry('')
            setLoadingPort("")
            setPol("");
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setLoadingArea("")
                props.setLoadingCountry("")
                props.setLoadingPort("")
                props.setPol("");
            }
        }
    }

    const fetchDischargeArea = async (e) => {
        console.log(e.target.value);
        if (trade != "") {
            setDischargeArea(e.target.value)
            setDischargePort("")
            setDischargeCountry("")
            setPod("")
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.dischargeArea = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setDischargeArea(e.target.value)
                props.setDischargePort("")
                props.setDischargeCountry("")
                props.setPod("")
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POD",
                    fuild: "AREA",
                    text: e.target.value,
                })
                setDischargeAreaArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POD",
                    fuild: "AREA",
                    text: e.target.value,
                    Trade: trade
                })
                setDischargeAreaArray(res.data);
            }
        }
        else {
            setDischargeArea("")
            setDischargePort("")
            setDischargeCountry("")
            setPod("")
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setDischargeArea(e)
                props.setDischargePort("")
                props.setDischargeCountry("")
                props.setPod("")
            }
        }
    }

    const fetchLoadingGroup = async (e) => {
        if (trade != "") {
            setPol(e.target.value)
            setLoadingCountry('')
            setLoadingPort("")
            setLoadingArea("")
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.pol = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setLoadingArea("")
                props.setLoadingCountry("")
                props.setLoadingPort("")
                props.setPol(e.target.value);
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POL",
                    fuild: "GROUP",
                    text: e.target.value,
                })
                setPolGroupArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POL",
                    fuild: "GROUP",
                    text: e.target.value,
                    Trade: trade
                })
                setPolGroupArray(res.data);
            }
        }
    }
    const fetchDischargeGroup = async (e) => {
        if (trade != "") {
            setPod(e.target.value)
            setDischargeArea("")
            setDischargePort("")
            setDischargeCountry("")
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.pod = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setDischargeArea("")
                props.setDischargePort("")
                props.setDischargeCountry("")
                props.setPod(e.target.value)
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POD",
                    fuild: "GROUP",
                    text: e.target.value,
                })
                setPodGroupArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POD",
                    fuild: "GROUP",
                    text: e.target.value,
                    Trade: trade
                })
                setPodGroupArray(res.data);
            }
        }
    }

    const fetchLoadingCountry = async (e) => {
        if (trade != "") {
            setLoadingCountry(e.target.value)
            setLoadingPort("")
            setLoadingArea("")
            setPol("");
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.loadingCountry = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setLoadingCountry(e.target.value)
                props.setLoadingPort("")
                props.setLoadingArea("")
                props.setPol("");
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POL",
                    fuild: "COUNTRY",
                    text: e.target.value,
                })
                setPolCountryArray(res.data);

            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,

                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POL",
                    fuild: "COUNTRY",
                    text: e.target.value,
                    Trade: trade
                })
                setPolCountryArray(res.data);
            }

        }
    }

    const fetchDischargeCountry = async (e) => {
        if (trade != "") {
            setDischargeCountry(e.target.value)
            setDischargeArea("")
            setDischargePort("")
            setPod("")
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.dischargeCountry = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setDischargeArea("")
                props.setDischargePort("")
                props.setDischargeCountry(e.target.value)
                props.setPod("")
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POD",
                    fuild: "COUNTRY",
                    text: e.target.value,
                })
                setPodCountryArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,

                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POD",
                    fuild: "COUNTRY",
                    text: e.target.value,
                    Trade: trade
                })
                setPodCountryArray(res.data);
            }

        }
    }

    const fetchLoadingPort = async (e) => {
        if (trade != "") {
            setLoadingPort(e.target.value)
            setLoadingCountry("")
            setLoadingArea("")
            setPol("");
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.loadingPort = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setLoadingPort(e.target.value)
                props.setLoadingCountry("")
                props.setLoadingArea("")
                props.setPol("");
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POL",
                    fuild: "PORT",
                    text: e.target.value,
                })
                setPolPortArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POL",
                    fuild: "PORT",
                    text: e.target.value,
                    Trade: trade
                })
                setPolPortArray(res.data);
            }
        }
    }

    const fetchDischargePort = async (e) => {
        if (trade != "") {
            setDischargePort(e.target.value)
            setDischargeArea("")
            setDischargeCountry("")
            setPod("")
            if (props.duplicate && props.selected_index.length > 0) {
                let array = [...props.floors];
                let item = array[index];
                item.dischargePort = e.target.value;
                props.setFloors(array);
            }
            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                props.setDischargeArea("")
                props.setDischargePort(e.target.value)
                props.setDischargeCountry("")
                props.setPod("")
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    newItem: false,
                    POL_POD: "POD",
                    fuild: "PORT",
                    text: e.target.value
                })
                setPodPortArray(res.data);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
                    accessToken: props.user.accessToken,
                    BU: props.currentBu,
                    newItem: true,
                    POL_POD: "POD",
                    fuild: "PORT",
                    text: e.target.value,
                    Trade: trade
                })
                setPodPortArray(res.data);
            }
        }
    }

    useEffect(() => {
        console.log("trade array changed");
        setAlarm(!alarm)
    }, [trade_array])

    useEffect(() => {
    }, [props.currentBu])

    const createRule = async () => {
        let { floors, setFloors, index, setAlarm, alarm, status, selected_index, selectIndexes } = props;
        console.log({ status });
        let object = {
            start: (start != "") ? reverseDate(start, "output") : "", end: (end != "") ? reverseDate(end, "output") : "", trade, cieling, floor, cargo,
            loadingArea: loadingArea, dischargeArea: dischargeArea,
            loadingPort, dischargePort: dischargePort,
            loadingCountry: loadingCountry, dischargeCountry: dischargeCountry,
            pod: pod, pol: pol, denomination: denomination_array[denomination], conflict: false,
            status: (props.selected_index.length > 0) ? status : "NEW"
        };
        let find_index = floors.findIndex(val => {
            let new_obj = Object.assign({}, val);
            new_obj.status = undefined
            return JSON.stringify(new_obj) == JSON.stringify(object)
        });
        let result = {
            accessToken: props.user.accessToken,
            RULE_TYPE: "price_floor_and_ceiling",
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
            param1: denomination_array[denomination],
            param2: floor,
            param3: cieling
        }
        if (find_index >= 0)
            object.conflict = true
        let editSection = (selected_index.length >= 0) ? (selected_index.findIndex(val => val == index)) : -1;
        if (editSection >= 0) {
            let status = (object.status == undefined) ? "EDIT" : object.status
            object.status = status;
            result.ID = props.ID;
            try {
                setLoader(true);
                if (props.duplicate) {
                    delete result.ID
                }
                console.log("duplicate", props)
                let url = (props.duplicate) ? `${process.env.REACT_APP_BACKEND_URL}/addroule` : `${process.env.REACT_APP_BACKEND_URL}/rouleedit`;
                const res = await axios.post(url, result);
                object.ID = res.data.ID
                setFloors([object, ...floors]);
                setLoader(false);
                floors[index] = object;
                selected_index.splice(editSection, 1);
                selectIndexes(selected_index);
                setFloors(floors);
                if (props.duplicate) {
                    props.setInfo("duplicated");
                }
                else {
                    props.setInfo("change");
                }
                setAlarm(!alarm);
                props.setDuplicate(false);

                if (res.data.publishCount !== undefined) {
                    props.setPublishCount(res.data.publishCount)
                }

            }
            catch (e) {
                if (e.response.data) {
                    window.alert(e.response.data.message)
                }

                selected_index.splice(editSection, 1);
                selectIndexes([]);
                setLoader(false);
                props.setDuplicate(false);

            }
        }
        else {

            try {
                setLoader(true);
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addroule`, result);
                object.ID = res.data.ID
                console.log(floors[0], object);
                setFloors([object, ...floors]);
                console.log({ floors })
                props.setInfo("change");
                setLoader(false);
                setOpen(false);
            }
            catch (e) {
                if (e.response.data) {
                    window.alert(e.response.data.message)
                }
                setLoader(false);

                setOpen(false);
            }

        }
    }


    return (<>{
        open && <Row noGutters className="flex-nowrap input-row mb-1">

            <Col className="p-0 " xs={1}>

                <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                    <div className="col-3 p-0 pr-1">
                        {(!(props.selected_index.findIndex(val => val == props.index) >= 0)) ? <i onClick={() => {
                            setOpen(false)
                        }} className="fa fa-times ml-1" style={{ fontSize: 16 }} aria-hidden="true"></i> : <input checked={props.all || props.check} onChange={() => {
                            let { selected_index, index, selectIndexes } = props;
                            let el = selected_index.findIndex(val => val == index)
                            console.log(el);
                            if (el >= 0) {
                                selected_index.splice(el, 1);
                                if (props.duplicate) {
                                    let array = [...props.floors]
                                    array.splice(el, 1);
                                    props.setFloors(array);
                                }
                            }
                            selectIndexes(selected_index);

                            props.setAlarm(!props.alarm)
                        }} type="checkbox" />}
                    </div>
                    <div className="col-9 w-100">
                        <Dropdown onSelect={(e) => {
                            setTrade(trade_array[e].ZCR_TRGR)
                            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                console.log("changing props")
                                props.setTrade(trade_array[e].ZCR_TRGR)
                            }
                        }}>
                            <Dropdown.Toggle
                                className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} value={trade}
                                onChange={fetchTrade}
                                onFocus={fetchTrade}
                            >

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    trade_array.length > 0 && trade_array.map((val, index) => {
                                        return <Dropdown.Item key={`input_trade_${index}`} title={val.TXTLG} eventKey={index} active={index === trade}>{val.ZCR_TRGR}</Dropdown.Item>
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                </div>
            </Col>
            <Col className="p-0" xs={5}>
                <Row noGutters>
                    <Col className="p-0 " xs={6}>

                        <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                            <div className="col-2 p-0 ">
                                <Dropdown onSelect={(e) => {
                                    setLoadingArea(loading_area_array[e].AREA)
                                    setLoadingCountry("")
                                    setLoadingPort("")
                                    setPol("");
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setLoadingArea(loading_area_array[e].AREA)
                                        props.setLoadingCountry("")
                                        props.setLoadingPort("")
                                        props.setPol("");
                                    }

                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchLoadingArea}
                                        onFocus={fetchLoadingArea}
                                        value={loadingArea}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            loading_area_array.map((val, index) =>
                                                <Dropdown.Item key={`input_loading_area_${index}`} title={val.TXTMD} eventKey={index} active={index === loadingArea}>{val.AREA}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-5  p-0 pl-1 pr-1">
                                <Dropdown onSelect={(e) => {

                                    setPol(pol_group_array[e].PGRP);
                                    setLoadingCountry("")
                                    setLoadingPort("")
                                    setLoadingArea("")
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setPol(pol_group_array[e].PGRP);
                                        props.setLoadingCountry("")
                                        props.setLoadingPort("")
                                        props.setLoadingArea("")
                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchLoadingGroup}
                                        onFocus={fetchLoadingGroup}
                                        value={pol}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        {
                                            pol_group_array.map((val, index) => <Dropdown.Item key={`input_loading_group_${index}`} title={val.TXTSH} eventKey={index} active={index === pod}>{val.PGRP}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-3 p-0 pr-1">
                                <Dropdown onSelect={(e) => {
                                    setLoadingCountry(loading_country_array[e].COUNTRY)
                                    setLoadingPort("")
                                    setLoadingArea("")
                                    setPol("");
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setLoadingCountry(loading_country_array[e].COUNTRY)
                                        props.setLoadingPort("")
                                        props.setLoadingArea("")
                                        props.setPol("");
                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchLoadingCountry}
                                        onFocus={fetchLoadingCountry}
                                        value={loadingCountry}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            loading_country_array.map((val, index) => <Dropdown.Item key={`input_loading_country_${index}`} eventKey={index} title={val.TXTKG} active={index === loadingCountry}>{val.COUNTRY}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-2  p-0">
                                <Dropdown onSelect={(e) => {
                                    if (loading_port_array[e].ZGC_PORT == dischargePort) {
                                        window.alert("Port of landing cannot be same as port of discharge")
                                    }
                                    else {
                                        setLoadingPort(loading_port_array[e].ZGC_PORT)
                                        setLoadingCountry("")
                                        setLoadingArea("")
                                        setPol("");
                                        if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                            props.setLoadingPort(loading_port_array[e].ZGC_PORT)
                                            props.setLoadingCountry("")
                                            props.setLoadingArea("")
                                            props.setPol("");
                                        }

                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchLoadingPort}
                                        onFocus={fetchLoadingPort}
                                        value={loadingPort}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            loading_port_array.map((val, index) => <Dropdown.Item key={`input_loading_port_${index}`} title={val.PORT_DESC} eventKey={index} active={index === loadingPort}>{val.ZGC_PORT}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                    <Col className="p-0 " xs={6}>

                        <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                            <div className="col-2 p-0 ">

                                <Dropdown onSelect={(e) => {
                                    setDischargeArea(discharge_area_array[e].AREA)
                                    setDischargePort("")
                                    setDischargeCountry("")
                                    setPod("")
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setDischargeArea(discharge_area_array[e].AREA)
                                        props.setDischargePort("")
                                        props.setDischargeCountry("")
                                        props.setPod("")
                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchDischargeArea}
                                        onFocus={fetchDischargeArea}
                                        value={dischargeArea}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            discharge_area_array.map((val, index) =>
                                                <Dropdown.Item key={`input_discharge_area_${index}`} title={val.TXTMD} eventKey={index} active={index === loadingArea}>{val.AREA}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="col-5 p-0 pl-1 pr-1">
                                <Dropdown onSelect={(e) => {
                                    setPod(pod_group_array[e].PGRP)
                                    setDischargeArea("")
                                    setDischargePort("")
                                    setDischargeCountry("")
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setDischargeArea("")
                                        props.setDischargePort("")
                                        props.setDischargeCountry("")
                                        props.setPod(pod_group_array[e].PGRP)
                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchDischargeGroup}
                                        onFocus={fetchDischargeGroup}
                                        value={pod}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        {
                                            pod_group_array.map((val, index) => <Dropdown.Item key={`input_discharge_group_${index}`} title={val.TXTSH} eventKey={index} active={index === pod}>{val.PGRP}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-3 p-0 pr-1">
                                <Dropdown onSelect={(e) => {
                                    setDischargeCountry(discharge_country_array[e].COUNTRY)
                                    setDischargeArea("")
                                    setDischargePort("")
                                    setPod("")
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setDischargeArea("")
                                        props.setDischargePort("")
                                        props.setDischargeCountry(discharge_country_array[e].COUNTRY)
                                        props.setPod("")
                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchDischargeCountry}
                                        onFocus={fetchDischargeCountry}

                                        value={dischargeCountry}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            discharge_country_array.map((val, index) => <Dropdown.Item key={`input_discharge_country_${index}`} eventKey={index} title={val.TXTKG} active={index === loadingCountry}>{val.COUNTRY}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-2  p-0">
                                <Dropdown onSelect={(e) => {
                                    if (discharge_port_array[e].ZGC_PORT === loadingPort) {
                                        window.alert("Port of discharge cannot be same as port of landing");
                                    }
                                    else {
                                        setDischargePort(discharge_port_array[e].ZGC_PORT)
                                        setDischargeArea("")
                                        setDischargeCountry("")
                                        setPod("")

                                        if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                            props.setDischargeArea("")
                                            props.setDischargePort(discharge_port_array[e].ZGC_PORT)
                                            props.setDischargeCountry("")
                                            props.setPod("")
                                        }
                                    }


                                }}>
                                    <Dropdown.Toggle
                                        onChange={fetchDischargePort}
                                        onFocus={fetchDischargePort}
                                        value={dischargePort}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            discharge_port_array.map((val, index) => <Dropdown.Item key={`input_discharge_port_${index}`} title={val.PORT_DESC} eventKey={index} active={index === loadingPort}>{val.ZGC_PORT}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>

                </Row>
            </Col>
            <Col className="p-0" xs={6}>
                <Row noGutters>
                    <Col className="p-0 " xs={2}>

                        <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                            <div className="col-12 p-0 pr-1">
                                <Dropdown onSelect={(e) => {
                                    setCargo(cargo_array[e].CONTAINER_TYPE);
                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                        props.setCargo(cargo_array[e].CONTAINER_TYPE);
                                    }

                                    if (props.duplicate && props.selected_index.length > 0) {
                                        let array = [...props.floors];
                                        let item = array[index];
                                        item.cargo = cargo;
                                        props.setFloors(array);
                                    }
                                }}>
                                    <Dropdown.Toggle
                                        onChange={(e) => {
                                            setCargo(e.target.value)
                                        }}
                                        value={cargo}
                                        className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        {
                                            cargo_array.map((val, index) => <Dropdown.Item key={`input_discharge_cargo_${index}`} title={val.CONTAINER_GROUP} eventKey={index} active={index === loadingPort}>{val.CONTAINER_TYPE}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>

                            </div>

                        </div>
                    </Col>
                    <Col className="p-0 " xs={4}>

                        <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                            <div className="col-6 p-0 pr-1 position-relative">
                                <label htmlFor="top-start" className="m-0 w-100 input-val bg-white row no-gutters
                             justify-content-between align-items-center">
                                    <span>{(start !== "") ? reverseDate(start, "output") : ""}</span>
                                    <img src={DateIcon} />

                                </label>
                                <input
                                    id="top-start"
                                    style={{ position: "absolute", opacity: 0, top: 0, left: 0 }}
                                    onChange={(e) => {
                                        let val = e.target.value
                                        if (end != "") {
                                            if (compareDate(val, end)) {
                                                alert("Start date must be equal or less then end date")
                                                setStart("");
                                            }
                                            else {
                                                setStart(val);
                                                if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                                    props.setStart(val);
                                                }
                                                if (props.duplicate && props.selected_index.length > 0) {
                                                    let array = [...props.floors];
                                                    let item = array[index];
                                                    item.start = val;
                                                    props.setFloors(array);
                                                }
                                            }
                                        }
                                        else {
                                            setStart(val);
                                            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                                props.setStart(val);
                                            }
                                            if (props.duplicate && props.selected_index.length > 0) {
                                                let array = [...props.floors];
                                                let item = array[index];
                                                item.start = val;
                                                props.setFloors(array);
                                            }
                                        }
                                    }}
                                    value={start} className="w-100 border-0 input-val " type="date"
                                />
                            </div>
                            <div className="col-6 p-0 position-relative">
                                <label htmlFor="top-start" className="m-0 w-100 input-val bg-white row no-gutters
                             justify-content-between align-items-center">
                                    <span>{(end !== "") ? reverseDate(end, "output") : ""}</span>
                                    <img src={DateIcon} />

                                </label>
                                <input
                                    style={{ position: "absolute", opacity: 0, top: 0, left: 0 }}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (start != "") {
                                            if (compareDate(start, val)) {

                                                alert("end date must be equal or later than the start date");
                                                setEnd("");
                                            }
                                            else {
                                                setEnd(val)
                                                if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                                    props.setEnd(val);
                                                }
                                                if (props.duplicate && props.selected_index.length > 0) {
                                                    let array = [...props.floors];
                                                    let item = array[index];
                                                    item.start = val;
                                                    props.setFloors(array);
                                                }
                                            }
                                        }
                                        else {
                                            setEnd(val);
                                            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                                props.setEnd(val);
                                            }
                                            if (props.duplicate && props.selected_index.length > 0) {
                                                let array = [...props.floors];
                                                let item = array[index];
                                                item.start = val;
                                                props.setFloors(array);
                                            }

                                        }
                                    }}
                                    value={end}
                                    className="w-100 border-0 input-val "
                                    type="date"
                                />
                            </div>

                        </div>
                    </Col>
                    <Col className="p=0" xs={3}>
                        <Row noGutters>
                            <Col className="p-0 " xs={6}>

                                <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                                    <div className="col-12 p-0 pr-1">
                                        <Dropdown onSelect={(e) => {
                                            setDenomination(e)
                                            if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                                props.setDenomination(e)

                                            }
                                            if (props.duplicate) {
                                                let array = [...props.floors];
                                                let item = array[index];
                                                item.denomination = denomination_array[e]
                                                props.setFloors(array);
                                            }
                                        }}>
                                            <Dropdown.Toggle className={`bg-white row no-gutters p-1 align-items-center input-val ${(denomination === -1) ? "justify-content-end" : "justify-content-center "}`} as={"div"} >
                                                {denomination_array[denomination]}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu >
                                                {
                                                    denomination_array.map((val, index) => <Dropdown.Item key={`input_discharge_deno${index}`} eventKey={index} active={index === denomination}>{val}</Dropdown.Item>)
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                </div>

                            </Col>
                            <Col className="p-0 " xs={6}>

                                <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                                    <div className="col-12 p-0 pr-1">
                                        <input type="number" value={floor}
                                            onBlur={(e) => {
                                                if (!((props.selected_index.findIndex(val => val === index) >= 0) && props.selected_index.length > 1)) {
                                                    if (cieling != "" && parseInt(e.target.value) > cieling) {
                                                        setFloor("");
                                                        props.setFloor("");
                                                        alert("The value in Ceiling filed must be equal or greater than the value in floor field")

                                                    }
                                                }
                                            }}
                                            onChange={
                                                (e) => {
                                                    setFloor(parseInt(e.target.value))
                                                    if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                                        props.setFloor(parseInt(e.target.value))
                                                    }
                                                    if (props.duplicate) {
                                                        let array = [...props.floors];
                                                        let item = array[index];
                                                        item.floor = parseInt(e.target.value);
                                                        props.setFloors(array);
                                                    }
                                                }
                                            } className="w-100  input-val" />
                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="p-0" xs={3}>

                        <div className="top-option-tab row no-gutters p-1 pt-2 pb-2  align-items-center w-100 h-max-content">
                            <div className="col-5 p-0 pr-1">
                                <input type="number" value={cieling}
                                    onBlur={(e) => {
                                        if (((props.selected_index.findIndex(val => val === index) >= 0) && props.selected_index.length > 1)) {
                                            if (floor != "" && parseInt(e.target.value) < floor) {
                                                props.setCieling("");
                                                setCieling("");
                                                alert("The value in Ceiling filed must be equal or greater than the value in floor field");

                                            }
                                        }
                                    }}
                                    onChange={(e) => {

                                        setCieling(parseInt(e.target.value))
                                        if (props.selected_index.length > 1 && (props.selected_index.findIndex(val => val === index) >= 0)) {
                                            props.setCieling(parseInt(e.target.value))
                                        }
                                        if (props.duplicate && props.selected_index.length > 0) {
                                            let array = [...props.floors];
                                            let item = array[index];
                                            item.cieling = parseInt(e.target.value);
                                            props.setFloors(array);
                                        }
                                    }}
                                    className="w-100  input-val" />
                            </div>
                            <div className="col-7 p-0 pr-1 row no-gutters justify-content-center align-items-center">
                                {
                                    (start === "" || end === "" || !(dischargeArea !== "" || dischargeCountry !== "" || dischargePort !== "" || pod !== "") ||
                                        !(loadingArea !== "" || loadingCountry !== "" || loadingPort !== "" || pol !== "") || trade === "" || cargo === "" || denomination === "" || floor === "" || isNaN(floor) || cieling === "" || isNaN(cieling)) ? "" : (props.selected_index == undefined) ? <Button onClick={createRule} className="p-0 w-100 small-font" text={(loader) ? <Row className="w-100 justify-content-center" noGutters>{"Creating"}<Spinner size="sm" animation="border" /></Row> : "Create"}>

                                        </Button> : (props.selected_index.length > 1) ? "" : <Button text={(props.selected_index.findIndex(val => props.index === val) >= 0) ? (loader) ? <Row className="w-100 justify-content-center" noGutters>{"Saving"}<Spinner size="sm" animation="border" /></Row> : "Save" : (loader) ? <Row className="w-100 justify-content-center" noGutters>{"Creating"}<Spinner size="sm" animation="border" /></Row> : "CREATE"} onClick={createRule} style={{ height: 25, maxWidth: 80 }} className="p-0 w-75 small-font" variant="dark" >

                                        </Button>
                                }
                            </div>


                        </div>
                    </Col>
                </Row>
            </Col>


        </Row>
    }</>)
}

Input.propTypes = {
    selected_index: PropTypes.array,
    selectIndexes: PropTypes.func,
    check: PropTypes.bool,
    all: PropTypes.bool,
    start: PropTypes.string,
    end: PropTypes.string,
    trade: PropTypes.string,
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
    floor: PropTypes.string,
    cieling: PropTypes.string,
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
    setTrade: PropTypes.func,
    setDischargeArea: PropTypes.func,
    setDischargeCountry: PropTypes.func,
    setDischargePort: PropTypes.func,
    setPod: PropTypes.func,
    setPol: PropTypes.func,
    setLoadingArea: PropTypes.func,
    setLoadingCountry: PropTypes.func,
    setLoadingPort: PropTypes.func,
    setStart: PropTypes.func,
    setEnd: PropTypes.func,
    setCargo: PropTypes.func,
    setCieling: PropTypes.func,
    setFloor: PropTypes.func,
    setDenomination: PropTypes.func,
    duplicate: PropTypes.bool,
    edit: PropTypes.bool,
    setInfo: PropTypes.func,
    getRules: PropTypes.getRules,
    floadingArea: PropTypes.string,
    fdischargeArea: PropTypes.string,
    floadingCountry: PropTypes.string,
    fdischargeCountry: PropTypes.string,
    floadingPort: PropTypes.string,
    fdischargePort: PropTypes.string,
    fpod: PropTypes.string,
    fpol: PropTypes.string,
    ftrade: PropTypes.string,
    fcieling: PropTypes.string,
    fstart: PropTypes.string,
    fend: PropTypes.string,
    fcargo: PropTypes.string,
    ffloor: PropTypes.string,
    fdenomination: PropTypes.string,
    fduplicate: PropTypes.string

}



export default Input;