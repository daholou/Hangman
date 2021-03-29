import './LetterCard.css'

import React from 'react'
import PropTypes from 'prop-types'

const HIDDEN_SYMBOL = '_'


// Component for displaying a single letter as a card in the hangman game.
// The letter is either hidden (and a character '_' is displayed), or
// revealed in which case the corresponding character is displayed.
const LetterCard = ({gameOver, character, isHidden}) => (
    <span className={`letterCard ${(isHidden && gameOver) ? 'gameOver':''}`}>
        {!isHidden ? character : gameOver ? character : HIDDEN_SYMBOL}
    </span>
)

LetterCard.propTypes = {
    gameOver: PropTypes.bool.isRequired,
    character: PropTypes.string.isRequired,
    isHidden: PropTypes.bool.isRequired,
}


export default LetterCard
