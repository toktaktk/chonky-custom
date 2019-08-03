/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import filesize from 'filesize';
import classnames from 'classnames';
import dateFormat from 'dateformat';
import {Else, If, Then, When} from 'react-if';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEyeSlash as HiddenIcon} from '@fortawesome/free-solid-svg-icons';

import {getIconData, LoadingIconData} from './IconUtil';
import {ColorsDark, FileData, Nullable} from './typedef';
import LoadingPlaceholder from './LoadingPlaceholder';

type FileDetailsEntryProps = {
    file: Nullable<FileData>;
}

type FileDetailsEntryState = {}

const modDateGetter = (file: FileData) => file.modDate;
const sizeGetter = (file: FileData) => file.size;
const readableDate = (date: Date) => dateFormat(date, 'HH:MM, mmm d, yyyy');
const readableSize = (size: number) => filesize(size, {bits: false, exponent: 1});

export default class FileDetailsEntry extends React.Component<FileDetailsEntryProps, FileDetailsEntryState> {

    static defaultProps = {};

    constructor(props: FileDetailsEntryProps) {
        super(props);
    }

    renderIcon() {
        const {file} = this.props;
        const iconData = file ? getIconData(file) : LoadingIconData;
        const compProps = {
            style: file ? {color: ColorsDark[iconData.colorCode]} : {},
            className: classnames({
                'chonky-file-icon': true,
                'chonky-text-subtle-light': !file,
            }),
        };
        return <div {...compProps}><FontAwesomeIcon icon={iconData.icon} fixedWidth spin={!file}/></div>;
    }

    renderFileName() {
        const {file} = this.props;
        const compProps = {
            className: 'chonky-file-name',
        };

        if (!file) return <div {...compProps}><LoadingPlaceholder/></div>;

        return <div {...compProps}>
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
        </div>;
    }

    renderField(getter: (file: FileData) => any, displayFunc: (value: any) => string) {
        const {file} = this.props;
        if (!file) return <LoadingPlaceholder/>;
        const value = getter(file);
        if (!value) return <span className="chonky-text-subtle">—</span>;
        return displayFunc(value);
    }

    render() {
        return <div className="chonky-view-details-row" tabIndex={0}>
            {this.renderIcon()}
            {this.renderFileName()}
            <div>{this.renderField(sizeGetter, readableSize)}</div>
            <div>{this.renderField(modDateGetter, readableDate)}</div>
        </div>;
    }

}
