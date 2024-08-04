/**
 * The Semi Foundation / Adapter architecture split was inspired by Material Component For Web. （https://github.com/material-components/material-components-web）
 * We re-implemented our own code based on the principle and added more functions we need according to actual needs.
 */
import React, { Component, ReactNode } from 'react';
import log from '@douyinfe/semi-foundation/utils/log';
import { DefaultAdapter } from '@douyinfe/semi-foundation/base/foundation';
import { VALIDATE_STATUS } from '@douyinfe/semi-foundation/base/constants';
import getDataAttr from '@douyinfe/semi-foundation/utils/getDataAttr';
import { ArrayElement } from './base';

const { hasOwnProperty } = Object.prototype;

export type ValidateStatus = ArrayElement<typeof VALIDATE_STATUS>;

export interface BaseProps {
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode | undefined | any
}

// eslint-disable-next-line
export default class BaseComponent<P extends BaseProps = {}, S = {}> extends Component<P, S> {
    static propTypes = {};

    static defaultProps = {};

    cache: any;
    foundation: any;

    constructor(props: P) {
        super(props);
        this.cache = {};
        this.foundation = null;
    }

    componentDidMount(): void {
        this.foundation && typeof this.foundation.init === 'function' && this.foundation.init();
    }

    componentWillUnmount(): void {
        this.foundation && typeof this.foundation.destroy === 'function' && this.foundation.destroy();
        this.cache = {};
    }

    get baseAdapter(): DefaultAdapter<P, S> {
        return {
            getContext: key => {
                if (this.context && key) {
                    return this.context[key];
                }
            },
            getContexts: () => this.context,
            getProp: key => this.props[key],
            // return all props
            getProps: () => this.props,
            getState: key => this.state[key],
            getStates: () => this.state,
            setState: (states, cb) => this.setState({ ...states }, cb),
            getCache: key => key && this.cache[key],
            getCaches: () => this.cache,
            setCache: (key, value) => key && (this.cache[key] = value),
            stopPropagation: e => {
                try {
                    e.stopPropagation();
                    e.nativeEvent && e.nativeEvent.stopImmediatePropagation();
                } catch (error) {

                }
            },
            persistEvent: (e: React.KeyboardEvent | React.MouseEvent) => {
                e && e.persist && typeof e.persist === 'function' ? e.persist() : null;
            }
        };
    }

    // eslint-disable-next-line
    isControlled = (key: any) => Boolean(key && this.props && typeof this.props === 'object' && hasOwnProperty.call(this.props, key));

    log(text: string, ...rest: any): any {
        return log(text, ...rest);
    }

    getDataAttr(props?: any) {
        return getDataAttr(props);
    }
}
