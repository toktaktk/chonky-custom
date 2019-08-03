/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import {
    faArrowUp as AscIcon,
    faArrowDown as DescIcon,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FileDetailsEntry from './FileDetailsEntry';
import {FileData, Nullable, SortOrder, SortProperty} from './typedef';

type FileDetailsViewProps = {
    files: Nullable<FileData>[];
    sortProperty: SortProperty;
    sortOrder: SortOrder;
    activateSortProperty: (name: SortProperty) => void;
}

type FileDetailsViewState = {}

const HeaderDetails = [
    [null, ''],
    [SortProperty.Name, 'Name'],
    [SortProperty.Size, 'Size'],
    [SortProperty.ModDate, 'Last change'],
];

export default class FileDetailsView extends React.Component<FileDetailsViewProps, FileDetailsViewState> {

    static defaultProps = {};

    constructor(props: FileDetailsViewProps) {
        super(props);
    }

    renderHeaders() {
        const {sortProperty, sortOrder, activateSortProperty} = this.props;
        const comps = new Array(HeaderDetails.length);
        for (let i = 0; i < HeaderDetails.length; ++i) {
            const [name, title] = HeaderDetails[i];
            const headerProps = !name ? {} : {
                tabIndex: 0,
                className: classnames({
                    'chonky-clickable': true,
                    'chonky-active': sortProperty === name,
                }),
                onClick: () => activateSortProperty(name as SortProperty),
            };
            comps[i] = <div key={`header-${name}`} {...headerProps}>
                {title}
                {sortProperty === name &&
                <span className="chonky-text-subtle">
                    &nbsp;
                    <FontAwesomeIcon icon={sortOrder === SortOrder.Asc ? AscIcon : DescIcon} fixedWidth size="sm"/>
                </span>
                }
            </div>;
        }
        return <div className="chonky-view-details-header">{comps}</div>;
    }

    renderRows() {
        const {files} = this.props;
        const comps = new Array(files.length);
        let loadingCounter = 0;
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            const key = file ? file.id : `loading-file-${loadingCounter++}`;
            comps[i] = <FileDetailsEntry key={key} file={file}/>;
        }
        return comps;
    }

    render() {
        return <div className="chonky-view-details">
            {this.renderHeaders()}
            {this.renderRows()}
        </div>;
    }

}
