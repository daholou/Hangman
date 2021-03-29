import './App.css'
import React, {Component} from 'react'

import Key from './components/Key'
import LetterCard from './components/LetterCard'
import ResetButton from './components/ResetButton'
import ScoreCounter from './components/ScoreCounter';

import HangmanCanvas from './components/HangmanCanvas';
import KeyboardListener from './components/KeyboardListener';
import DictionarySelector from "./components/DictionarySelector";

const ALPHABET = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const MAX_NB_MISTAKES = 12
const TITLE = 'The  Hangman  Game !'
const DICTIONARIES = [
    {
        url: 'res/words_alpha.txt',
        name: 'English',
    },
    {
        url: 'res/empty.txt',
        name: 'Empty',
    },
    {
        url: 'res/giant.txt',
        name: 'Giant',
    },
    {
        url: 'res/testDico2.txt',
        name: 'Test 2',
    },
    {
        url: 'res/testDico.txt',
        name: 'Test',
    },
    {
        url: 'res/francais.txt',
        name: 'French',
    },
    {
        url: 'res/oops',
        name: 'Oops',
    },
]



function max(a, b) { return a > b ? a : b }

// returns a random integer K such that min <= K <= max
function randomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeDiacritics(word)
{
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
function normalizedWord(word)
{
    const str = removeDiacritics(word)
    return str.toUpperCase()
}


// Returns the list of indices of each occurrence of string 'char' within
// the string 'text'
function searchIndices(text, char)
{
    const result = []
    let pos = text.indexOf(char)
    while(pos !== -1)
    {
        result.push(pos)
        pos = text.indexOf(char, pos+1)
    }
    return result
}

// Container component for the hangman game
class App extends Component
{
    state = {
        // index of active player
        activePlayer: 0,
        // name of current dictionary
        dictionaryName: 'no dictionary loaded',
        dictionaryURL: '',
        // indicates whether the dictionary has finished loading
        hasLoadedDictionary: false,
        // indicates whether the game is over
        isGameOver: true,
        // Array of available keys
        keys: ALPHABET,
        // Number of [lives left, mistakes] for each player
        numberOfLivesAndMistakes: [],
        // Current number of tries (a try==click on a letter)
        numberOfTries: 0,
        // Masked text, as an array of characters
        maskedChars: Array.from(TITLE),
        // Dictionary to pick random words from
        myDictionary: [],
        // text to unmask
        text: '',
        // normalized text
        normalizedText: '',
        // List of revealed characters in the masked text
        unmaskedIndices: [],
        // Set of tried letters
        usedLetters: new Set(),
    }

    isDictionaryEmpty()
    {
        return this.state.myDictionary.length === 0
    }

    // Note: this method is declared as an initializer (arrow function)
    // since it uses 'this' and is passed by reference later. This ensures a
    // correct binding.
    initDictionary = (url, name) =>
    {
        // should never happen, since DictionarySelector knows the current url
        if(url === this.state.dictionaryURL)
        {
            console.error('Already using this dictionary')
            return
        }

        // Set loaded flag to false, and only then try to load the next dict.
        this.setState({hasLoadedDictionary: false},
            () => this.initDictionaryCallback(url, name))
    }

    // Loads the dictionary of given name and url
    initDictionaryCallback(url, name)
    {
        // Deal with special characters correctly
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const decoder = new TextDecoder('utf8');
                return decoder.decode(buffer);
            })
            .then(text => {
                const rawDict = text.split('\n');
                let trimmedDict = []
                for(let k=0; k<rawDict.length; k++)
                {
                    const word = rawDict[k].trim()
                    if(word.length > 0)
                    {
                        trimmedDict.push(word)
                    }
                }
                this.setState({
                    hasLoadedDictionary: true,
                    myDictionary: trimmedDict,
                    dictionaryName: name,
                    dictionaryURL: url,
                })
            })
            .catch( (myError) => {
                console.error(myError)
            })
    }

    // After being mounted, load the first dictionary
    componentDidMount()
    {
        const randIndex = 0 //randomInteger(0, DICTIONARIES.length-1)
        const url = DICTIONARIES[randIndex].url
        const name = DICTIONARIES[randIndex].name
        this.initDictionary(url, name);
    }

    // Initializes the app given a number of players.
    // This will also select a new random word for players to unmask.
    // Note: this method is declared as an initializer (arrow function)
    // since it uses 'this' and is passed by reference later. This ensures a
    // correct binding.
    init = (numberOfPlayers) =>
    {
        // safeguard: does nothing when dictionary is empty
        if( ! this.state.hasLoadedDictionary )
        {
            console.error('Dictionary is still loading...')
            return
        }
        else if( this.isDictionaryEmpty() )
        {
            console.error('Cannot start a game, the dictionary is empty!')
            return
        }

        // grab a new random word to unmask
        const randomIndex = randomInteger(0, this.state.myDictionary.length-1)
        const newText = this.state.myDictionary[randomIndex].trim()
        const newNormalizedText = normalizedWord(newText)

        // new text to unmask
        const newMaskedChars = Array.from(newText)
        // unmask all indices that cannot be guessed from the alphabet
        const newUnmaskedIndices = []
        for(let k=0; k<newText.length; k++)
        {
            const char = newNormalizedText[k]
            if( ! ALPHABET.includes(char) )
            {
                newUnmaskedIndices.push(k)
            }
        }

        // new players
        const newNumberOfLivesAndMistakes = []
        for(let k=0; k<numberOfPlayers; k++)
        {
            newNumberOfLivesAndMistakes.push([MAX_NB_MISTAKES, 0])
        }

        // set the new initial state
        this.setState({
            activePlayer: 0,
            isGameOver: false,
            numberOfLivesAndMistakes: newNumberOfLivesAndMistakes,
            numberOfTries : 0,
            maskedChars: newMaskedChars,
            text: newText,
            normalizedText: newNormalizedText,
            unmaskedIndices: newUnmaskedIndices,
            usedLetters: new Set(),
        })
    }

    // returns true iff player at index i has no attempts left (too many
    // mistakes)
    gameOver(i)
    {
        const {numberOfLivesAndMistakes} = this.state
        return numberOfLivesAndMistakes[i][0] <= 0
    }

    // Returns the index of the next active player that has not lost yet, or
    // -1 if all players have lost
    getNextActivePlayer()
    {
        const {activePlayer, numberOfLivesAndMistakes} = this.state
        const size = numberOfLivesAndMistakes.length
        for(let k = 1; k <= size; k++)
        {
            const newActivePlayer = (activePlayer+k) % size
            if( !this.gameOver(newActivePlayer) )
            {
                return newActivePlayer
            }
        }
        return -1
    }

    playerCount()
    {
        return this.state.numberOfLivesAndMistakes.length
    }

    lifeCostPerMistake()
    {
        return this.alivePlayerCount()
    }

    // returns the number of players still alive (not game over)
    alivePlayerCount()
    {
        const {numberOfLivesAndMistakes} = this.state
        let result = 0
        for(let k = 0; k < numberOfLivesAndMistakes.length; k++)
        {
            if( !this.gameOver(k) )
            {
                result++
            }
        }
        return result
    }

    isValidChar(c)
    {
        const {maskedChars} = this.state
        return ( maskedChars.includes(c.toLowerCase()) ||
            maskedChars.includes(c.toUpperCase()) )
    }

    // Function called whenever a key is pressed (in the 'keyup' sense) on the
    // keyboard. Assuming it's a valid key (alphabet letter), this does the
    // same as clicking on the letter card for this key.
    // Note: this method is declared as an initializer (arrow function)
    // since it uses 'this' and is passed by reference later. This ensures a
    // correct binding.
    handleKeyUp = (keyCode) => {
        const character = String.fromCharCode(keyCode).toUpperCase()
        const {keys} = this.state
        if(keys.includes(character))
        {
            this.handleKeyClick(character)
        }
    }

    // Function called whenever a key is clicked, meaning the active player
    // wants to try a new letter (character).
    // Note: this method is declared as an initializer (arrow function)
    // since it uses 'this' and is passed by reference later. This ensures a
    // correct binding.
    handleKeyClick = (character) => {
        // destructure state
        const {activePlayer, isGameOver, numberOfLivesAndMistakes,
            numberOfTries, maskedChars, normalizedText, unmaskedIndices,
            usedLetters} = this.state

        // do nothing if the game is over, or if the letter is already used.
        if(this.playerCount()<1 || isGameOver || usedLetters.has(character))
        {
            return
        }

        // add letter to usedLetters
        const newUsedLetters = usedLetters
        newUsedLetters.add(character)
        // increment nb of tries by 1
        const newNumberOfTries = numberOfTries + 1
        // unmask as many chars as we can
        // const lowerIdx = searchIndices(text, character.toLowerCase())
        // const upperIdx = searchIndices(text, character.toUpperCase())
        // const newUnmaskedIndices = [...unmaskedIndices,
        //     ...lowerIdx, ...upperIdx]
        const idx = searchIndices(normalizedText, character.toUpperCase())
        const newUnmaskedIndices = [...unmaskedIndices, ...idx]

        let newIsGameOver = false
        let newNumberOfLivesAndMistakes = numberOfLivesAndMistakes
        let newActivePlayer = activePlayer
        // active player has made a mistake
        // if(lowerIdx.length === 0 && upperIdx.length === 0)
        if(idx.length === 0)
        {
            const [l, n] = newNumberOfLivesAndMistakes[activePlayer]
            // 1 error costs 1 life per active player
            const [l2, n2] = [max(0, l - this.lifeCostPerMistake()), n+1]
            newNumberOfLivesAndMistakes[activePlayer] = [l2, n2]
            // move to the next active player
            const next = this.getNextActivePlayer()
            if(next !== -1)
            {
                newActivePlayer = next
            }
            else
            {
                newIsGameOver = true
            }
        }
        else if( this.gameWon(maskedChars.length, newUnmaskedIndices.length))
        {
            newIsGameOver = true
        }

        this.setState({
            activePlayer: newActivePlayer,
            isGameOver: newIsGameOver,
            numberOfLivesAndMistakes: newNumberOfLivesAndMistakes,
            numberOfTries: newNumberOfTries,
            unmaskedIndices: newUnmaskedIndices,
            usedLetters: newUsedLetters,
        })
    }

    gameWon(nbMasked, nbUnmasked)
    {
        return nbMasked === nbUnmasked
    }

    // returns true iff the game is won
    winCondition()
    {
        const {maskedChars, unmaskedIndices} = this.state
        return this.gameWon(maskedChars.length, unmaskedIndices.length)
    }

    render()
    {
        const {activePlayer, isGameOver, keys, maskedChars,
            numberOfLivesAndMistakes, numberOfTries, unmaskedIndices,
            usedLetters} = this.state
        const loadingMsg = (
            <p>
                Loading dictionary...
            </p>)
        const emptyMsg = (
            <p>
                Cannot start: dictionary "{this.state.dictionaryName}" is empty !
            </p>)
        const loadedMsg = (
            <p>
                Current dictionary is "{this.state.dictionaryName}" with
                {' ' + this.state.myDictionary.length}
                {this.state.myDictionary.length > 1 ? ' words' : ' word'}.
            </p>)
        // This panel should appear when either:
        // - the game has not started (0 player)
        // - a player has won the game
        // - all players have lost the game (game over)
        // - ... and it only appears when the dictionary is loaded & not empty
        const resetPanel =  (!this.state.hasLoadedDictionary) ? loadingMsg :
            (this.isDictionaryEmpty() ? emptyMsg :
                (<div>
                    {[1,2,3,4].map( (n, index) => (
                        <ResetButton
                            playerCount={n}
                            funcOnClick={this.init}
                            key={index}
                        />))}
                </div>))
        // This panel shows up on page load (no game is launched yet)
        const startPanel = ( this.playerCount() < 1 && (
            <div className="victory">
                <p>Choose a mode to start the game !</p>
                {resetPanel}
            </div>))

        // Dictionary selector appears at the beginning of each game, so it
        // should be visible when either:
        // - there is 0 player
        // - a player just won the game
        // - all players just lost the game
        const showSelector = ( this.playerCount() < 1 ||
            this.winCondition() ||
            this.getNextActivePlayer() === -1 )
        const dictionaryPanel = (
            <div className='dictionaryPanel'>
                {this.state.hasLoadedDictionary ? loadedMsg : loadingMsg}
                {showSelector && (
                    <DictionarySelector currentUrl={this.state.dictionaryURL}
                                        urlAndNames={DICTIONARIES}
                                        funcOnClick={this.initDictionary}/>)
                }
            </div>
        )
        const victoryPanel = ( this.playerCount() >= 1 && this.winCondition() && (
            <div className="victory">
                <p>Player {activePlayer+1} wins the game !</p>
                {resetPanel}
            </div>))

        const gameOverPanel = ( this.playerCount() >= 1 && this.getNextActivePlayer() === -1 && (
            <div className="loss">
                <p>Game Over ! All players eliminated.</p>
                {resetPanel}
            </div>))

        // A display of the text to unmask, with letter cards
        const displayMaskedWord = (
            <div className="text">
                {maskedChars.map( (char, index) => (
                    <LetterCard
                        gameOver={isGameOver}
                        character={char}
                        isHidden={!unmaskedIndices.includes(index)}
                        key={index}
                    />)
                )}
            </div>)

        // All 26 keys form a keyboard area
        const keyboard = (
            <div className="keyboard">
                {keys.map( (myKey, index) => (
                    <Key
                        character={myKey}
                        feedback={usedLetters.has(myKey) ? (this.isValidChar(myKey) ? 'tried-ok':'tried-ko') : 'not-tried'}
                        funcOnClick={this.handleKeyClick}
                        key={index}
                    />)
                )}
            </div>)

        const hangmen = (
            <div className='hangmen'>
                {numberOfLivesAndMistakes.map( (ln, index) => (
                    <HangmanCanvas
                        lives={ln[0]}
                        mistakes={ln[1]}
                        maxMistakes={MAX_NB_MISTAKES}
                        active={activePlayer===index}
                        index={index}
                        key={index}
                    />)
                )}
            </div>)

        return (
            <div>
                {displayMaskedWord}
                {keyboard}
                <ScoreCounter
                    numberOfTries={numberOfTries}
                    errorCost={this.alivePlayerCount()}
                />
                {dictionaryPanel}
                {startPanel}
                {victoryPanel}
                {gameOverPanel}
                {hangmen}

                <KeyboardListener onKeyup={this.handleKeyUp}/>
            </div>
        )
    }
}




export default App;

