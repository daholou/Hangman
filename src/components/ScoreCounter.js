import './ScoreCounter.css'

import React from 'react'
import PropTypes from 'prop-types'

// Counter for displaying the current number of tries
const ScoreCounter = ({ numberOfTries, errorCost }) => (
    <div className='tries'>
        <span>Total number of tries: { numberOfTries }. </span>
        <span>The next mistake costs {errorCost} {errorCost>1?'lives':'life'}.</span>
    </div>
)

ScoreCounter.propTypes = {
    numberOfTries: PropTypes.number.isRequired,
    errorCost: PropTypes.number.isRequired,
}

export default ScoreCounter

