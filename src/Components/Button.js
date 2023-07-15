import React from 'react'
import PropTypes from "prop-types"

const Button = ({ text, height = 22, width = 100, onClick, className, disabled }) => {
    return <button style={(disabled) ? { height, width, opacity: 0.3 } : { height, width }} className={`button ${className ? className : ""}`} onClick={(onClick) ? onClick : () => { }} >
        {text}
    </button>
}

Button.propTypes = {
    text: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool
}


export default Button;