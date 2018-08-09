// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import type { Node } from 'react';
import TopBarContainer from './TopBarContainer';
import SidebarLayout from '../components/layout/SidebarLayout';
import type { StoresMap } from '../stores/index';
import type { ActionsMap } from '../actions/index';

export type MainLayoutProps = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  children: Node,
  topbar: ?any
};

@inject('stores', 'actions') @observer
export default class MainLayout extends Component<MainLayoutProps> {
  static defaultProps = {
    actions: null,
    stores: null,
    children: null,
    topbar: null,
    onClose: () => {}
  };

  render() {
    const { actions, stores, topbar } = this.props;
    const topbarComponent = topbar || (<TopBarContainer actions={actions} stores={stores} />);
    return (
      <SidebarLayout
        topbar={topbarComponent}
        notification={<div />}
        contentDialogs={[]}
      >
        {this.props.children}
      </SidebarLayout>
    );
  }
}
