/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import Denque from 'denque';
import PropTypes from 'prop-types';

import FileList from './FileList';
import Controls from './Controls';
import {FileData, FileMap, FolderView, Option, Options, SortOrder, SortProperty} from './typedef';

type FileBrowserProps = {
    fileMap: { [id: string]: FileData };

    folderId?: string;
    fileIds?: string[];

    defaultView?: FolderView;
    defaultOptions?: Partial<Options>;
    defaultSortProperty?: SortProperty;
    defaultSortOrder?: SortOrder;
}

console.log(PropTypes);

const FileBrowserPropTypes = {
    fileMap: PropTypes.object.isRequired,

    folderId: PropTypes.string,
    fileIds: PropTypes.arrayOf(PropTypes.string),

    defaultView: PropTypes.string,
    defaultOptions: PropTypes.object,
    defaultSortProperty: PropTypes.string,
    defaultSortOrder: PropTypes.string,
};

type FileBrowserState = {
    folder?: FileData;
    rawFiles: FileData[];
    missingIds: string[];
    sortedFiles: FileData[];

    view: FolderView;
    options: Options;
    sortProperty: SortProperty;
    sortOrder: SortOrder;
}

export default class FileBrowser extends React.Component<FileBrowserProps, FileBrowserState> {

    static propTypes = FileBrowserPropTypes;

    static defaultProps: Partial<FileBrowserProps> = {};

    constructor(props: FileBrowserProps) {
        super(props);

        const {fileMap, folderId, fileIds: propFileIds, defaultView, defaultOptions, defaultSortProperty, defaultSortOrder} = props;

        if (folderId && propFileIds) {
            console.warn('[Chonky] Both `folderId` and `fileIds` were specified as props for FileBrowser. ' +
                'Using `fileIds`.');
        }

        let folder;
        let fileIds = null;
        if (propFileIds) {
            fileIds = propFileIds;
        } else if (folderId) {
            folder = fileMap[folderId];
            fileIds = folder.children;
        } else {
            throw new Error('[Chonky] Neither `folderId` nor `fileIds` were specified as props for FileBrowser.');
        }

        const options = {
            [Option.ShowHidden]: true,
            [Option.FoldersFirst]: true,
            [Option.ShowExtensions]: true,
            [Option.ConfirmDeletions]: true,
            ...defaultOptions,
        };
        const [rawFiles, missingIds] = FileBrowser.prepareRawFiles(fileMap, fileIds);
        const sortProperty = defaultSortProperty ? defaultSortProperty : SortProperty.Name;
        const sortOrder = defaultSortOrder ? defaultSortOrder : SortOrder.Asc;
        this.state = {
            folder,
            rawFiles,
            missingIds,
            sortedFiles: FileBrowser.sortFiles(rawFiles, options, sortProperty, sortOrder),
            view: defaultView ? defaultView : FolderView.Details,
            options,
            sortProperty,
            sortOrder,
        };
    }

    static prepareComparator = (foldersFirst: boolean, sortProperty: SortProperty, sortOrder: SortOrder) => {
        return (fileA: FileData, fileB: FileData) => {
            if (foldersFirst) {
                if (fileA.isDir && !fileB.isDir) return -1;
                else if (!fileA.isDir && fileB.isDir) return 1;
            }
            let propA;
            let propB;
            let returnVal = sortOrder === SortOrder.Asc ? 1 : -1;
            if (sortProperty === SortProperty.Size) {
                propA = fileA.size;
                propB = fileB.size;
            } else if (sortProperty === SortProperty.ModDate) {
                propA = fileA.modDate;
                propB = fileB.modDate;
            } else {
                propA = fileA.base;
                propB = fileB.base;
            }
            if (propA > propB) return returnVal;
            else return -returnVal;
        };
    };

    static prepareRawFiles(fileMap: FileMap, fileIds: string[]): [FileData[], string[]] {
        const rawFilesQueue = new Denque();
        const missingIdsQueue = new Denque();
        for (let i = 0; i < fileIds.length; ++i) {
            const id = fileIds[i];
            const file = fileMap[id];
            if (file) rawFilesQueue.push(file);
            else missingIdsQueue.push(id);
        }
        return [rawFilesQueue.toArray(), missingIdsQueue.toArray()];
    }

    static sortFiles(rawFiles: FileData[], options: Options,
                     sortProperty: SortProperty, sortOrder: SortOrder): FileData[] {
        let files = rawFiles.slice(0);
        if (!options[Option.ShowHidden]) files = files.filter(f => f.name.charAt(0) !== '.');
        const comparator = FileBrowser.prepareComparator(options[Option.FoldersFirst], sortProperty, sortOrder);
        files.sort(comparator);
        return files;
    }

    componentWillReceiveProps(nextProps: Readonly<FileBrowserProps>): void {
        const {fileMap: oldFileMap, fileIds: oldFileIds} = this.props;
        const {fileMap, fileIds} = nextProps;
        if (fileMap !== oldFileMap || fileIds !== oldFileIds) {
            // const [rawFiles, missingIds] = FileBrowser.prepareRawFiles(fileMap, fileIds);
            // this.setState({
            //
            // })
        }
    }

    setView = (view: FolderView) => {
        this.setState(prevState => {
            if (prevState.view !== view) return {view};
            return null;
        });
    };

    setOption = (name: Option, value: boolean) => {
        this.setState(prevState => {
            const {options} = prevState;
            if (options[name] !== value) return {options: {...options, [name]: value}};
            else return null;
        });
    };

    activateSortProperty = (name: SortProperty) => {
        this.setState(prevState => {
            if (prevState.sortProperty !== name) {
                return {sortProperty: name, sortOrder: SortOrder.Asc};
            } else {
                const sortOrder = prevState.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
                return {sortProperty: name, sortOrder};
            }
        });
    };

    render() {
        const {sortedFiles, view, options, sortProperty, sortOrder} = this.state;

        return (
            <div className="chonky">
                <Controls view={view} setView={this.setView} options={options} setOption={this.setOption}/>
                <FileList files={sortedFiles} view={view} sortProperty={sortProperty} sortOrder={sortOrder}
                          activateSortProperty={this.activateSortProperty}/>
            </div>
        );
    }

}
