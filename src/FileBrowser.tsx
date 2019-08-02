/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {shallowEqualArrays, shallowEqualObjects} from 'shallow-equal';

import FileList from './FileList';
import Controls from './Controls';
import {FileUtil} from './FileUtil';
import {FileData, FolderView, Option, Options, SortOrder, SortProperty} from './typedef';

type FileBrowserProps = {
    fileMap: { [id: string]: FileData };

    folderId?: string;
    fileIds?: string[];

    defaultView?: FolderView;
    defaultOptions?: Partial<Options>;
    defaultSortProperty?: SortProperty;
    defaultSortOrder?: SortOrder;
}

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
    folderChain?: (FileData | null)[];
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

        const options = {
            [Option.ShowHidden]: true,
            [Option.FoldersFirst]: true,
            [Option.ShowExtensions]: true,
            [Option.ConfirmDeletions]: true,
            [Option.DisableSelection]: true,
            ...defaultOptions,
        };
        const [rawFiles, missingIds] = FileUtil.prepareRawFiles(fileMap, folderId, propFileIds);
        const sortProperty = defaultSortProperty ? defaultSortProperty : SortProperty.Name;
        const sortOrder = defaultSortOrder ? defaultSortOrder : SortOrder.Asc;
        this.state = {
            folderChain: folderId ? FileUtil.getFolderChain(fileMap, folderId) : undefined,
            rawFiles,
            missingIds,
            sortedFiles: FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder),
            view: defaultView ? defaultView : FolderView.Details,
            options,
            sortProperty,
            sortOrder,
        };
    }

    componentWillReceiveProps(nextProps: Readonly<FileBrowserProps>): void {
        const {fileMap: oldFileMap, folderId: oldFolderId, fileIds: oldFileIds} = this.props;
        const {fileMap, folderId, fileIds} = nextProps;
        if (fileMap !== oldFileMap || folderId !== oldFolderId || !shallowEqualArrays(fileIds, oldFileIds)) {
            const [rawFiles, missingIds] = FileUtil.prepareRawFiles(fileMap, folderId, fileIds);
            this.setState({rawFiles, missingIds});
        }
    }

    componentDidUpdate(prevProps: Readonly<FileBrowserProps>, prevState: Readonly<FileBrowserState>,
                       snapshot?: any): void {
        const {
            rawFiles: oldRawFiles, options: oldOptions,
            sortProperty: oldSortProperty, sortOrder: oldSortOrder,
        } = prevState;
        const {rawFiles, options, sortProperty, sortOrder} = this.state;
        const needToResort = !shallowEqualArrays(rawFiles, oldRawFiles)
            || !shallowEqualObjects(options, oldOptions)
            || sortProperty !== oldSortProperty
            || sortOrder !== oldSortOrder;
        if (needToResort) {
            this.setState({
                sortedFiles: FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder),
            });
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
        const {folderChain, sortedFiles, view, options, sortProperty, sortOrder} = this.state;

        const className = classnames({
            'chonky': true,
            'chonky-no-select': options[Option.DisableSelection],
        });
        return (
            <div className={className}>
                <Controls folderChain={folderChain} view={view} setView={this.setView}
                          options={options} setOption={this.setOption}/>
                <FileList files={sortedFiles} view={view} sortProperty={sortProperty} sortOrder={sortOrder}
                          activateSortProperty={this.activateSortProperty}/>
            </div>
        );
    }

}
