import React, { Component } from 'react'
import spinner from './loading.gif'

export default class Spinner extends Component {
    render() {
        return (
            <div className="text-center">
                <img src={spinner} alt="" />
            </div>
        )
    }
}
