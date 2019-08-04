/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import 'animate.css/animate.min.css';
import React, {Component} from 'react';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';

import '../../style/main.css';
import {FileBrowser, FolderView} from '../../src';

export default class FullDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentFolderId: props.rootFolderId,
        };
        this.notifRef = React.createRef();
    }

    showNotification(type, title, message) {
        if (!this.notifRef.current) return;
        this.notifRef.current.addNotification({
            type,
            title,
            message,
            insert: 'top',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {duration: 6000},
            dismissable: {click: true},
        });
    }

    handleFileOpen = file => {
        if (file.isDir) {
            this.setState({currentFolderId: file.id});
        } else {
            this.showNotification('success', `Open: \`${file.base}\``,
                `You just tried to open a ${file.isDir ? 'folder' : 'file'}.`);
        }
    };

    generateThumbnail() {

    }

    render() {
        const {fileMap} = this.props;
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
            <ReactNotification ref={this.notifRef}/>
            <div className="example-wrapper">
                <FileBrowser files={files} folderChain={folderChain}
                             onFileOpen={this.handleFileOpen} view={FolderView.SmallThumbs}/>
            </div>
        </div>;
    }
}
