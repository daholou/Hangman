import React from 'react'
import PropTypes from 'prop-types'


const DictionarySelector = ({currentUrl, urlAndNames, funcOnClick}) => { return (
    <form>
        <label htmlFor='dictionaries'>Choose a dictionary : </label>
        <select
            name='dictionaries'
            id='dictionaries'
            >
            { urlAndNames.map( ({url, name}, index) => (
                <option value={url}
                        key={index}
                        disabled={url===currentUrl}
                        onClick={ () => funcOnClick(url, name) }
                >
                    {name}
                </option>)
            )}
        </select>
    </form>
)}


DictionarySelector.propTypes = {
    currentUrl: PropTypes.string.isRequired,
    urlAndNames: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    funcOnClick: PropTypes.func.isRequired,
}

export default DictionarySelector
