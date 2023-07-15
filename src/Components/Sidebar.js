import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Button from "./Button"
import Logo from "../Utils/Svgs/logo.svg"

const Sidebar = ({ bus, user, currentBu, setCurrentBu, setCurrentPermission }) => {
    let [current, setCurrent] = useState((user != "" && user != null) ? user.myBUs : [])
    let [profile, setProfile] = useState(false)
    useEffect(() => {
        if (current.length > 0) {
            setCurrentBu(current[0].BU)
            setCurrentPermission(current[0].PREMISHION)

        }
    }, [current])


    useEffect(() => {
        setCurrent(user.myBUs)
    }, [user]);


    return <div className="vh-100 w-100  pt-3 sidebar" style={{ background: "url(sidebar.png) left top /cover no-repeat" }}>
        <img src={Logo} className="mb-1"/>
        <div onClick={() => { setProfile(!profile) }} className=" text-center w-100 no-gutters  row  align-items-center justify-content-center position-relative mb-3" style={{ height: 50, fontSize: 14, color: (profile) ? "#133C8B" : "white", backgroundColor: (profile) ? "white" : "#274C95" }}>
           
            <span className="cursor">Name K. <i className={(profile) ? "fa fa-caret-right" : "fas fa-caret-down"}></i></span>
            {
                profile &&
                <div className="position-absolute profile-container shadow-lg p-3">
                    <Row style={{ height: 109 }} noGutters >
                        <Col md={5} className="pr-2">
                            <div className="profile-pic w-100 h-100 rounded">
                                {user ? user.name[0] : ""}
                            </div>
                        </Col>
                        <Col md={7} >
                            <h4 className="text-white text-left mb-1">{user ? user.name : ""}</h4>
                            <div className="text-white text-left mb-3" style={{ fontSize: 12 }}>{user ? user.ID : ""}</div>
                            <Button text="View Profile" height={32} />
                        </Col>
                    </Row>
                    <div className="w-100 bg-white mt-3 mb-2 " style={{ height: 1 }}></div>
                    <div className="text-white text-left">Logout</div>
                </div>
            }
        </div>
        <div className="text-white text-center w-100 no-gutters  row flex-column justify-content-center" style={{ height: 50 }}>BU</div>

        {
            bus.map(val => {
                let selection = current.findIndex((value) => {
                    return value.BU === val
                });
                if (selection >= 0) {
                    return <div onClick={() => {
                        setCurrentBu(val)
                        setCurrentPermission(current[selection].PREMISHION)
                    }}
                        className={`text-white no-gutters cursor text-center w-100 row flex-column justify-content-center${(currentBu === val) ?
                            "  selected-submenu " : ""}`}
                        style={{ height: 50 }}>{val}</div>
                }
                else {
                    return <div className="text-white text-center w-100 no-gutters  row flex-column justify-content-center" style={{ height: 50 }}>{val}</div>
                }
            })
        }
    </div>
}


Sidebar.propTypes = {
    bus: PropTypes.array, user: PropTypes.object, currentBu: PropTypes.string, setCurrentBu: PropTypes.func, setCurrentPermission: PropTypes.func
}

export default Sidebar;