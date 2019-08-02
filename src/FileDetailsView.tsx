/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {If, Then, Else} from 'react-if';
import * as React from 'react';
import filesize from 'filesize';
import dateFormat from 'dateformat';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp as AscIcon, faArrowDown as DescIcon} from '@fortawesome/free-solid-svg-icons';

import {getIconData} from './IconUtil';
import {ColorsDark, FileData, SortOrder, SortProperty} from './typedef';

type FileDetailsViewProps = {
    files: FileData[];
    sortProperty: SortProperty;
    sortOrder: SortOrder;
    activateSortProperty: (name: SortProperty) => void;
}

type FileDetailsViewState = {}

export default class FileDetailsView extends React.Component<FileDetailsViewProps, FileDetailsViewState> {

    static defaultProps = {};

    static headerDetails = [
        [null, ''],
        [SortProperty.Name, 'Name'],
        [SortProperty.Size, 'Size'],
        [SortProperty.ModDate, 'Last change'],
    ];

    constructor(props: FileDetailsViewProps) {
        super(props);
    }

    renderHeaders() {
        const {sortProperty, sortOrder, activateSortProperty} = this.props;
        const comps = new Array(FileDetailsView.headerDetails.length);
        for (let i = 0; i < FileDetailsView.headerDetails.length; ++i) {
            const [name, title] = FileDetailsView.headerDetails[i];
            comps[i] = <th key={`header-${name}`} onClick={() => activateSortProperty(name as SortProperty)}>
                {title}
                {sortProperty === name &&
                <span className="chonky-text-subtle">
                    &nbsp;
                    <FontAwesomeIcon icon={sortOrder === SortOrder.Asc ? AscIcon : DescIcon} fixedWidth size="sm"/>
                </span>
                }
            </th>;
        }
        return comps;
    }

    renderRows() {
        console.log(If);
        const {files} = this.props;
        const comps = new Array(files.length);
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            const iconData = getIconData(file);
            comps[i] = <tr key={file.id}>
                <td style={{color: ColorsDark[iconData.colorCode], width: 1}}>
                    <FontAwesomeIcon icon={iconData.icon} fixedWidth/>
                </td>
                <td className="chonky-file-name">
                    <If condition={file.isDir}>
                        <Then>
                            {file.base}
                        </Then>
                        <Else>
                            {file.name}
                            <span>{file.ext}</span>
                        </Else>
                    </If>
                </td>
                <td>{file.size ? filesize(file.size, {bits: false}) : '—'}</td>
                <td>{dateFormat(file.modDate, 'HH:MM, mmm d, yyyy')}</td>
            </tr>;
        }
        return comps;
    }

    render() {

        return <table className="chonky-view-details">
            <thead>
            <tr>{this.renderHeaders()}</tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
        </table>;
    }

}
