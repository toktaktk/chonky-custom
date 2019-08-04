/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {render} from 'react-dom';
import React, {Component} from 'react';

import './index.css';
import FullDemo from './FullDemo';
import {fileMap as picsFileMap, rootFolderId as picsFolderId} from './fs_japan_pics';
import {fileMap as chonkyFileMap, rootFolderId as chonkyFolderId} from './fs_chonky_project';

const processFileMapDates = fileMap => {
    for (const fileId in fileMap) {
        if (!fileMap.hasOwnProperty(fileId)) continue;
        fileMap[fileId].modDate = new Date(fileMap[fileId].modDate);
    }
};
processFileMapDates(picsFileMap);
processFileMapDates(chonkyFileMap);

const rootFolderId = 'my-root-folder';
const foreverLoadingFolderId = 'i-load-forever';
const fileMap = {
    ...picsFileMap,
    ...chonkyFileMap,
    [rootFolderId]: {
        id: rootFolderId,
        base: 'Demo Root',
        name: 'Demo Root',
        ext: '',
        modDate: new Date(),
        isDir: true,
        parentId: null,
        childrenIds: [picsFolderId, chonkyFolderId, foreverLoadingFolderId],
    },
    [foreverLoadingFolderId]: {
        id: foreverLoadingFolderId,
        base: 'Folder that loads forever',
        name: 'Folder that loads forever',
        ext: '',
        modDate: new Date(),
        isDir: true,
        parentId: rootFolderId,
        childrenIds: ['bad-id-1', 'bad-id-2', 'bad-id-3', 'bad-id-4'],
    },
};
fileMap[picsFolderId].parentId = rootFolderId;
fileMap[chonkyFolderId].parentId = rootFolderId;

class App extends Component {

    render() {
        return <div>
            <FullDemo fileMap={fileMap} rootFolderId={rootFolderId}/>
        </div>;
    }

}

render(<App/>, document.querySelector('#root'));
