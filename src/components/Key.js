import './Key.css'

import React from 'react'
import PropTypes from 'prop-types'


// Component for displaying a clickable key (from A to Z) as a possible try
// in the hangman game.
// An untouched key is visibly different from a key that has already been tried.
const Key = ({character, feedback, funcOnClick}) => (
    <div
        className={`key ${feedback}`}
        onClick={() => funcOnClick(character)}
    >
        <span className='symbol'>
            {character}
        </span>
    </div>
)


// prop types
Key.propTypes = {
    character: PropTypes.oneOf([
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']),
    feedback: PropTypes.oneOf(['tried-ko', 'tried-ok', 'not-tried']),
    funcOnClick: PropTypes.func.isRequired,
}

export default Key
