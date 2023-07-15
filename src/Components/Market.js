import React, { useEffect, useState } from 'react'
import { compareDate, reverseDate } from '../Utils'
import Header from './Header'
import Markinput from './Markinput'
import Marktop from './Marktop'
import Markval from './Markval'
import MasterEdit from './MasterEdit'
import Loader from "../Components/Loader"

import Sloading from "../Utils/Svgs/sloading.svg"
import Sdischarge from "../Utils/Svgs/sdischarge.svg"
import axios from 'axios'
import { Modal, Row } from 'react-bootstrap'
import Button from "./Button"
import Buttons from "react-bootstrap/Button"
import PropTypes from "prop-types"

const Market = ({ rules, permission, setInfo, setChangeCount, ruleLoading, currentBu, user, setRules, nav, setPublishCount, getRules }) => {

    const denomination_array = ["$", "%", "£", "€"];

    let [singleduplicate, setSingleDuplicate] = useState(false);
    let [edit, toggleEdit] = useState(0);
    let [all, selectAll] = useState(false);
    let [floors, setFloors] = useState(rules);
    let [temp_floors, setTempFloors] = useState(rules);
    let [alarm, setAlarm] = useState(false);
    let [selected_index, selectIndexes] = useState([]);
    let [loadingArea, setLoadingArea] = useState(null);
    let [dischargeArea, setDischargeArea] = useState(null);
    let [loadingPort, setLoadingPort] = useState(null);
    let [dischargePort, setDischargePort] = useState(null);
    let [loadingCountry, setLoadingCountry] = useState(null);
    let [dischargeCountry, setDischargeCountry] = useState(null);
    let [pol, setPol] = useState(null);
    let [pod, setPod] = useState(null);
    let [cargo, setCargo] = useState(null);
    let [charge, setCharge] = useState(null);
    let [start, setStart] = useState(null);
    let [end, setEnd] = useState(null);
    let [trade, setTrade] = useState(null);
    let [denomination, setDenomination] = useState(null);
    let [duplicate, setDuplicate] = useState(false);
    let [modal, showModal] = useState(false);
    let [end_date, setEndDate] = useState("");
    let [split, setSplitModal] = useState(null);
    let [start_date, setStartDate] = useState("");
    let [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        setFloors(floors)
        setTempFloors(floors);
    }, [floors, rules])




    const renderInput = () => {
        let array = [];
        for (var i = 0; i < edit; i++) {
            array.push(<Markinput setInfo={setInfo} user={user} currentBu={currentBu} selectIndexes={selectIndexes} setPublishCount={setPublishCount} selected_index={selected_index} floors={floors} setFloors={setFloors} alarm={alarm} setAlarm={setAlarm} key={`market_input_${i}`} />)
        }
        return array;
    }
    function shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (key != "status") {
                if (object1[key] !== object2[key]) {
                    return false;
                }
            }
        }

        return true;
    }

    useEffect(() => {
        if (selected_index.length > 0) {
            if (trade !== null || loadingArea !== null || loadingPort !== null || loadingCountry !== null || pol !== null ||
                dischargeArea !== null || dischargePort !== null || dischargeCountry !== null || pod !== null || start !== null || end !== null ||
                cargo !== null || charge !== null) {
                cancelAllSelected(false)
            }
        }
    }, [selected_index.length])
    const cancelAllSelected = (val = true) => {
        selectAll(false)
        setLoadingArea(null);
        setDischargeArea(null);
        setLoadingPort(null);
        setDischargePort(null);
        setLoadingCountry(null);
        setDischargeCountry(null);
        setPol(null);
        setPod(null);
        setCargo(null);
        setCharge(null);
        setStart(null);
        setEnd(null);
        setTrade(null);
        setDenomination(null);
        selectAll(false)
        if (val) {
            selectIndexes([]);
            getRules();
        }
    }

    //Function for saving all duplicate rules

    const saveDuplicates = async () => {
        let array = floors.map(val => val);

        let result_array = []
        for (let x = 0; x < selected_index.length; x++) {
            let { start, end, trade, charge, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination } = floors[selected_index[x]];
            let result = {
                RULE_TYPE: "market_condition_price",
                TRADE: trade,
                BU: currentBu,
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
                USER: user.ID,
                param1: denomination,
                param2: charge,
            }
            result_array.push(result);
        }
        let data_object = {
            accessToken: user.accessToken,
            itemList: result_array
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addMultiroule`, data_object);
            const IDs = res.data.IDs;
            if (res.status == 200) {
                setInfo("duplicated");
                setChangeCount(selected_index.length)
                for (let x = 0; x < selected_index.length; x++) {
                    let new_obj = Object.assign({}, array[selected_index[x]])
                    new_obj.ID = IDs[x]
                    array[selected_index[x]] = new_obj;
                }
                selectIndexes([]);
                setAlarm(!alarm);
                setFloors(array);
                setDuplicate(false);
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
            }
            else {
                for (let x = 0; x < selected_index.length; x++) {
                    floors.splice(selected_index[x], 1);
                }
                window.alert("Not allowed")
            }
        }
        catch (e) {
            console.log(e);
            for (let x = 0; x < selected_index.length; x++) {
                floors.splice(selected_index[x], 1);
            }
            if (e.response.data) {
                window.alert(e.response.data.message)
            }
        }
    }

    //Function for editing all selected rules

    const editAllSelected = async () => {
        let array = floors.map(val => val);
        let result_array = []
        for (let x = 0; x < selected_index.length; x++) {
            let new_obj = Object.assign({}, array[selected_index[x]])
            console.log({ previous: new_obj });
            new_obj.loadingArea = (loadingArea != null) ? loadingArea : new_obj.loadingArea;
            new_obj.dischargeArea = (dischargeArea != null) ? dischargeArea : new_obj.dischargeArea;
            new_obj.dischargeCountry = (dischargeCountry != null) ? dischargeCountry : new_obj.dischargeCountry;
            new_obj.loadingCountry = (loadingCountry != null) ? loadingCountry : new_obj.loadingCountry;
            new_obj.loadingPort = (loadingPort != null) ? loadingPort : new_obj.loadingPort;
            new_obj.dischargePort = (dischargePort != null) ? dischargePort : new_obj.dischargePort;
            new_obj.pod = (pod != null) ? pod : new_obj.pod;
            new_obj.pol = (pol != null) ? pol : new_obj.pol;
            new_obj.cargo = (cargo != null) ? cargo : new_obj.cargo;
            new_obj.charge = (charge != null) ? charge : new_obj.charge;
            new_obj.start = (start != null) ? reverseDate(start, "output") : reverseDate(new_obj.start, "output");
            new_obj.end = (end != null) ? reverseDate(end, "output") : reverseDate(new_obj.end, "output");
            new_obj.trade = (trade != null) ? trade : new_obj.trade;
            new_obj.denomination = (denomination != null) ? denomination_array[denomination] : new_obj.denomination
            console.log({ next: new_obj });
            new_obj.status = (new_obj.status == undefined) ? "edit" : new_obj.status;
            let find_index = false;
            for (let j in floors) {
                if (shallowEqual(floors[j], new_obj)) {
                    find_index = true;
                    break;
                }
            }
            if (new_obj.start !== "" && new_obj.end !== "") {
                if (compareDate(new_obj.start, new_obj.end)) {
                    new_obj.conflict = true;
                }
            }
            if (find_index) {
                new_obj.conflict = true;
            }


            else {
                new_obj.conflict = false;
            }
            let result = {
                ID: new_obj.ID,
                RULE_TYPE: "market_condition_price",
                TRADE: new_obj.trade,
                BU: currentBu,
                POL_AREA: (new_obj.loadingArea !== "") ? new_obj.loadingArea : null,
                POL_COUNTRY: (new_obj.loadingCountry !== "") ? new_obj.loadingCountry : null,
                POL_GROUP_CODE: (new_obj.pol !== "") ? new_obj.pol : null,
                POL_CODE: (new_obj.loadingPort !== "") ? new_obj.loadingPort : null,
                POD_AREA: (new_obj.dischargeArea !== "") ? new_obj.dischargeArea : null,
                POD_COUNTRY: (new_obj.dischargeCountry !== "") ? new_obj.dischargeCountry : null,
                POD_GROUP_CODE: (new_obj.pod !== "") ? new_obj.pod : null,
                POD_CODE: (new_obj.dischargePort != "") ? new_obj.dischargePort : null,
                CONTAINER_TYPE: new_obj.cargo,
                START: reverseDate(new_obj.start, "input"),
                END: reverseDate(new_obj.end, "input"),
                USER: user.ID,
                param1: new_obj.denomination,
                param2: new_obj.charge
            }
            result_array.push(result);
            array[selected_index[x]] = new_obj;
        }
        let data_object = {
            accessToken: user.accessToken,
            itemList: result_array
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/ruleMultiedit`, data_object);
            let IDs = res.data.IDs;
            console.log(IDs);
            if (res.status == 200) {
                for (let x = 0; x < selected_index.length; x++) {
                    let new_obj = Object.assign({}, array[selected_index[x]])
                    new_obj.ID = IDs[x].id
                    array[selected_index[x]] = new_obj;
                }
                selectIndexes([]);
                setAlarm(!alarm);
                setFloors(array);
                setTempFloors(array);
                setInfo("change");
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
            }
            else {
                window.alert("Not allowed")
            }
        }
        catch (e) {
            console.log(e);
            if (e.response.data) {
                window.alert(e.response.data.message)
            }
        }
    }

    //Function for deleting all the selected rules

    const deleteAllSelected = async () => {
        let array = floors.map(val => val);
        let result_array = []
        for (let x = 0; x < selected_index.length; x++) {
            let { start, end, trade, charge, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination, ID } = floors[selected_index[x]];
            let result = {
                ID: ID,
                RULE_TYPE: "market_condition_price",
                TRADE: trade,
                BU: currentBu,
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
                USER: user.ID,
                param1: denomination,
                param2: charge,
            }
            result_array.push(result);
            let new_obj = Object.assign({}, array[selected_index[x]])
            new_obj.status = "DELETED";
            new_obj.del = true;
            array[selected_index[x]] = new_obj;
        }
        let data_object = {
            accessToken: user.accessToken,
            itemList: result_array
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/multiremoveRule`, data_object);
            if (res.data) {
                setInfo("change");
                selectIndexes([]);
                setAlarm(!alarm);
                setFloors(array);
                setDeleteModal(false)
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
            }
            else {
                window.alert("Not allowed")
            }
        }
        catch (e) {
            console.log(e);
            if (e.response.data) {
                window.alert(e.response.data.message)
            }
        }


    }

    //Function for duplicating all the selected rules 

    const duplicateAllSelected = async () => {
        let array = []
        let result_array = []
        for (let x = 0; x < selected_index.length; x++) {
            let { all, start, end, trade, charge, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination } = floors[selected_index[x]];
            let object = { duplicate: true, all, start, end, trade, charge, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, conflict: true, loadingCountry, dischargeCountry, pod, pol, denomination, status: "DUPLICATE", floors, setFloors };
            let result = {
                RULE_TYPE: "market_condition_price",
                TRADE: trade,
                BU: currentBu,
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
                USER: user.ID,
                param1: denomination,
                param2: charge,
            }
            array.push(object);
            result_array.push(result);
        }
        let selected_array = selected_index.map((val, i) => i);
        selectIndexes(selected_array);
        setFloors([...array, ...floors]);
        setDuplicate(true);
    }


    const splitAllSelected = async () => {
        let array = floors.map(val => val);
        let result_array = []
        for (let x = 0; x < selected_index.length; x++) {
            let { start, end, trade, charge, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination, ID } = floors[selected_index[x]];
            let result = {
                ID: ID,
                RULE_TYPE: "market_condition_price",
                TRADE: trade,
                BU: currentBu,
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
                USER: user.ID,
                param1: denomination,
                param2: charge,
                splitedTO: start_date,
                splitedFROM: end_date
            }
            result_array.push(result);
        }
        let data_object = {
            accessToken: user.accessToken,
            itemList: result_array
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roulMultiSplit`, data_object);
            let IDs = res.data.IDs;
            let sum = 0;
            if (res.status == 200) {
                for (let x = 0; x < selected_index.length; x++) {
                    let { start, end } = floors[selected_index[x]];
                    var first = Object.assign({}, floors[selected_index[x]]);
                    first.end = reverseDate(start_date, "output");
                    first.status = "SPLIT"
                    first.ID = IDs[sum].id;
                    sum++;
                    var second = Object.assign({}, floors[selected_index[x]]);
                    second.start = reverseDate(end_date, "output");
                    second.status = "SPLIT"
                    second.ID = IDs[sum].id;
                    sum++;
                    array.splice(selected_index[x] + (2 * x), 1);
                    if (!compareDate(`${start_date}`, reverseDate(start, "input"))) {
                        first.conflict = true;
                    }
                    if (!compareDate(reverseDate(end, "input"), end_date)) {
                        second.conflict = true;
                    }
                    array.unshift(second)
                    array.unshift(first);
                    console.log(array);
                }
                selectIndexes([]);
                setAlarm(!alarm);
                setFloors(array);
                setTempFloors(array);
                setInfo("change")
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
            }
            else {
                window.alert("Not allowed")
            }
        }
        catch (e) {
            console.log(e);
            if (e.response.data) {
                window.alert(e.response.data.message)
            }
        }
        showModal(false);


    }





    const renderRules = () => {
        let array = [];
        if (floors.length > 0) {
            {
                array = floors.map((val, i) => {
                    // let { ID, start, end, trade, charge, cargo, conflict, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination, status, del } = val;
                    let el = selected_index.findIndex(val => val == i)
                    let check = el >= 0;
                    let find_index = temp_floors.findIndex(value => {
                        let obj = Object.assign({}, value);
                        let second_obj = Object.assign({}, val);
                        obj.status = undefined;
                        second_obj.status = undefined;
                        return JSON.stringify(second_obj) == JSON.stringify(obj)
                    });
                    if (find_index >= 0) {
                        return <Markval
                            ID={val.ID}
                            user={user}
                            currentBu={currentBu}
                            permission={permission}
                            selected_index={selected_index}
                            selectIndexes={selectIndexes}
                            conflict={val.conflict}
                            check={check}
                            floors={floors}
                            setFloors={setFloors}
                            start={val.start}
                            setAlarm={setAlarm}
                            alarm={alarm}
                            index={i}
                            end={val.end}
                            del={(val.del != undefined) ? val.del : false}
                            trade={val.trade}
                            charge={val.charge}
                            cargo={val.cargo}
                            loadingArea={val.loadingArea}
                            dischargeArea={val.dischargeArea}
                            loadingCountry={val.loadingCountry}
                            dischargeCountry={val.dischargeCountry}
                            loadingPort={val.loadingPort}
                            dischargePort={val.dischargePort}
                            pod={val.pod}
                            pol={val.pol}
                            denomination={val.denomination}
                            all={all}
                            status={val.status}
                            key={`markval_${i}`}
                            floadingArea={loadingArea}
                            fdischargeArea={dischargeArea}
                            floadingCountry={loadingCountry}
                            fdischargeCountry={dischargeCountry}
                            floadingPort={loadingPort}
                            fdischargePort={dischargePort}
                            fpod={pod}
                            fpol={pol}
                            ftrade={trade}
                            fcharge={charge}
                            fstart={start}
                            fend={end}
                            fcargo={cargo}
                            fdenomination={denomination}
                            singleduplicate={singleduplicate}
                            duplicate={(val.duplicate ? val.duplicate : false)}
                            setDuplicate={setSingleDuplicate}
                            setLoadingArea={setLoadingArea}
                            setDischargeArea={setDischargeArea}
                            setLoadingPort={setLoadingPort}
                            setDischargePort={setDischargePort}
                            setLoadingCountry={setLoadingCountry}
                            setDischargeCountry={setDischargeCountry}
                            setPod={setPod}
                            setPol={setPol}
                            setTrade={setTrade}
                            setCharge={setCharge}
                            setCargo={setCargo}
                            setDenomination={setDenomination}
                            setStart={setStart}
                            setEnd={setEnd}
                            split={split}
                            setInfo={setInfo}
                            setSplitModal={setSplitModal}
                            setPublishCount={setPublishCount}
                            getRules={getRules}
                        />
                    }
                });
            }
        }
        return array;
    }

    return <>
        <Header toggleEdit={toggleEdit} edit={edit} name="Market Condition" setFloors={setFloors} floors={floors} currentBu={currentBu} user={user} nav={nav} permission={permission} />
        <Marktop all={all} selectAll={selectAll} selectIndexes={selectIndexes} setFloors={setFloors} floors={floors}
            temp_floors={temp_floors} setAlarm={setAlarm} alarm={alarm} setTempFloors={setTempFloors} setRules={setRules}
            currentBu={currentBu} user={user} nav={nav} />
        <div className="overflow-auto w-100 " style={{ height: (selected_index.length > 1) ? "calc(100vh - 370px)" : "calc(100vh - 270px)" }}>

            {
                (ruleLoading) ? <div className="h-100 w-100"><Loader /></div> : <>{renderInput()}{renderRules()}</>
            }
        </div>
        {
            (selected_index.length > 1) && <MasterEdit
                duplicateAllSelected={duplicateAllSelected}
                deleteAllSelected={setDeleteModal}
                editAllSelected={(duplicate) ? saveDuplicates : editAllSelected}
                cancelAllSelected={cancelAllSelected}
                showModal={showModal} />
        }
        <Modal
            size="md"
            show={modal}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Body className="p-4 w-100 row no-gutters flex-column align-items-center" >
                <div className="split-date-option modal-split-date">
                    <div style={{ color: "#505050", fontWeight: "bold" }}>SPLIT VALIDITY DATE</div>
                    <div className="w-100 bg-secondary mt-1 mb-3 " style={{ height: 1 }}></div>
                    <Row noGutters className="align-items-center justify-content-between mb-4">
                        <span><img src={Sloading}></img>Loading</span>
                        <span className="text-secondary">start</span>
                        <input val={start_date} type="date" onChange={(e) => {
                            setStartDate(e.target.value);
                            let date = new Date(e.target.value);
                            date.setDate(date.getDate() + 1);
                            let input_format = `${date.getFullYear()}-${(date.getMonth() + 1 < 10) ?
                                `0${date.getMonth() + 1}` : date.getMonth() + 1}-${(date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()}`;
                            setEndDate(input_format);

                        }} />
                    </Row>
                    <Row noGutters className="align-items-center justify-content-between mb-4">
                        <span><img src={Sdischarge} />Discharge</span>
                        <input
                            readOnly
                            value={end_date}
                            type="date" />
                        <span className="text-secondary">end</span>
                    </Row>
                    <Row noGutters className="justify-content-end">
                        <Button height={32} onClick={() => { showModal(false) }} size="sm" className="mr-3 bg-white text-secondary" text={"CANCEL"} />
                        <Button height={32} disabled={(start_date === "")} onClick={splitAllSelected} text={"SPLIT"} />
                    </Row>
                </div>
            </Modal.Body>

        </Modal>
        <Modal
            size="md"
            show={deleteModal}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Body className="p-4">
                <h4 className="text-center mb-3">Are You Sure You want to delete this item?</h4>
                <Row noGutters className="justify-content-center">
                    <Buttons onClick={() => { setDeleteModal(false) }} className="mr-1" variant="secondary">Close</Buttons>
                    <Buttons onClick={deleteAllSelected} variant="danger">Delete</Buttons>
                </Row>
            </Modal.Body>

        </Modal>
    </>
}

Market.propTypes = {
    rules: PropTypes.array,
    permission: PropTypes.string,
    ruleLoading: PropTypes.bool,
    currentBu: PropTypes.string,
    user: PropTypes.object,
    setRules: PropTypes.func,
    nav: PropTypes.string,
    setPublishCount: PropTypes.func,
    setInfo: PropTypes.func,
    setChangeCount: PropTypes.func,
    getRules: PropTypes.func
}

export default Market;