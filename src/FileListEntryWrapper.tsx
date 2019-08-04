/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import filesize from 'filesize';
import dateFormat from 'dateformat';
import classnames from 'classnames';

import {ClickEvent, FileClickHandler, FileData, FileListEntryProps, Nullable} from './typedef';
import ClickableWrapper, {ClickableWrapperProps} from './ClickableWrapper';
import {getIconData, LoadingIconData} from './IconUtil';

type FileListEntryWrapperProps = {
    file: Nullable<FileData>;
    selected: boolean;
    displayIndex: number;
    render: (props: FileListEntryProps) => React.ReactElement;

    doubleClickDelay: number;
    onFileSingleClick: FileClickHandler;
    onFileDoubleClick: FileClickHandler;
}

const readableDate = (date: Date) => dateFormat(date, 'HH:MM, mmm d, yyyy');
const readableSize = (size: number) => filesize(size, {bits: false, exponent: 1});

const FileListEntryWrapper = (props: FileListEntryWrapperProps) => {
    const {file, selected, displayIndex, render, doubleClickDelay, onFileSingleClick, onFileDoubleClick} = props;

    const wrapperProps: ClickableWrapperProps = {
        wrapperTag: 'div',
        passthroughProps: {
            className: classnames({
                'chonky-file-list-entry': true,
                'chonky-selected': selected,
            }),
        },
        doubleClickDelay,
    };
    if (file) {
        if (onFileSingleClick) {
            wrapperProps.onSingleClick = (event: ClickEvent, keyboard: boolean) =>
                onFileSingleClick(file, displayIndex, event, keyboard);
        }
        if (onFileDoubleClick) {
            wrapperProps.onDoubleClick = (event: ClickEvent, keyboard: boolean) =>
                onFileDoubleClick(file, displayIndex, event, keyboard);
        }
    }

    const entryProps: FileListEntryProps = {
        displayFile: null,
        iconData: file ? getIconData(file) : LoadingIconData,
    };
    if (file) {
        entryProps.displayFile = {
            id: file.id,

            base: file.base,
            name: file.name,
            ext: file.ext,

            size: file.size ? readableSize(file.size) : null,
            modDate: file.modDate ? readableDate(file.modDate) : null,

            isDir: file.isDir,
            isHidden: !!file.isHidden,
        };
    }

    return <ClickableWrapper {...wrapperProps}>{render(entryProps)}</ClickableWrapper>;
};

export default FileListEntryWrapper;
