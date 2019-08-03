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
import {
    FileData,
    FolderView,
    Nullable,
    Option,
    Options,
    SortOrder,
    SortProperty,
} from './typedef';

// Important: Make sure to keep `FileBrowserProps` and `FileBrowserPropTypes` in sync!
type FileBrowserProps = {
    files: Nullable<FileData>[];
    folderChain?: Nullable<FileData>[];

    doubleClickDelay?: number;
    handleFileSingleClick?: (file: FileData, keyboard: boolean) => boolean | undefined;
    handleFileDoubleClick?: (file: FileData, keyboard: boolean) => boolean | undefined;
    handleFileOpen?: (file: FileData) => void;

    defaultView?: FolderView;
    defaultOptions?: Partial<Options>;
    defaultSortProperty?: SortProperty;
    defaultSortOrder?: SortOrder;
}

// Important: Make sure to keep `FileBrowserProps` and `FileBrowserPropTypes` in sync!
const FileBrowserPropTypes = {
    files: PropTypes.array.isRequired,
    folderChain: PropTypes.array,

    doubleClickDelay: PropTypes.number,
    handleFileSingleClick: PropTypes.func,
    handleFileDoubleClick: PropTypes.func,
    handleFileOpen: PropTypes.func,

    defaultView: PropTypes.string,
    defaultOptions: PropTypes.object,
    defaultSortProperty: PropTypes.string,
    defaultSortOrder: PropTypes.string,
};

type FileBrowserState = {
    rawFiles: Nullable<FileData>[];
    folderChain?: Nullable<FileData>[];
    sortedFiles: Nullable<FileData>[];

    view: FolderView;
    options: Options;
    sortProperty: SortProperty;
    sortOrder: SortOrder;
}

export default class FileBrowser extends React.Component<FileBrowserProps, FileBrowserState> {

    static propTypes = FileBrowserPropTypes;

    static defaultProps: Partial<FileBrowserProps> = {
        doubleClickDelay: 300,
    };

    constructor(props: FileBrowserProps) {
        super(props);

        const {files, folderChain, defaultView, defaultOptions, defaultSortProperty, defaultSortOrder} = props;
        const rawFiles = files.concat([null, null]);
        const sortProperty = defaultSortProperty ? defaultSortProperty : SortProperty.Name;
        const sortOrder = defaultSortOrder ? defaultSortOrder : SortOrder.Asc;

        const options = {
            [Option.ShowHidden]: true,
            [Option.FoldersFirst]: true,
            [Option.ShowExtensions]: true,
            [Option.ConfirmDeletions]: true,
            [Option.DisableSelection]: true,
            ...defaultOptions,
        };

        this.state = {
            rawFiles,
            folderChain,
            sortedFiles: FileUtil.sortFiles(rawFiles, options, sortProperty, sortOrder),
            view: defaultView ? defaultView : FolderView.Details,
            options,
            sortProperty,
            sortOrder,
        };
    }

    componentWillReceiveProps(nextProps: Readonly<FileBrowserProps>): void {
        const old = this.props;
        const {files, folderChain} = nextProps;
        if (!shallowEqualArrays(files, old.files)) {
            this.setState({rawFiles: files});
        }
        if (!shallowEqualArrays(folderChain, old.folderChain)) {
            this.setState({folderChain});
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
        const {handleFileOpen} = this.props;
        const {folderChain, sortedFiles, view, options, sortProperty, sortOrder} = this.state;

        const className = classnames({
            'chonky': true,
            'chonky-no-select': options[Option.DisableSelection],
        });
        return (
            <div className={className}>
                <Controls folderChain={folderChain} handleFileOpen={handleFileOpen} view={view}
                          setView={this.setView} options={options} setOption={this.setOption}/>
                <FileList files={sortedFiles} view={view} sortProperty={sortProperty} sortOrder={sortOrder}
                          activateSortProperty={this.activateSortProperty}/>
            </div>
        );
    }

}
