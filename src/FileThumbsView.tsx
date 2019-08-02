/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

type FileThumbsViewProps = {}

type FileThumbsViewState = {}

export default class FileThumbsView extends React.Component<FileThumbsViewProps, FileThumbsViewState> {

    static defaultProps = {};

    constructor(props: FileThumbsViewProps) {
        super(props);
    }

    render() {
        return <div>FileThumbsView component.</div>;
    }

}
