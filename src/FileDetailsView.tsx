/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import filesize from 'filesize';
import dateFormat from 'dateformat';
import {If, Then, Else, When} from 'react-if';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faArrowUp as AscIcon,
    faArrowDown as DescIcon,
    faEyeSlash as HiddenIcon,
} from '@fortawesome/free-solid-svg-icons';

import {getIconData} from './IconUtil';
import {ColorsDark, FileData, SortOrder, SortProperty} from './typedef';

type FileDetailsViewProps = {
    files: FileData[];
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
const readableDate = (date: Date) => dateFormat(date, 'HH:MM, mmm d, yyyy');
const readableSize = (size: number) => filesize(size, {bits: false, exponent: 1});

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
                className: 'chonky-clickable',
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

    static renderField(value: any, displayFunc: (value: any) => string) {
        if (!value) return <span className="chonky-text-subtle">—</span>;
        return displayFunc(value);
    }

    renderRows() {
        const {files} = this.props;
        const comps = new Array(files.length);
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            const iconData = getIconData(file);
            const style = {color: ColorsDark[iconData.colorCode]};
            comps[i] = <div key={file.id} className="chonky-view-details-row" tabIndex={0}>
                <div style={style}><FontAwesomeIcon icon={iconData.icon} fixedWidth/></div>
                <div className="chonky-file-name">
                    <When condition={file.isHidden}>
                        <span className="chonky-text-subtle"><FontAwesomeIcon icon={HiddenIcon} size="xs"/></span>
                        &nbsp;&nbsp;
                    </When>
                    <If condition={file.isDir}>
                        <Then>
                            {file.base}
                            <span className="chonky-text-subtle" style={{marginLeft: 2}}>/</span>
                        </Then>
                        <Else>
                            {file.name}
                            <span className="chonky-text-subtle-dark">{file.ext}</span>
                        </Else>
                    </If>
                </div>
                <div>{FileDetailsView.renderField(file.size, readableSize)}</div>
                <div>{FileDetailsView.renderField(file.modDate, readableDate)}</div>
            </div>;
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
