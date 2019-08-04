/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import filesize from 'filesize';
import dateFormat from 'dateformat';
import classnames from 'classnames';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
    ClickEvent,
    ColorsDark,
    ColorsLight,
    FileClickHandler,
    FileData,
    FolderView,
    FolderViewSizeMap,
    Nullable,
} from './typedef';
import LoadingPlaceholder from './LoadingPlaceholder';
import {getIconData, LoadingIconData} from './IconUtil';
import ClickableWrapper, {ClickableWrapperProps} from './ClickableWrapper';
import {Else, If, Then, When} from 'react-if';
import {faEyeSlash as HiddenIcon} from '@fortawesome/free-solid-svg-icons';

type FileListEntryWrapperProps = {
    file: Nullable<FileData>;
    selected: boolean;
    displayIndex: number;
    view: FolderView,

    doubleClickDelay: number;
    onFileSingleClick: FileClickHandler;
    onFileDoubleClick: FileClickHandler;

}

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const relativeDate = (date: Date) => timeAgo.format(date);
const readableDate = (date: Date) => dateFormat(date, 'HH:MM, mmm d, yyyy');
const readableSize = (size: number) => filesize(size, {bits: false, exponent: 1});

const modDateGetter = (file: FileData) => file.modDate ? relativeDate(file.modDate) : null;
const sizeGetter = (file: FileData) => file.size ? readableSize(file.size) : null;

const renderFilename = (file: Nullable<FileData>) => {
    if (!file) return <LoadingPlaceholder/>;
    return <React.Fragment>
        <When condition={file.isHidden === true}>
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
    </React.Fragment>;
};
const renderField = (file: Nullable<FileData>, getter: (file: FileData) => string | null) => {
    if (!file) return <LoadingPlaceholder/>;
    const value = getter(file);
    if (!value) return <span className="chonky-text-subtle">—</span>;
    return value;
};

const SizeMap: FolderViewSizeMap = {
    [FolderView.SmallThumbs]: {width: 250, height: 180},
    [FolderView.LargeThumbs]: {width: 400, height: 300},
};

const FileListEntry = (props: FileListEntryWrapperProps) => {
    const {file, selected, displayIndex, view, doubleClickDelay, onFileSingleClick, onFileDoubleClick} = props;

    const wrapperProps: ClickableWrapperProps = {
        wrapperTag: 'div',
        passthroughProps: {
            style: {...SizeMap[view]},
            className: classnames({
                'chonky-file-list-entry': true,
                'chonky-selected': selected,
            }),
        },
        doubleClickDelay,
    };
    if (file) {
        if (onFileSingleClick) wrapperProps.onSingleClick =
            (event: ClickEvent, keyboard: boolean) => onFileSingleClick(file, displayIndex, event, keyboard);
        if (onFileDoubleClick) wrapperProps.onDoubleClick =
            (event: ClickEvent, keyboard: boolean) => onFileDoubleClick(file, displayIndex, event, keyboard);
    }

    const loading = !file;
    const iconData = file ? getIconData(file) : LoadingIconData;

    const iconProps = {
        style: loading ? {} : {color: ColorsDark[iconData.colorCode]},
        className: classnames({
            'chonky-file-list-entry-icon': true,
            'chonky-text-subtle': loading && view !== FolderView.Details,
            'chonky-text-subtle-light': loading && view === FolderView.Details,
        }),
    };
    const iconComp = <FontAwesomeIcon icon={iconData.icon} fixedWidth spin={loading}/>;

    const innerDateProps: any = {
        className: classnames({
            'chonky-tooltip': file && file.modDate,
        }),
    };
    if (file && file.modDate) innerDateProps['data-tooltip'] = readableDate(file.modDate);

    return <ClickableWrapper {...wrapperProps}>
        <If condition={view === FolderView.Details}>
            <Then>
                <div {...iconProps}>{iconComp}</div>
                <div className="chonky-file-list-entry-name">{renderFilename(file)}</div>
                <div className="chonky-file-list-entry-size">{renderField(file, sizeGetter)}</div>
                <div className="chonky-file-list-entry-date">
                    <span {...innerDateProps}>{renderField(file, modDateGetter)}</span>
                </div>
            </Then>
            <Else>
                <div className="chonky-file-list-entry-content"
                     style={{backgroundColor: ColorsLight[iconData.colorCode]}}>
                    <div className="chonky-file-list-entry-thumb">
                        <div className="chonky-file-list-entry-background"/>
                        <div className="chonky-file-list-entry-image"
                        style={{}}/>
                        <div {...iconProps}>{iconComp}</div>
                    </div>
                    <div className="chonky-file-list-entry-description">
                        <div className="chonky-file-list-entry-name">{renderFilename(file)}</div>
                        <div className="chonky-file-list-entry-group">
                            <div className="chonky-file-list-entry-size">{renderField(file, sizeGetter)}</div>
                            <div className="chonky-file-list-entry-date">
                                <span {...innerDateProps}>{renderField(file, modDateGetter)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Else>
        </If>
    </ClickableWrapper>;
};

export default FileListEntry;
