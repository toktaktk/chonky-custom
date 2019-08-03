/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

type LoadingPlaceholderProps = {
    maxWidth?: string | number,
}

const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * Math.floor(max - min)) + min;
};

const randomNoise = (noise: number) => randomInt(-noise, +noise);

const LoadingPlaceholder = (props: LoadingPlaceholderProps) => {
    const compProps = {
        className: 'chonky-loading-placeholder',
        style: {
            maxWidth: props.maxWidth ? props.maxWidth : `${40 + randomNoise(10)}%`,
        },
    };
    return <div {...compProps}>&nbsp;</div>;
};

export default LoadingPlaceholder;
