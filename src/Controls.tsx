/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import {
    faTh,
    faList,
    faCircle,
    faUpload,
    faThLarge,
    faFolderPlus,
    faCheckCircle,
    faArrowLeft as iconPathBack,
    faArrowRight as iconPathForward,
} from '@fortawesome/free-solid-svg-icons';

import Dropdown from './Dropdown';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import {FolderView, Option, Options} from './typedef';
import DropdownButton from './DropdownButton';

type ControlsProps = {
    view: FolderView;
    setView: (view: FolderView) => void;

    options: Options;
    setOption: (name: Option, value: boolean) => void;
};

type ControlsState = {};

export default class Controls extends React.Component<ControlsProps, ControlsState> {

    static defaultProps = {};

    static viewControls = [
        [faList, FolderView.Details, 'Details'],
        [faTh, FolderView.SmallThumbs, 'Small thumbnails'],
        [faThLarge, FolderView.LargeThumbs, 'Large thumbnails'],
    ];

    static dropdownButtons = [
        [Option.ShowHidden, 'Show hidden files'],
        [Option.FoldersFirst, 'Show folders first'],
        [Option.ConfirmDeletions, 'Confirm before deleting'],
    ];

    constructor(props: ControlsProps) {
        super(props);
    }

    renderViewControls() {
        const {view, setView} = this.props;
        let i = 0;
        const comps = new Array(Controls.viewControls.length);
        for (const [icon, buttonView, tooltip] of Controls.viewControls) {
            comps[i++] = <IconButton key={`control-${buttonView}`} icon={icon} active={view === buttonView}
                                     tooltip={tooltip as string} onClick={() => setView(buttonView as FolderView)}/>;
        }
        return comps;
    }

    renderDropdownButtons() {
        const {options, setOption} = this.props;
        const comps = new Array(Controls.dropdownButtons.length);
        let i = 0;
        for (const [optionName, text] of Controls.dropdownButtons) {
            const value = options[optionName];
            comps[i++] = <DropdownButton key={`option-${optionName}`}
                                         icon={faCheckCircle} altIcon={faCircle} active={options[optionName]}
                                         text={text} onClick={() => setOption(optionName as Option, !value)}/>;
        }
        return comps;
    }

    render() {
        const {} = this.props;

        return <div className="chonky-controls">
            <div className="chonky-side chonky-side-left">
                <ButtonGroup>
                    <IconButton icon={iconPathBack}/>
                    <IconButton icon={iconPathForward}/>
                </ButtonGroup>
            </div>
            <div className="chonky-side chonky-side-right">
                <IconButton icon={faFolderPlus} tooltip="Create folder"/>
                <IconButton icon={faUpload} tooltip="Upload files"/>
                <ButtonGroup>{this.renderViewControls()}</ButtonGroup>
                <Dropdown title="Options">{this.renderDropdownButtons()}</Dropdown>
            </div>
        </div>;
    }

}
