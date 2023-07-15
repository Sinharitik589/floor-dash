import axios from 'axios';
import React from 'react'
import * as XLSX from 'xlsx';
import { reverseDate } from '../Utils';
import PropTypes from "prop-types"
import ImportIcon from "../Utils/Svgs/Import-excel.svg"

export const ImportCsv = ({ nav, setFloors, user, floors }) => {

    const importAndChange = (e) => {
        let array = floors.map(val => val);
        let selectedFile = e.target.files[0];//selected file instance
        //if there is a file selected
        if (selectedFile) {
            let fileReader = new FileReader(); //Object of the class filereader
            fileReader.readAsBinaryString(selectedFile);//reading the contents
            fileReader.onload = (event) => {/* Callback when the file is read */
                let data = event.target.result;//content of the file
                let workbook = XLSX.read(data, { type: "binary" });//getting all sheets as binary
                workbook.SheetNames.forEach(async sheet => {

                    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);//converting to json object and storing in rowObject
                    let rules = rowObject.map(val => {
                        let { TRADE, RULE_TYPE, POL_AREA, POL_COUNTRY, POL_GROUP_CODE, param1, param2, param3, POL_CODE, POD_AREA,
                            POD_COUNTRY, POD_GROUP_CODE, POD_CODE, CONTAINER_TYPE, START, END, STATUS, CONFLICT, ID } = val;
                        let obj = {};
                        //Checking the current nav and storing values in object accordingly
                        if (nav === "price_floor_and_ceiling") {
                            obj = {
                                trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                                dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                                start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : "NEW", conflict: (CONFLICT != null) ? true : false,
                                cieling: param3, floor: param2, denomination: param1, ID

                            }
                        }
                        else if (nav === "market_condition_price") {
                            obj = {
                                trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                                dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                                start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : "NEW", conflict: (CONFLICT != null) ? true : false,
                                charge: param2, denomination: param1, ID
                            }
                        }
                        else if (nav === "comm") {
                            obj = {
                                trade: TRADE, rule: RULE_TYPE, loadingArea: POL_AREA, loadingCountry: POL_COUNTRY, pol: POL_GROUP_CODE, loadingPort: POL_CODE,
                                dischargeArea: POD_AREA, dischargeCountry: POD_COUNTRY, pod: POD_GROUP_CODE, dischargePort: POD_CODE, cargo: CONTAINER_TYPE,
                                start: reverseDate(START), end: reverseDate(END), status: (STATUS != null && STATUS != undefined) ? STATUS : "NEW", conflict: (CONFLICT != null) ? true : false,
                                charge: param2, comGroup: param3, denomination: param1, ID
                            }
                        }
                        return obj;
                    });

                    array = [...rules, ...array]//adding newly inserted rules to the array
                    let data_object =
                    {
                        accessToken: user.accessToken,
                        itemList: rowObject
                    }

                    try {
                        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addMultiroule`, data_object);
                        const IDs = res.data.IDs;
                        if (res.status == 200) {
                            for (let x = 0; x < rules.length; x++) {
                                let new_obj = Object.assign({}, array[x])
                                new_obj.ID = IDs[x];//mapping newly assigned ID to the rules created
                                array[x] = new_obj;
                            }
                            setFloors(array);//when status is 200 appending all values to array
                        }
                        else {
                            window.alert("Not allowed")
                        }
                    }
                    catch (e) {
                        console.log(e);
                        window.alert("Try again");
                    }
                });
            }
        }
    }
    return (
        <>
            <label title="import" className="mb-0 mr-1" htmlFor="inp"><img src={ImportIcon} /></label>
            <input style={{ display: "none" }} type="file" accept=".xlsx" onChange={importAndChange} id="inp" />
        </>
    )
}

ImportCsv.propTypes = {
    nav: PropTypes.string, setFloors: PropTypes.func, user: PropTypes.object, floors: PropTypes.array
}



