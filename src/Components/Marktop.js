import { Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { reverseDate, compareDate } from '../Utils';
import Sorttab from './Sorttab';
import axios from 'axios';
import PropTypes from 'prop-types';
import DateIcon from "../Utils/Svgs/date.svg"
const Marktop = ({ selectIndexes, floors, setTempFloors, setFloors, nav, user, currentBu }) => {


    const denomination_array = ["$", "%", "£", "€"];
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

    let [loadingArea, setLoadingArea] = useState("");
    let [all, selectAll] = useState(false)
    let [dischargeArea, setDischargeArea] = useState("");
    let [loadingPort, setLoadingPort] = useState("");
    let [dischargePort, setDischargePort] = useState("");
    let [loadingCountry, setLoadingCountry] = useState("");
    let [dischargeCountry, setDischargeCountry] = useState("");
    let [pol, setPol] = useState("");
    let [pod, setPod] = useState("");
    let [cargo, setCargo] = useState("");
    let [charge, setCharge] = useState("");
    let [start, setStart] = useState("");
    let [end, setEnd] = useState("");
    let [trade, setTrade] = useState("");
    let [denomination, setDenomination] = useState(-1);
    let [clear, setClear] = useState(false)
    let [trade_array, setTradeArray] = useState([]);
    let [loading_area_array, setLoadingAreaArray] = useState([])
    let [pol_group_array, setPolGroupArray] = useState([]);
    let [loading_country_array, setPolCountryArray] = useState([])
    let [loading_port_array, setPolPortArray] = useState([])
    let [discharge_area_array, setDischargeAreaArray] = useState([])
    let [pod_group_array, setPodGroupArray] = useState([]);
    let [discharge_country_array, setPodCountryArray] = useState([])
    let [discharge_port_array, setPodPortArray] = useState([])
    let [orderBy, setOrderBy] = useState(null);
    let [filter, setFilter] = useState(null);
    let [hide, setHide] = useState(null);

    const fetchTrade = async (e) => {
        setTrade(e.target.value);
        const trades = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/trades`, {
            accessToken: user.accessToken,
            BU: currentBu,
            text: e.target.value
        });
        setTradeArray([...trades.data]);
    }
    //functions for fetching the autocompletion options

    const fetchLoadingArea = async (e) => {
        setLoadingArea(e.target.value)
        setLoadingCountry('')
        setLoadingPort("")
        setPol("");
        //checking if the user is editing or creating new rule
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            BU: currentBu,
            newItem: false,
            POL_POD: "POL",
            fuild: "AREA",
            text: e.target.value
        })
        setLoadingAreaArray(res.data);
    }

    const fetchDischargeArea = async (e) => {
        setDischargeArea(e.target.value)
        setDischargePort("")
        setDischargeCountry("")
        setPod("")
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POD",
            fuild: "AREA",
            text: e.target.value,
        })
        setDischargeAreaArray(res.data);
    }

    const fetchLoadingGroup = async (e) => {
        setPol(e.target.value)
        setLoadingCountry('')
        setLoadingPort("")
        setLoadingArea("")
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POL",
            fuild: "GROUP",
            text: e.target.value,
        })
        setPolGroupArray(res.data);
    }
    const fetchDischargeGroup = async (e) => {
        setPod(e.target.value)
        setDischargeArea("")
        setDischargePort("")
        setDischargeCountry("")
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POD",
            fuild: "GROUP",
            text: e.target.value,
        })
        setPodGroupArray(res.data);

    }

    const fetchLoadingCountry = async (e) => {
        setLoadingCountry(e.target.value)
        setLoadingPort("")
        setLoadingArea("")
        setPol("");
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POL",
            fuild: "COUNTRY",
            text: e.target.value,
        })
        setPolCountryArray(res.data);
    }

    const fetchDischargeCountry = async (e) => {
        setDischargeCountry(e.target.value)
        setDischargeArea("")
        setDischargePort("")
        setPod("")
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POD",
            fuild: "COUNTRY",
            text: e.target.value,
        })
        setPodCountryArray(res.data);
    }

    const fetchLoadingPort = async (e) => {
        setLoadingPort(e.target.value)
        setLoadingCountry("")
        setLoadingArea("")
        setPol("");
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POL",
            fuild: "PORT",
            text: e.target.value,
        })
        setPolPortArray(res.data);
    }

    const fetchDischargePort = async (e) => {
        setDischargePort(e.target.value)
        setDischargeArea("")
        setDischargeCountry("")
        setPod("")
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/Location`, {
            accessToken: user.accessToken,
            newItem: false,
            POL_POD: "POD",
            fuild: "PORT",
            text: e.target.value
        })
        setPodPortArray(res.data);
    }

    const sort = async (orderby) => {

        let final_params = {
            accessToken: user.accessToken,
            BU: currentBu,
            Type: nav,
            userID: user.ID,
            orderby: JSON.stringify({ [`${orderby}`]: "ACE" })

        }
        if (filter !== null) {
            final_params.filter = filter;
        }
        if (hide !== null) {
            final_params.hide = hide;
        }
        setOrderBy(JSON.stringify({ [`${orderby}`]: "ACE" }))
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/rulesFilter`, final_params);
        let rules = res.data.Rules.map(val => {
            let { TRADE, RULE_TYPE, POL_AREA, POL_COUNTRY, POL_GROUP_CODE, POL_CODE, POD_AREA, POD_COUNTRY, POD_GROUP_CODE, POD_CODE, CONTAINER_TYPE, START, END, STATUS, CONFLICT, ID } = val;
            let PARAMETERS = JSON.parse(val.PARAMETERS)
            let obj = {
                trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : undefined, conflict: (CONFLICT != null) ? true : false,
                charge: PARAMETERS.price_change, denomination: PARAMETERS.unit_type, ID
            }


            return obj;
        });
        console.log({ rules });
        setFloors(rules)
    }

    const reset = () => {
        setTrade("")
        setLoadingArea("")
        setLoadingCountry("")
        setLoadingPort("")
        setPol("")
        setPod("")
        setDischargeArea("")
        setDischargeCountry("")
        setDischargePort("")
        setPol("");
        setStart("");
        setEnd("");
        setCargo("");
        setCharge("")
        setDenomination(-1);
    }

    const fetchFilterResult = async () => {
        let params = {};
        if (trade !== "") params.TRADE = trade;
        if (trade === "") delete params.TRADE;
        if (loadingArea !== "") params.POL_AREA = loadingArea;
        if (loadingArea == "") delete params.POL_AREA;
        if (loadingCountry !== "") params.POL_COUNTRY = loadingCountry;
        if (loadingCountry == "") delete params.POL_COUNTRY;
        if (loadingPort !== "") params.POL_CODE = loadingPort;
        if (loadingPort === "") delete params.POL_CODE;
        if (pol !== "") params.POL_GROUP_CODE = pol;
        if (pol === "") delete params.POL_GROUP_CODE;
        if (dischargeArea !== "") params.POD_AREA = dischargeArea;
        if (dischargeArea == "") delete params.POD_AREA;
        if (dischargeCountry !== "") params.POD_COUNTRY = dischargeCountry;
        if (dischargeCountry === "") delete params.POD_COUNTRY;
        if (dischargePort !== "") params.POD_CODE = dischargePort;
        if (dischargePort === "") delete params.POD_CODE;
        if (pod !== "") params.POD_GROUP_CODE = pol;
        if (pod === "") delete params.POD_GROUP_CODE;
        if (start !== "") params.START = start;
        if (start === "") delete params.START;
        if (end !== "") params.END = end;
        if (end === "") delete params.END;
        if (cargo !== "") params.CONTAINER_TYPE = cargo;
        if (cargo === "") delete params.cargo;
        if (denomination >= 0) params.param1 = denomination_array[denomination];
        if (denomination === -1) delete params.param1;
        if (charge !== "") params.param1 = charge;
        if (charge === "") delete params.param1;
        let keys = Object.keys(params);
        let param_array = keys.map(val => {
            console.log(val);
            let obj = {}
            obj[val] = params[val]
            return obj;
        })
        let final_params = {};
        if (keys.length > 0) {
            setFilter(JSON.stringify(param_array))
            final_params = {

                BU: currentBu,
                accessToken: user.accessToken,
                userID: user.ID,
                Type: "market_condition_price",
                filter: JSON.stringify(param_array)
            }
            setClear(true);

        }
        else {
            setFilter(null)
            final_params = {

                BU: currentBu,
                accessToken: user.accessToken,
                userID: user.ID,
                Type: "market_condition_price"
            }
            setClear(false);
        }
        if (orderBy !== null) {
            final_params.orderBy = orderBy;
        }
        if (hide !== null) {
            final_params.hide = hide;
        }

        console.log(final_params)
        try {

            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/rulesFilter`, final_params);
            let rules = res.data.Rules.map(val => {
                let { TRADE, RULE_TYPE, POL_AREA, POL_COUNTRY, POL_GROUP_CODE, POL_CODE, POD_AREA, POD_COUNTRY, POD_GROUP_CODE, POD_CODE, CONTAINER_TYPE, START, END, STATUS, CONFLICT, ID } = val;
                let PARAMETERS = JSON.parse(val.PARAMETERS)
                let obj = {
                    trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                    dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                    start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : undefined, conflict: (CONFLICT != null) ? true : false,
                    charge: PARAMETERS.price_change, denomination: PARAMETERS.unit_type, ID
                }
                return obj;
            })
            setFloors(rules);


        }
        catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        fetchFilterResult()
    }, [loadingArea, dischargeArea, loadingCountry, dischargeCountry, loadingPort, dischargePort, pol, pod, cargo, charge, start, end, trade, denomination])
    return (<Row noGutters className="flex-nowrap top">

        <Col className="p-0 pr-1" xs={1}>
            <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">

            </div>
            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                <div className="col-3 p-0 pr-1 position-relative">
                    <input className="position-absolute" style={{ top: -3 }} checked={all} onChange={(e) => {
                        selectAll(e.target.checked);
                        let array = [];
                        if (e.target.checked) {
                            array = floors.map((val, i) => i)
                        }
                        selectIndexes(array);
                    }} type="checkbox" />
                </div>
                <div className="col-9 p-0">
                    <label className="m-0 bold">TRADE <span onClick={() => sort("TRADE")} className="ml-1"><i className="fas fa-sort"></i></span></label>
                </div>
            </div>
            <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                <div className="col-3 p-0 pr-1">
                </div>
                <div className="col-9 w-100">
                    <Dropdown onSelect={(e) => {
                        setTrade(trade_array[e].ZCR_TRGR)

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
                                    return <Dropdown.Item key={`marktop_trading_${index}`} title={val.TXTLG} eventKey={index} active={index === trade}>{val.ZCR_TRGR}</Dropdown.Item>
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </Col>
        <Col className="p-0" xs={5}>

            <Row noGutters>
                <Col className="p-0" xs={6}>
                    <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">
                        <Sorttab setHide={setHide} setOrderBy={setOrderBy} filter={filter} setFloors={setFloors} floors={floors} user={user} currentBu={currentBu} nav={nav} setTempFloors={setTempFloors} name="LOADING" />
                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-2 p-0 ">
                            <label className="bold m-0">AREA <span className="ml-1"><i onClick={() => sort("POL_AREA")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-5 p-0 pl-1 pr-1">
                            <label className="bold m-0">POL GROUP <span className="ml-1"><i onClick={() => sort("POL_GROUP_CODE")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-3 p-0 pr-1">
                            <label className="bold m-0">COUNTRY <span className="ml-1"><i onClick={() => sort("POL_COUNTRY")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-2 ">
                            <label className="bold m-0">PORT <span className="ml-1"><i onClick={() => sort("POL_CODE")} className="fas fa-sort"></i></span></label>
                        </div>
                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-2 p-0 ">
                            <Dropdown onSelect={(e) => {
                                setLoadingArea(loading_area_array[e].AREA)
                                setLoadingCountry("")
                                setLoadingPort("")
                                setPol("");

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
                                            <Dropdown.Item title={val.TXTMD} key={`top_loading_area_${index}`} eventKey={index} active={index === loadingArea}>{val.AREA}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-5 p-0 pr-1 pl-1">
                            <Dropdown onSelect={(e) => {

                                setPol(pol_group_array[e].PGRP);
                                setLoadingCountry("")
                                setLoadingPort("")
                                setLoadingArea("")
                            }}>
                                <Dropdown.Toggle
                                    onChange={fetchLoadingGroup}
                                    value={pol}
                                    onFocus={fetchLoadingGroup}
                                    className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                </Dropdown.Toggle>
                                <Dropdown.Menu >
                                    {
                                        pol_group_array.map((val, index) => <Dropdown.Item key={`top_loading_group_${index}`} title={val.TXTSH} eventKey={index} active={index === pod}>{val.PGRP}</Dropdown.Item>)
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
                            }}>
                                <Dropdown.Toggle
                                    onChange={fetchLoadingCountry}
                                    value={loadingCountry}
                                    className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                </Dropdown.Toggle>

                                <Dropdown.Menu >
                                    {
                                        loading_country_array.map((val, index) => <Dropdown.Item
                                            eventKey={index} key={`top_loading_country_${index}`} title={val.TXTKG} active={index === loadingCountry}>{val.COUNTRY}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-2  p-0">
                            <Dropdown onSelect={(e) => {
                                setLoadingPort(loading_port_array[e].ZGC_PORT)
                                setLoadingCountry("")
                                setLoadingArea("")
                                setPol("");
                            }}>
                                <Dropdown.Toggle
                                    onChange={fetchLoadingPort}
                                    onFocus={fetchLoadingPort}
                                    value={loadingPort}
                                    className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                </Dropdown.Toggle>

                                <Dropdown.Menu >
                                    {
                                        loading_port_array.map((val, index) => <Dropdown.Item title={val.PORT_DESC}
                                            key={`top_loading_port_${index}`} eventKey={index} active={index === loadingPort}>{val.ZGC_PORT}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Col>
                <Col className="p-0 " xs={6}>
                    <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">
                        <Sorttab setHide={setHide} setOrderBy={setOrderBy} filter={filter} setFloors={setFloors} floors={floors} user={user} currentBu={currentBu} nav={nav} setTempFloors={setTempFloors} name="DISCHARGE" />
                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-2 p-0 ">
                            <label className="bold m-0">AREA <span className="ml-1"><i onClick={() => sort("POD_AREA")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-5 p-0 pr-1 pl-1">
                            <label className="bold m-0">POD GROUP <span className="ml-1"><i onClick={() => sort("POD_GROUP_CODE")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-3 p-0 pr-1">
                            <label className="bold m-0">COUNTRY <span className="ml-1"><i onClick={() => sort("POD_COUNTRY")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-2 ">
                            <label className="bold m-0">PORT <span className="ml-1"><i onClick={() => sort("POD_CODE")} className="fas fa-sort"></i></span></label>
                        </div>
                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-2 p-0">

                            <Dropdown onSelect={(e) => {
                                setDischargeArea(discharge_area_array[e].AREA)
                                setDischargePort("")
                                setDischargeCountry("")
                                setPod("")
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
                                            <Dropdown.Item key={`top_discharge_area_${index}`} title={val.TXTMD} eventKey={index} active={index === loadingArea}>{val.AREA}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="col-5 p-0 pr-1 pl-1">
                            <Dropdown onSelect={(e) => {
                                setPod(pod_group_array[e].PGRP)
                                setDischargeArea("")
                                setDischargePort("")
                                setDischargeCountry("")
                            }}>
                                <Dropdown.Toggle
                                    onChange={fetchDischargeGroup}
                                    value={pod}
                                    className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                </Dropdown.Toggle>
                                <Dropdown.Menu >
                                    {
                                        pod_group_array.map((val, index) => <Dropdown.Item key={`top_discharge_group_${index}`} title={val.TXTSH} eventKey={index} active={index === pod}>{val.PGRP}</Dropdown.Item>)
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
                            }}>
                                <Dropdown.Toggle
                                    onChange={fetchDischargeCountry}
                                    onFocus={fetchDischargeCountry}
                                    value={dischargeCountry}
                                    className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                </Dropdown.Toggle>

                                <Dropdown.Menu >
                                    {
                                        discharge_country_array.map((val, index) => <Dropdown.Item eventKey={index}
                                            key={`top_discharge_country_${index}`} title={val.TXTKG} active={index === loadingCountry}>{val.COUNTRY}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-2  p-0">
                            <Dropdown onSelect={(e) => {
                                setDischargePort(discharge_port_array[e].ZGC_PORT)
                                setDischargeArea("")
                                setDischargeCountry("")
                                setPod("")


                            }}>
                                <Dropdown.Toggle
                                    onChange={fetchDischargePort}
                                    onFocus={fetchDischargePort}
                                    value={dischargePort}
                                    className={` border-none row no-gutters p-1 align-items-center input-val w-100`} as={"input"} >

                                </Dropdown.Toggle>

                                <Dropdown.Menu >
                                    {
                                        discharge_port_array.map((val, index) => <Dropdown.Item
                                            key={`top_discharge_port_${index}`} title={val.PORT_DESC} eventKey={index} active={index === loadingPort}>{val.ZGC_PORT}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>
                </Col>
            </Row>
        </Col>
        <Col xs={6} className="p-0">
            <Row noGutters>
                <Col className="p-0 " xs={2}>
                    <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-12 p-0 pr-1">
                            <label className="bold m-0">EQUIP. TYPE <span className="ml-1"><i onClick={() => sort("CONTAINER_TYPE")} className="fas fa-sort"></i></span></label>
                        </div>

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-12 p-0 pr-1">
                            <Dropdown onSelect={(e) => {
                                setCargo(cargo_array[e].CONTAINER_TYPE);
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
                                        cargo_array.map((val, index) => <Dropdown.Item key={`top_discharge_cargo_${index}`} title={val.CONTAINER_GROUP} eventKey={index} active={index === loadingPort}>{val.CONTAINER_TYPE}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>
                </Col>
                <Col className="p-0 pr-1" xs={4}>
                    <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">
                        <Sorttab setFloors={setFloors} floors={floors} user={user} currentBu={currentBu} nav={nav} setTempFloors={setTempFloors} name="VALIDITY DATE" />
                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-6 p-0 pr-1">
                            <label className="bold m-0">START <span className="ml-1"><i onClick={() => sort("START")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-6 p-0 pr-1">
                            <label className="bold m-0">END <span className="ml-1"><i onClick={() => sort("END")} className="fas fa-sort"></i></span></label>
                        </div>

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-6 p-0 pr-1 position-relative bg-white">
                            <label htmlFor="top-start" className="m-0 w-100 input-val  row no-gutters
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

                                        }
                                    }
                                    else {
                                        setStart(val);

                                    }
                                }}
                                value={start} className="w-100 border-0 input-val " type="date"
                            />
                        </div>
                        <div className="col-6 p-0 position-relative bg-white">
                            <label htmlFor="top-start" className="m-0 w-100 input-val  row no-gutters
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

                                        }
                                    }
                                    else {
                                        setEnd(val);

                                    }
                                }}
                                value={end}
                                className="w-100 border-0 input-val "
                                type="date"
                            />
                        </div>

                    </div>
                </Col>
                <Col className="p-0 pr-1" xs={2}>
                    <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-12 p-0 pr-1">
                            <label className="bold m-0">$ OR % <span className="ml-1"><i onClick={() => sort("param1")} className="fas fa-sort"></i></span></label>
                        </div>

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-12 p-0 pr-1">
                            <Dropdown onSelect={(e) => { setDenomination(e) }}>
                                <Dropdown.Toggle className={` row no-gutters p-1 bg-white align-items-center input-val ${(denomination === -1) ? "justify-content-end" : "justify-content-center "}`} as={"div"} >
                                    {denomination_array[denomination]}
                                </Dropdown.Toggle>

                                <Dropdown.Menu >
                                    {
                                        denomination_array.map((val, index) => <Dropdown.Item
                                            key={`top_discharge_deno_${index}`} eventKey={index} active={index === denomination}>{val}</Dropdown.Item>)
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>

                </Col>

                <Col className="p-0" xs={4}>
                    <div className="top-tab row no-gutters justify-content-center  align-items-center w-100">

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-5 p-0 pr-1">
                            <label className="bold m-0">CHARGE <span className="ml-1"><i onClick={() => sort("param2")} className="fas fa-sort"></i></span></label>
                        </div>
                        <div className="col-7 p-0 pr-1">
                            <label className="bold m-0"></label>
                        </div>

                    </div>
                    <div className="top-option-tab row no-gutters p-1  align-items-center w-100 h-max-content">
                        <div className="col-5 p-0 pr-1">
                            <input type="text " value={charge} onChange={(e) => setCharge(e.target.value)} className="w-100 input-val" />
                        </div>
                        <div className="col-7 p-0">
                            {clear && <label onClick={reset} className="bold m-0" style={{ color: "#133C8B", fontSize: 14 }}>
                                <i className="far fa-times-circle"></i>
                                CLEAR
                            </label>}
                        </div>

                    </div>
                </Col>


            </Row>
        </Col>
    </Row>
    )
}
Marktop.propTypes = {
    selectIndexes: PropTypes.array, floors: PropTypes.array,
    setTempFloors: PropTypes.func, setFloors: PropTypes.func,
    user: PropTypes.object,
    currentBu: PropTypes.string, nav: PropTypes.string
}

export default Marktop;