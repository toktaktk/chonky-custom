/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

import FileDetailsView from './FileDetailsView';
import {FileData, FolderView, Nullable, SortOrder, SortProperty} from './typedef';

type FileListProps = {
    files: Nullable<FileData>[];
    view: FolderView;
    sortProperty: SortProperty;
    sortOrder: SortOrder;
    activateSortProperty: (name: SortProperty) => void;
}

type FileListState = {}

export default class FileList extends React.Component<FileListProps, FileListState> {

    static defaultProps = {};

    constructor(props: FileListProps) {
        super(props);
    }

    render() {
        const {files, view, sortProperty, sortOrder, activateSortProperty} = this.props;

        if (view === FolderView.Details) {
            return <FileDetailsView files={files} sortProperty={sortProperty} sortOrder={sortOrder}
                                    activateSortProperty={activateSortProperty}/>;
        }

        return <div className="chonky-file-list">
            Hello World!
        </div>;
    }

}
