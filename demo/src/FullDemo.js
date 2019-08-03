/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import '../../style/main.css';
import {FileBrowser} from '../../src';
import React, {Component} from 'react';

import {fileMap, rootFolderId} from './chonky_project_fs';
import PageTitle from './PageTitle';

for (const fileId in fileMap) {
    if (!fileMap.hasOwnProperty(fileId)) continue;
    fileMap[fileId].modDate = new Date(fileMap[fileId].modDate);
}

export default class FullDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentFolderId: fileMap[rootFolderId].childrenIds[0],
        };
    }

    openFile = file => {
        if (file.isDir) {
            this.setState({currentFolderId: file.id});
        } else {

        }
    };

    render() {
        const {currentFolderId} = this.state;
        const folder = fileMap[currentFolderId];

        const files = folder.childrenIds.map(id => fileMap[id]);
        const folderChain = [];
        let currentFolder = folder;
        while (currentFolder) {
            folderChain.unshift(currentFolder);
            const parentId = currentFolder.parentId;
            currentFolder = parentId ? fileMap[parentId] : null;
        }

        return <div>
            <PageTitle/>
            <p>Chonky is a file browser component for React.</p>
            <div className="example-wrapper">
                <FileBrowser files={files} folderChain={folderChain} handleFileOpen={this.openFile}/>
            </div>
        </div>;
    }
}
