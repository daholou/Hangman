import React from 'react'
import PropTypes from 'prop-types'


const ResetButton = ({playerCount, funcOnClick}) => (
    <button
        onClick={() => funcOnClick(playerCount)}
    >
        New Game ({playerCount} player{playerCount>1?'s':''})
    </button>
)

ResetButton.propTypes = {
    playerCount: PropTypes.number.isRequired,
    funcOnClick: PropTypes.func.isRequired,
}

export default ResetButton
