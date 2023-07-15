import React, { useEffect } from 'react'
import Proptypes from "prop-types"

const Info = ({ type = "change", count }) => {

    useEffect(() => {
    }, [type])

    return <div className="position-absolute row justify-content-center" style={{ bottom: 40, width: "calc(100vw - 70px)" }}>
        <div className="toast-info shadow-lg rounded p-3 pl-2 pr-2" style={{ backgroundColor: (type === "duplicated") ? "rgb(244,142,0)" : "rgba(11,174,0)" }}>
            <i className="far fa-check-circle"></i> {
                (type === "duplicated") ? `${count} ${(count > 1) ? "Items" : "Item"} HAVE BEEN DUPLICATED` : "CHANGES SAVED"
            }
        </div>
    </div>
}


Info.propTypes = {
    type: Proptypes.string,
    count: Proptypes.number
}

export default Info;
