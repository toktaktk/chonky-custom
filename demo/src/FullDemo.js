/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import '../../style/main.css';
import {FileBrowser} from '../../src';
import React, {Component} from 'react';

import fsData from './project-fs';
import PageTitle from './PageTitle';

export default class FullDemo extends Component {

    constructor(props) {
        super(props);

        const fileMap = fsData.fileMap;
        for (const fileId in fileMap) {
            fileMap[fileId].modDate = new Date(fileMap[fileId].modDate);
        }
    }

    render() {
        return (
            <div>
                <PageTitle/>
                <p>Chonky is a file browser component for React.</p>
                <div className="example-wrapper">
                    <FileBrowser fileMap={fsData.fileMap} folderId={fsData.root}/>
                </div>
            </div>
        );
    }
}
