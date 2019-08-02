/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

type PageTitleProps = {}

type PageTitleState = {}

export default class PageTitle extends React.Component<PageTitleProps, PageTitleState> {

    render() {
        return <h1>
            <span style={{verticalAlign: 'middle'}}>Chonky: A File Browser Component</span>
            <div style={{display: 'inline-block', marginLeft: 20, verticalAlign: 'middle'}}>
                <iframe
                    title="GitHub star count"
                    src="https://ghbtns.com/github-btn.html?user=TimboKZ&repo=Chonky&type=star&count=true&size=large"
                    frameBorder="0" scrolling="0" width="160px" height="30px"/>
            </div>
        </h1>;
    }

}
