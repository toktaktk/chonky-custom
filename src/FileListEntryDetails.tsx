/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import LoadingPlaceholder from './LoadingPlaceholder';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {ColorsDark, DisplayFileData, FileListEntryProps, Nullable} from './typedef';
import {Else, If, Then, When} from 'react-if';
import {faEyeSlash as HiddenIcon} from '@fortawesome/free-solid-svg-icons';

const renderFilename = (displayFile: Nullable<DisplayFileData>) => {
    if (!displayFile) return <LoadingPlaceholder/>;
    return <React.Fragment>
        <When condition={displayFile.isHidden}>
            <span className="chonky-text-subtle"><FontAwesomeIcon icon={HiddenIcon} size="xs"/></span>
            &nbsp;&nbsp;
        </When>
        <If condition={displayFile.isDir}>
            <Then>
                {displayFile.base}
                <span className="chonky-text-subtle" style={{marginLeft: 2}}>/</span>
            </Then>
            <Else>
                {displayFile.name}
                <span className="chonky-text-subtle-dark">{displayFile.ext}</span>
            </Else>
        </If>
    </React.Fragment>;
};

const modDateGetter = (displayFile: DisplayFileData) => displayFile.modDate;
const sizeGetter = (displayFile: DisplayFileData) => displayFile.size;
const renderField = (displayFile: Nullable<DisplayFileData>, getter: (displayFile: DisplayFileData) => any) => {
    if (!displayFile) return <LoadingPlaceholder/>;
    const value = getter(displayFile);
    if (!value) return <span className="chonky-text-subtle">—</span>;
    return value;
};

const FileListEntryDetails = (props: FileListEntryProps) => {
    const {displayFile, iconData} = props;
    const loading = !displayFile;

    const iconProps = {
        style: loading ? {} : {color: ColorsDark[iconData.colorCode]},
        className: classnames({
            'chonky-file-list-entry-icon': true,
            'chonky-text-subtle-light': loading,
        }),
    };

    return <React.Fragment>
        <div {...iconProps}><FontAwesomeIcon icon={iconData.icon} fixedWidth spin={loading}/></div>
        <div className="chonky-file-list-entry-name">{renderFilename(displayFile)}</div>
        <div className="chonky-file-list-entry-size">{renderField(displayFile, sizeGetter)}</div>
        <div className="chonky-file-list-entry-date">{renderField(displayFile, modDateGetter)}</div>
    </React.Fragment>;
};

export default FileListEntryDetails;
