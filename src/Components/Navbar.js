import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap';
import "./index.css"
import PropTypes from 'prop-types';
import Button from './Button';
import PublishIcon from "../Utils/Svgs/Publish.svg"

const Navbar = ({ setNav, nav, user, currentBu, getRules, publishCount, permission }) => {
    let [perm, setEditPerm] = useState(false)
    let [published, setPublish] = useState(false)
    const publishRules = async () => {
        let params = {
            accessToken: user.accessToken,
            BU: currentBu,
            userID: user.ID,
            isAdmin: false
        }
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/publish`, params);
            setPublish(true)
            getRules()
        }
        catch (e) {
            if (e.response.data) {
                window.alert(e.response.data.message)
            }
        }
    }

    useEffect(() => {
        let perm = (permission === "Update")
        setEditPerm(perm);
    }, [permission])
    return (<Row className="w-100 h-max-content justify-content-start  position-relative" noGutters style={{ backgroundColor: "#F0F2F7" }}>
        <Col md={5}>
            <Row className="pt-3">
                <Col  >
                    <div onClick={() => setNav("price_floor_and_ceiling")} className={`row align-items-center no-gutters justify-content-center 
                ${(nav === "price_floor_and_ceiling") ? "nav-tab nav-tab-selected" : "nav-tab"}`}>
                        Floor/Ceiling
                </div>
                </Col>
                <Col  >
                    <div onClick={() => setNav("market_condition_price")} className={`row align-items-center no-gutters justify-content-center 
                ${(nav === "market_condition_price") ? "nav-tab nav-tab-selected" : "nav-tab"}`}>
                        Market Condition
                </div>
                </Col>
                <Col  >
                    <div onClick={() => setNav("comm")} className={`row align-items-center no-gutters justify-content-center 
                ${(nav === "comm") ? "nav-tab nav-tab-selected" : "nav-tab"}`}>
                        Commodity
                </div>
                </Col>
            </Row>
        </Col>
        <div className="position-absolute h-100 row no-gutters align-items-center" style={{ right: 20 }}>
            {/* {perm && <Button onClick={publishRules} variant="dark">Publish {`(${publishCount})`}</Button>} */}
            {perm && <Button onClick={publishRules} className={(published) ? "publish-success" : ""} text={(published) ? <span><i className="far fa-check-circle"></i> Published</span> :<><img src={PublishIcon} /> <span>{"Publish (" + publishCount +") rules"}</span></>} height={40} width={200} />}
        </div>

    </Row>)
}


Navbar.propTypes = {
    setNav: PropTypes.func,
    nav: PropTypes.string,
    user: PropTypes.object,
    currentBu: PropTypes.string,
    getRules: PropTypes.func,
    publishCount: PropTypes.string,
    permission: PropTypes.string
}

export default Navbar;