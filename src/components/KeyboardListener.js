import React, {Component} from 'react'
import PropTypes from 'prop-types'


class KeyboardListener extends Component
{
    onKeyup = (keyCode) => {
        console.log("default onKeyup", keyCode)
    }

    handleKeyUp = (event) => {
        this.onKeyup(event.keyCode)
    }

    constructor(props)
    {
        super(props)
        const {onKeyup} = props
        this.onKeyup = onKeyup
    }

    componentDidMount()
    {
        window.addEventListener('keypress', this.handleKeyUp);
    }

    componentWillUnmount()
    {
        window.removeEventListener('keypress', this.handleKeyUp);
    }

    render()
    {
        return (<div/>)
    }
}


KeyboardListener.propTypes = {
    onKeyup: PropTypes.func.isRequired
}

export default KeyboardListener