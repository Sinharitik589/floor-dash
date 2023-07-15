import React, { useEffect, useState } from 'react'
import Header from './Header'
import Top from './Top'
import Input from './Input'
import Comval from "./Comval"
import MasterEdit from './MasterEdit'
import Loader from "../Components/Loader"
import { compareDate, reverseDate } from '../Utils'
import Sloading from "../Utils/Svgs/sloading.svg"
import Sdischarge from "../Utils/Svgs/sdischarge.svg"
import axios from 'axios'
import { Modal, Row } from 'react-bootstrap'
import Buttons from "react-bootstrap/Button"
import Button from "./Button"
import PropTypes from "prop-types"

const Floor = ({ rules, permission, ruleLoading, currentBu, user, setRules, nav, setPublishCount, publishCount, setInfo, setChangeCount, getRules }) => {

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
    let [floor, setFloor] = useState(null);
    let [cieling, setCieling] = useState(null);
    let [start, setStart] = useState(null);
    let [end, setEnd] = useState(null);
    let [trade, setTrade] = useState(null);
    let [denomination, setDenomination] = useState(null);
    let [duplicate, setDuplicate] = useState(false);
    let [modal, showModal] = useState(false);
    let [end_date, setEndDate] = useState("");
    let [start_date, setStartDate] = useState("");
    let [split, setSplitModal] = useState(null);
    let [deleteModal, setDeleteModal] = useState(false);
    const renderInput = () => {
        let array = [];
        for (var i = 0; i < edit; i++) {
            array.push(<Input floors={floors} user={user} currentBu={currentBu} setFloors={setFloors} key={`input_${i}`}
                publishCount={publishCount}
                setPublishCount={setPublishCount} selected_index={selected_index} setInfo={setInfo} />)
        }

        return array;
    }
    useEffect(() => {
        setFloors(floors)
        setTempFloors(floors);
    }, [floors, rules])



    useEffect(() => {
        console.log("changing lngth")
        if (selected_index.length > 0) {
            if (trade !== null || loadingArea !== null || loadingPort !== null || loadingCountry !== null || pol !== null ||
                dischargeArea !== null || dischargePort !== null || dischargeCountry !== null || pod !== null || start !== null || end !== null ||
                cargo !== null || floor !== null || cieling !== null) {
                console.log("changinglnj")
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
        setFloor(null);
        setCieling(null);
        setStart(null);
        setEnd(null);
        setTrade(null);
        setDenomination(null);
        selectAll(false)
        setDuplicate(false);
        if (val) {

            selectIndexes([]);
            getRules()
        }

    }

    //Function that compares all the keys of an object and output whether it is equal or not
    function shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (key !== "status" && key !== "ID") {
                console.log(object1[key], object2[key])
                if (object1[key] !== object2[key]) {
                    return false;
                }
            }
        }

        return true;
    }

    //Function for saving all duplicate rules

    const saveDuplicates = async () => {
        let array = floors.map(val => val);

        let result_array = []
        console.log(floors);
        for (let x = 0; x < selected_index.length; x++) {
            let { start, end, trade, cieling, floor, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination } = floors[selected_index[x]];

            let result = {
                RULE_TYPE: "price_floor_and_ceiling",
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
                param2: floor,
                param3: cieling,
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
                    let find_index = false;
                    for (let j in floors) {
                        if (shallowEqual(floors[j], new_obj)) {
                            find_index = true;
                            break;
                        }
                    }
                    if (find_index) {
                        new_obj.conflict = true;
                    }


                    else {
                        new_obj.conflict = false;
                    }
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
            new_obj.loadingArea = (loadingArea != null) ? loadingArea : new_obj.loadingArea;
            new_obj.dischargeArea = (dischargeArea != null) ? dischargeArea : new_obj.dischargeArea;
            new_obj.dischargeCountry = (dischargeCountry != null) ? dischargeCountry : new_obj.dischargeCountry;
            new_obj.loadingCountry = (loadingCountry != null) ? loadingCountry : new_obj.loadingCountry;
            new_obj.loadingPort = (loadingPort != null) ? loadingPort : new_obj.loadingPort;
            new_obj.dischargePort = (dischargePort != null) ? dischargePort : new_obj.dischargePort;
            new_obj.pod = (pod != null) ? pod : new_obj.pod;
            new_obj.pol = (pol != null) ? pol : new_obj.pol;
            new_obj.cargo = (cargo != null) ? cargo : new_obj.cargo;
            new_obj.floor = (floor != null) ? floor : new_obj.floor;
            new_obj.cieling = (cieling != null) ? cieling : new_obj.cieling;
            new_obj.start = (start != null) ? reverseDate(start, "output") : reverseDate(new_obj.start, "output");
            new_obj.end = (end != null) ? reverseDate(end, "output") : reverseDate(new_obj.end, "output");
            new_obj.trade = (trade != null) ? trade : new_obj.trade;
            new_obj.denomination = (denomination != null) ? denomination_array[denomination] : new_obj.denomination
            new_obj.status = (new_obj.status == undefined) ? "edit" : new_obj.status;
            let find_index = false;
            for (let j in floors) {
                if (shallowEqual(floors[j], new_obj)) {
                    find_index = true;
                    break;
                }
            }
            if (new_obj.start !== "" && new_obj.end !== "") {
                if (compareDate(new_obj.start, new_obj.end) || new_obj.floor > new_obj.cieling) {
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
                RULE_TYPE: "price_floor_and_ceiling",
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
                param2: new_obj.floor,
                param3: new_obj.cieling,
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
            if (res.status == 200) {

                for (let x = 0; x < selected_index.length; x++) {
                    let new_obj = Object.assign({}, array[selected_index[x]])
                    new_obj.ID = IDs[x].id
                    array[selected_index[x]] = new_obj;
                }
                setInfo("change")
                selectIndexes([]);
                setAlarm(!alarm);
                setFloors(array);
                setTempFloors(array);
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
            let { start, end, trade, cieling, floor, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination, ID } = floors[selected_index[x]];
            let result = {
                ID: ID,
                RULE_TYPE: "price_floor_and_ceiling",
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
                param2: floor,
                param3: cieling,
            }
            result_array.push(result);
            let new_obj = Object.assign({}, array[selected_index[x]])
            new_obj.status = "DELETED";//marking status as deletd
            new_obj.del = true;
            array[selected_index[x]] = new_obj;
        }
        let data_object = {
            accessToken: user.accessToken,
            itemList: result_array
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/multiremoveRule`, data_object);
            //res.data is either true or false
            if (res.data) {
                selectIndexes([]);
                setAlarm(!alarm);
                setFloors(array);
                setDeleteModal(false)
                if (res.data.publishCount !== undefined) {
                    setPublishCount(res.data.publishCount)
                }
                setInfo("change")
            }
            else {
                window.alert(res.data.message)
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
            let { all, start, end, trade, cieling, floor, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination } = floors[selected_index[x]];
            let object = { duplicate: true, all, start, end, trade, cieling, floor, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, conflict: true, loadingCountry, dischargeCountry, pod, pol, denomination, status: "DUPLICATE", floors, setFloors };
            let result = {
                RULE_TYPE: "price_floor_and_ceiling",
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
                param2: floor,
                param3: cieling,
            }
            array.push(object);
            result_array.push(result);
        }
        let selected_array = selected_index.map((val, i) => i);
        selectIndexes(selected_array);
        setFloors([...array, ...floors]);
        setDuplicate(true);
    }


    //Function for splitting all the selected rules

    const splitAllSelected = async () => {
        let array = floors.map(val => val);
        let result_array = []
        for (let x = 0; x < selected_index.length; x++) {
            let { start, end, trade, cieling, floor, cargo, loadingArea, dischargeArea, loadingPort, dischargePort, loadingCountry, dischargeCountry, pod, pol, denomination, ID } = floors[selected_index[x]];
            let result = {
                ID: ID,
                RULE_TYPE: "price_floor_and_ceiling",
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
                param2: floor,
                param3: cieling,
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
            let IDs = res.data.IDs;//the newly assigned ids array for the new rules
            let sum = 0;
            if (res.status == 200) {
                setInfo("change");
                for (let x = 0; x < selected_index.length; x++) {
                    let { start, end } = floors[selected_index[x]];
                    var first = Object.assign({}, floors[selected_index[x]]);//first rule created by the split
                    first.end = reverseDate(start_date, "output");
                    first.status = "SPLIT"
                    first.ID = IDs[sum].id;
                    sum++;
                    var second = Object.assign({}, floors[selected_index[x]]);//second rule created after split
                    second.start = reverseDate(end_date, "output");
                    second.status = "SPLIT"
                    second.ID = IDs[sum].id;
                    sum++;
                    array.splice(selected_index[x] + (2 * x), 1);//removing the previous rule
                    //checking date validation for newly created rules
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
        showModal(false);


    }



    const renderRules = () => {
        let array = [];
        if (floors.length > 0) {
            {
                array = floors.map((val, i) => {
                    let el = selected_index.findIndex(val => val == i)
                    let check = el >= 0;
                    return (<Comval
                        ID={val.ID}
                        user={user}
                        currentBu={currentBu}
                        selected_index={selected_index}
                        permission={permission}
                        selectIndexes={selectIndexes}
                        conflict={val.conflict}
                        check={check}
                        singleduplicate={singleduplicate}
                        duplicate={(val.duplicate) ? val.duplicate : false}
                        setDuplicate={setSingleDuplicate}
                        floors={floors}
                        setFloors={setFloors}
                        start={val.start}
                        setAlarm={setAlarm}
                        alarm={alarm}
                        index={i}
                        end={val.end}
                        trade={val.trade}
                        cieling={val.cieling}
                        floor={val.floor}
                        del={(val.del != undefined) ? val.del : false}
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
                        key={`comval_${i}`}
                        floadingArea={loadingArea}
                        fdischargeArea={dischargeArea}
                        floadingCountry={loadingCountry}
                        fdischargeCountry={dischargeCountry}
                        floadingPort={loadingPort}
                        fdischargePort={dischargePort}
                        fpod={pod}
                        fpol={pol}
                        ftrade={trade}
                        fcieling={cieling}
                        fstart={start}
                        fend={end}
                        fcargo={cargo}
                        ffloor={floor}
                        fdenomination={denomination}
                        setLoadingArea={setLoadingArea}
                        setDischargeArea={setDischargeArea}
                        setLoadingPort={setLoadingPort}
                        setDischargePort={setDischargePort}
                        setLoadingCountry={setLoadingCountry}
                        setDischargeCountry={setDischargeCountry}
                        setPod={setPod}
                        setPol={setPol}
                        setTrade={setTrade}
                        setFloor={setFloor}
                        setCargo={setCargo}
                        setCieling={setCieling}
                        setDenomination={setDenomination}
                        setStart={setStart}
                        setEnd={setEnd}
                        split={split}
                        setSplitModal={setSplitModal}
                        setInfo={setInfo}
                        publishCount={publishCount}
                        setPublishCount={setPublishCount}
                        getRules={getRules}
                    />)

                });
            }
        }
        return array;
    }
    useEffect(() => {
    }, [denomination])


    return <>
        <Header toggleEdit={toggleEdit} edit={edit} name="Floor Ceiling Rules"
            setFloors={setFloors} floors={floors} currentBu={currentBu} user={user} nav={nav} permission={permission} />
        <Top all={all} selectAll={selectAll} selectIndexes={selectIndexes} setFloors={setFloors} floors={floors} nav={nav}
            temp_floors={temp_floors} setTempFloors={setTempFloors} setRules={setRules} currentBu={currentBu} user={user} />
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
                showModal={showModal}
            />
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

Floor.propTypes = {
    rules: PropTypes.array,
    permission: PropTypes.string,
    ruleLoading: PropTypes.bool,
    currentBu: PropTypes.string,
    user: PropTypes.object,
    setRules: PropTypes.func,
    nav: PropTypes.string,
    setPublishCount: PropTypes.func,
    publishCount: PropTypes.string,
    setInfo: PropTypes.func,
    setChangeCount: PropTypes.func,
    getRules: PropTypes.func
}

export default Floor;