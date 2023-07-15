import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap';
import Button from "./Button"
import { reverseDate } from '../Utils';
import PropTypes from 'prop-types';
import LoadingSvg from "../Utils/Svgs/loading.svg"
import DischargeSvg from "../Utils/Svgs/discharge.svg"
import Checkbox from "../Utils/Svgs/checkbox.svg"
import { ToggleOff, ToggleOn } from '../Utils/Svgs';


const Sorttab = ({ name, setFloors, user, currentBu, nav, filter, setOrderBy, setHide }) => {

    let [open, setOpen] = useState(false);
    let [sortState, setSortState] = useState("");
    let [ptoggle, setPtoggle] = useState(true);
    let [ctoggle, setCtoggle] = useState(true)
    let [gtoggle, setGtoggle] = useState(true);
    let [atoggle, setAreaToggle] = useState(true);
    let [loadingAllow, setLoadingAllow] = useState(false)

    const toggleEachOn = () => {
        setPtoggle(true);
        setCtoggle(true);
        setGtoggle(true);
        setAreaToggle(true)
    }

    const toggleEachOff = () => {
        setPtoggle(false);
        setCtoggle(false);
        setGtoggle(false);
        setAreaToggle(false)
    }

    useEffect(() => {
        if (sortState === "" && (!ptoggle || !ctoggle || !gtoggle || !atoggle)) {
            setLoadingAllow(true)
            console.log("allowed")
        }
        else {
            setLoadingAllow(false)
        }
    }, [ptoggle, ctoggle, gtoggle, atoggle])
    const sort = async () => {

        let hidden = [];

        if (name === "LOADING") {
            if (!ptoggle) hidden.push("POL_CODE");
            if (!ctoggle) hidden.push("POL_COUNTRY");
            if (!gtoggle) hidden.push("POL_GROUP_CODE");
            if (!atoggle) hidden.push("POL_AREA")
        }
        else if (name === "DISCHARGE") {
            if (!ptoggle) hidden.push("POD_CODE");
            if (!ctoggle) hidden.push("POD_COUNTRY");
            if (!gtoggle) hidden.push("POD_GROUP_CODE");
            if (!atoggle) hidden.push("POD_AREA")
        }
        let flag = true;
        let orderby = {}
        if (sortState === "ptoa") {
            orderby = { PRIORITY: "ACE" }

        }
        else if (sortState === "atop") {
            orderby = { PRIORITY: "DEC" }

        }
        else if (sortState === "start") {
            orderby = { START: "ACE" }
        }
        else if (sortState === "end") {
            orderby = { END: "ACE" }
        }
        else {
            flag = false;
        }
        if (flag) {
            setOrderBy(JSON.stringify(orderby))
        }
        else {
            setOrderBy(null);
        }
        let final_params = {
            accessToken: user.accessToken,
            BU: currentBu,
            Type: nav,
            userID: user.ID,
            orderby: JSON.stringify(orderby)
        }
        if (!flag) {
            delete final_params.orderby;
        }
        if (hidden.length > 0) {
            final_params.hide = JSON.stringify(hidden);
            setHide(JSON.stringify(hidden))
        }
        else {
            setHide(null);
        }
        if (filter !== null) {
            final_params.filter = filter;
        }
        console.log(hidden)
        console.log(orderby)

        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/rulesFilter`, final_params);
        let rules = res.data.Rules.map(val => {
            let { TRADE, RULE_TYPE, POL_AREA, POL_COUNTRY, POL_GROUP_CODE, POL_CODE, POD_AREA, POD_COUNTRY, POD_GROUP_CODE, POD_CODE, CONTAINER_TYPE, START, END, STATUS, CONFLICT, ID } = val;
            let PARAMETERS = JSON.parse(val.PARAMETERS)
            let obj = {};
            console.log({ nav })
            if (nav === "price_floor_and_ceiling") {
                obj = {
                    trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                    dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                    start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : undefined, conflict: (CONFLICT != null) ? true : false,
                    cieling: PARAMETERS.price_ceiling, floor: PARAMETERS.price_floor, denomination: PARAMETERS.unit_type, ID

                }
            }
            else if (nav === "market_condition_price") {
                obj = {
                    trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                    dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                    start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : undefined, conflict: (CONFLICT != null) ? true : false,
                    charge: PARAMETERS.price_change, denomination: PARAMETERS.unit_type, ID
                }
            }
            else if (nav === "comm") {
                obj = {
                    trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                    dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                    start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : undefined, conflict: (CONFLICT != null) ? true : false,
                    charge: PARAMETERS.price_change, comGroup: PARAMETERS.commodity_type, denomination: PARAMETERS.unit_type, ID
                }
            }
            return obj;
        });
        console.log({ rules });
        setOpen(false);
        setSortState("");
        toggleEachOn()
        setFloors(rules)
    }

    const Loading = () => {
        return <div className=" p-2 sorting-opt">
            <div className="mb-2">
                SORT BY
            </div>
            <Row noGutters className="justify-content-center" style={{ fontSize: 12 }}>
                <Col md={6}>
                    <div onClick={() => {
                        setSortState("ptoa")
                        toggleEachOn()
                    }} className={`sortby-opt ${(sortState == "ptoa") ? "sortby-opt-selected" : ""}`}>PORT <i className="fas fa-long-arrow-alt-right" /> AREA</div>
                </Col>
                <Col md={6}>
                    <div onClick={() => {
                        setSortState("atop")
                        toggleEachOn()
                    }} className={`sortby-opt ${(sortState == "atop") ? "sortby-opt-selected" : ""}`}>AREA <i className="fas fa-long-arrow-alt-right" /> PORT </div>
                </Col>
            </Row>

            <div className="w-100 bg-secondary mt-1 mb-3 " style={{ height: 1 }} />
            <div onClick={() => { setPtoggle(!ptoggle) }} className="mb-2">{(ptoggle) ? <ToggleOn /> : <ToggleOff />}  Port</div>
            <div onClick={() => { setCtoggle(!ctoggle) }} className="mb-2">{(ctoggle) ? <ToggleOn /> : <ToggleOff />} Country</div>
            <div onClick={() => { setGtoggle(!gtoggle) }} className="mb-2">{(gtoggle) ? <ToggleOn /> : <ToggleOff />} Pol Group</div>
            <div onClick={() => { setAreaToggle(!atoggle) }} className="mb-2">{(atoggle) ? <ToggleOn /> : <ToggleOff />} Area</div>
            <Row className="justify-content-end" noGutters>
                <Button onClick={() => {
                    setOpen(false)
                    toggleEachOn()
                    setSortState("");
                }} className="mr-1 sort-button bg-white text-black" text="CANCEL" width={80} />
                <Button onClick={sort} className="sort-button" disabled={(loadingAllow) ? false : sortState === ""} text="APPLY" width={80} />
            </Row>
        </div>
    }

    const Discharge = () => {
        return <div className=" p-2 sorting-opt">
            <div className="mb-2">
                SORT BY
            </div>
            <Row noGutters className="justify-content-center" style={{ fontSize: 12 }}>
                <Col md={6}>
                    <div onClick={() => {
                        setSortState("ptoa")
                        toggleEachOn()
                    }} className={`sortby-opt ${(sortState == "ptoa") ? "sortby-opt-selected" : ""}`}>PORT<i className="fas fa-long-arrow-alt-right" /> AREA</div>
                </Col>
                <Col md={6}>
                    <div onClick={() => {
                        setSortState("atop")
                        toggleEachOn()
                    }} className={`sortby-opt ${(sortState == "atop") ? "sortby-opt-selected" : ""}`}>AREA <i className="fas fa-long-arrow-alt-right" /> PORT</div>
                </Col>
            </Row>
            {/* <ToggleOn/>
            <ToggleOff/> */}
            <div className="w-100 bg-secondary mt-1 mb-3 " style={{ height: 1 }} />
            <div onClick={() => { setPtoggle(!ptoggle) }} className="mb-2">{(ptoggle) ? <ToggleOn /> : <ToggleOff />}  Port</div>
            <div onClick={() => { setCtoggle(!ctoggle) }} className="mb-2">{(ctoggle) ? <ToggleOn /> : <ToggleOff />} Country</div>
            <div onClick={() => { setGtoggle(!gtoggle) }} className="mb-2">{(gtoggle) ? <ToggleOn /> : <ToggleOff />} Pod Group</div>
            <div onClick={() => { setAreaToggle(!atoggle) }} className="mb-2">{(atoggle) ? <ToggleOn /> : <ToggleOff />} Area</div>

            <Row className="justify-content-end" noGutters>
                <Button className="mr-1 sort-button text-black bg-white" onClick={() => {
                    setOpen(false)
                    setSortState("");
                    toggleEachOff()
                }} text="CANCEL" width={80} />
                <Button onClick={sort} className="sort-button" disabled={(loadingAllow) ? false : sortState === ""} width={80} text="APPLY" />

            </Row>
        </div>
    }

    const Validity = () => {
        return <div className=" p-2 sorting-opt">
            <div className="mb-2">
                Sort By
            </div>
            <Row noGutters className="justify-content-center ">
                <div onClick={() => { setSortState("start") }} className={`sortby-opt ${(sortState == "start") ? "sortby-opt-selected" : ""}`}>Start Date</div>
                <div onClick={() => { setSortState("end") }} className={`sortby-opt ${(sortState == "end") ? "sortby-opt-selected" : ""}`}>End Date </div>
            </Row>
            <div className="w-100 bg-secondary mt-1 mb-3 " style={{ height: 1 }} />
            <Row className="justify-content-end" noGutters>
                <Button onClick={() => {
                    setOpen(false)
                    setSortState("");
                }} text="CANCEL" width={80} className="mr-1 sort-button bg-white text-black" />
                <Button onClick={sort} className="sort-button" disabled={sortState === ""} text="APPLY" width={80} />
            </Row>
        </div>
    }

    const renderMain = () => {
        switch (name) {
            case "LOADING":
                return <Loading />
            case "DISCHARGE":
                return <Discharge />
            case "VALIDITY DATE":
                return <Validity />
            default:
                return null;
        }
    }


    const renderSvg = () => {
        switch (name) {
            case "LOADING":
                return <div style={{ color: "#505050" }} className="font-weight-bold"><img src={LoadingSvg} /><span>{name}</span></div>
            case "DISCHARGE":
                return <div style={{ color: "#505050" }} className="font-weight-bold">{name}<img src={DischargeSvg} /><span></span></div>
            case "VALIDITY DATE":
                return <div style={{ color: "#505050" }} className="font-weight-bold"><img src={Checkbox} /><span>{name}</span></div>
            default:
                return null;
        }
    }

    return (
        <div className="position-relative row no-gutters justify-content-center w-100 text-center ml-1" style={{ backgroundColor: "#C3C8D5" }}>
            <svg style={{ left: 0 }} className="position-absolute " xmlns="http://www.w3.org/2000/svg" onClick={() => { setOpen(true) }} width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g id="sort_24px">
                    <path id="icon/content/sort_24px" fillRule="evenodd" clipRule="evenodd" d="M3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6
                20 6H4C3.45 6 3 6.45 3 7ZM4 18H8C8.55 18 9 17.55 9 17C9 16.45 8.55 16 8 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM14 13H4C3.45 13 3 12.55
                3 12C3 11.45 3.45 11 4 11H14C14.55 11 15 11.45 15 12C15 12.55 14.55 13 14 13Z" fill="#133C8B" />
                </g>
            </svg>
            {renderSvg()}
            {/* <i onClick={() => { setOpen(true) }} className="fas fa-sort-amount-down ml-1" /> */}
            <div className="position-absolute option-menu shadow" style={{ left: 0 }}>
                {open && renderMain()}
            </div>
        </div>
    )
}

Sorttab.propTypes = {
    name: PropTypes.string, setFloors: PropTypes.func, user: PropTypes.object, currentBu: PropTypes.string, nav: PropTypes.string, filter: PropTypes.array,
    setOrderBy: PropTypes.func, setHide: PropTypes.func
}

export default Sorttab;