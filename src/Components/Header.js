import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap';
import { reverseDate } from '../Utils';
import { ExportCSV } from './ExportCsv';
import { ImportCsv } from './ImportCsv';
import Button from "./Button"
import PropTypes from "prop-types"
import { Search } from '../Utils/Svgs';

const Header = ({ name, toggleEdit, edit, user, currentBu, nav, setFloors, floors, permission }) => {
    let [rules, setRules] = useState([])
    let [perm, setEditPerm] = useState(false)
    useEffect(() => {
        let rule_book = floors.map(val => {
            let { ID, start, end, trade, cieling, floor, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, charge, comGroup, pod, pol, denomination } = val;
            let result = {
                ID,
                RULE_TYPE: nav,
                TRADE: trade,
                BU: currentBu,
                POL_AREA: loadingArea,
                POL_COUNTRY: loadingCountry,
                POL_GROUP_CODE: pol,
                POL_CODE: loadingPort,
                POD_AREA: dischargeArea,
                POD_COUNTRY: dischargeCountry,
                POD_GROUP_CODE: pod,
                POD_CODE: dischargePort,
                CONTAINER_TYPE: cargo,
                START: start,
                END: end,
                param1: denomination
            }

            if (nav === "price_floor_and_ceiling") {
                result.param2 = floor;
                result.param3 = cieling;
            }
            else if (nav === "market_condition_price") {
                result.param2 = charge;
            }
            else if (nav === "comm") {
                result.param2 = charge;
                result.param3 = comGroup;
            }
            return result;
        })
        console.log(rule_book)
        setRules(rule_book);
    }, [floors])

    useEffect(() => {
        let perm = (permission === "Update")
        setEditPerm(perm);
    }, [permission])


    let [search, setSearch] = useState("")
    const startSearch = async (e) => {
        let value = e.target.value;
        setSearch(value);
        let final_params = {
            BU: currentBu,
            accessToken: user.accessToken,
            userID: user.ID,
            Type: nav,
        }
        if (value != "") {
            final_params.ID = value;

        }
        console.log(final_params)
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
        setFloors(rules)

    }


    return <Row noGutters className="justify-content-between w-100 pb-4 pt-4 h-max-content align-items-center">
        <Row noGutters className="align-items-center">
            <div className="mr-2 header-text">{name}</div>
            {/* {perm && <Button onClick={() => { toggleEdit(edit + 1) }} variant="dark">+ Add Rule</Button>} */}
            {perm && <Button onClick={() => { toggleEdit(edit + 1) }} text={"+ Add Rule"} height={32} />}

        </Row>
        <Row noGutters className="align-items-center header-icon-container">
            <div className="row no-gutters main-search-container mr-5 justify-content-between align-items-center p-1 pl-3 pr-3">

                <input placeholder="Search By ID" value={search} onChange={startSearch} type="text" className="main-search " />
                <span className=""><Search /></span>
            </div>
            <ExportCSV csvData={rules} fileName="bu_rules" />
            {perm && <ImportCsv setFloors={setFloors} nav={nav} currentBu={currentBu} user={user} floors={floors} />}
        </Row>
    </Row>
}

Header.propTypes = {
    name: PropTypes.string,
    toggleEdit: PropTypes.func,
    edit: PropTypes.number,
    user: PropTypes.object,
    currentBu: PropTypes.string,
    nav: PropTypes.string,
    setFloors: PropTypes.func,
    floors: PropTypes.array,
    permission: PropTypes.string
}

export default Header;