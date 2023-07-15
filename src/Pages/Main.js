//The main component
import PropTypes from 'prop-types';
import axios from 'axios' //npm library for calling apis
import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import Commodity from '../Components/Commodity'
import Floor from '../Components/Floor'
import Market from '../Components/Market'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import { reverseDate } from '../Utils'
import Info from '../Components/Info';


//here bus is the value of all the BUs and user contains the user info
const Main = ({ bus, user }) => {

    let [nav, setNav] = useState("price_floor_and_ceiling");//setting initial rule to be price_floor_and_ceiling
    let [rules, setRules] = useState([]);
    let [currentBu, setCurrentBu] = useState("");
    let [permission, setCurrentPermission] = useState("Read");//setting initial role to viewer
    let [ruleLoading, setRuleLoading] = useState(false);
    let [publishCount, setPublishCount] = useState("");
    let [info, setInfo] = useState(null)
    let [changeCount, setChangeCount] = useState(1);
    //Function to fetch rules based on BUs , rules and users

    useEffect(() => {
        window.setTimeout(() => {
            setInfo(null)
        }, 1000)
    }, [info])

    const getRules = async () => {
        setRuleLoading(true);
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/rulesFilter`, {
            accessToken: user.accessToken,
            BU: currentBu,
            Type: nav,
            userID: user.ID
        });
        let rules = res.data.Rules.map(val => {
            let { TRADE, RULE_TYPE, POL_AREA, POL_COUNTRY, POL_GROUP_CODE, POL_CODE, POD_AREA, POD_COUNTRY, POD_GROUP_CODE, POD_CODE, CONTAINER_TYPE, START, END, STATUS, CONFLICT, ID } = val;
            let PARAMETERS = JSON.parse(val.PARAMETERS)
            let obj = {};
            if (nav === "price_floor_and_ceiling") {
                obj = {
                    trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pod: POD_GROUP_CODE, loadingPort: POL_CODE,
                    dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pol: POL_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
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
        })
        setRules(rules);
        if (res.data.publishCount != undefined) {
            setPublishCount(res.data.publishCount);
        }
        setRuleLoading(false);
    }



    useEffect(() => {
        //rule is fetched once auth state is confirmed
        if (user != null)
            getRules();
    }, [user, nav, currentBu])


    //Component rendering rulepages according to the value selected in navbar
    const Page = () => {
        switch (nav) {
            case "price_floor_and_ceiling":
                return <Floor setInfo={setInfo} setChangeCount={setChangeCount} getRules={getRules} rules={rules} publishCount={publishCount} setPublishCount={setPublishCount} user={user} permission={permission} ruleLoading={ruleLoading} currentBu={currentBu} setRules={setRules} nav={nav} />;
            case "comm":
                return <Commodity setInfo={setInfo} setChangeCount={setChangeCount} getRules={getRules} rules={rules} publishCount={publishCount} setPublishCount={setPublishCount} user={user} permission={permission} ruleLoading={ruleLoading} currentBu={currentBu} setRules={setRules} nav={nav} />
            case "market_condition_price":
                return <Market setInfo={setInfo} setChangeCount={setChangeCount} getRules={getRules} rules={rules} publishCount={publishCount} setPublishCount={setPublishCount} user={user} permission={permission} ruleLoading={ruleLoading} currentBu={currentBu} setRules={setRules} nav={nav} />
            default:
                return <Floor setInfo={setInfo} setChangeCount={setChangeCount} rules={rules} getRules={getRules} publishCount={publishCount} setPublishCount={setPublishCount} user={user} permission={permission} ruleLoading={ruleLoading} currentBu={currentBu} setRules={setRules} nav={nav} />
        }
    }


    return <Row noGutters className="w-100 vh-100 overflow-hidden">
        {

            <>
                <div style={{ width: 70 }} >
                    <Sidebar bus={bus} user={user} currentBu={currentBu} setCurrentPermission={setCurrentPermission} setCurrentBu={setCurrentBu} />
                </div>
                <div style={{ width: "calc( 100% - 70px )" }}>
                    <Navbar permission={permission} setNav={setNav} nav={nav} currentBu={currentBu} user={user} getRules={getRules} publishCount={publishCount} />
                    <Container fluid>
                        <Page />
                    </Container>
                    {
                        (info !== null) && <Info type={info} count={changeCount} />
                    }
                </div>:
                </>
        }
    </Row>
}

Main.propTypes = {
    bus: PropTypes.array,
    user: PropTypes.object
}

export default Main;