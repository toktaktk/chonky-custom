/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {render} from 'react-dom';
import React, {Component} from 'react';

import './index.css';
import FullDemo from './FullDemo';

class App extends Component {

    render() {
        return <div>
            <FullDemo/>
        </div>;
    }

}

render(<App/>, document.querySelector('#root'));
