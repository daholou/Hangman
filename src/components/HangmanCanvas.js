import './HangmanCanvas.css'

import React from 'react'
import PropTypes from 'prop-types'

function min(a, b)
{
    return a < b ? a : b
}

const HangmanCanvas = ({lives, mistakes, maxMistakes, active, index}) => (
    <div className={`hangmanCanvas ${mistakes>=maxMistakes ? 'gameOver' : active ? 'active' : ''}`}>
        <p>P{index+1}: {mistakes} {mistakes>1?'mistakes':'mistake'}, {lives} {lives>1?'lives':'life'} left</p>
        <img
            className='drawing'
            src={`../res/step${min(maxMistakes-lives, maxMistakes)}.png`}
            alt='Loading hangman pic...' width='200' height='200'/>
    </div>
)


HangmanCanvas.propTypes = {
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    lives: PropTypes.number.isRequired,
    maxMistakes: PropTypes.number.isRequired,
    mistakes: PropTypes.number.isRequired,
}

export default HangmanCanvas
