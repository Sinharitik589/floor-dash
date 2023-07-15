import React from 'react'
import { Badge } from 'react-bootstrap'
import PropTypes from "prop-types"



const Badges = ({ status, conflict }) => {
    if (!conflict || status == "delete") {
        switch (status) {
            case "NEW":
                return <div className=" badge new-badge">New</div>
            case "DELETED":
                return <div className=" badge deleted-badge">Deleted</div>
            case "EDIT":
                return <div className=" badge edited-badge">Edited</div>
            case "DUPLICATE":
                return <div className=" badge new-badge">New</div>
            case "SPLIT":
                return <div className=" badge split-badge">Splitted</div>
            default:
                return <div style={{ opacity: 0 }}><Badge variant="success">Success</Badge></div>
        }
    }
    else
        return <div className=" badge conflict-badge">Conflict</div>
}

Badges.propTypes = {
    status: PropTypes.string,
    conflict:PropTypes.bool
}

export default Badges