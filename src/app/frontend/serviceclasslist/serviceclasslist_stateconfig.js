// Copyright 2015 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const SERVICE_CLASS_LIST_FAKE_DATA = {
  'kind': 'ServiceClassList',
  'items': [
    {
      'Bindable': true,
      'BrokerName': 'k8s',
      'OSBDashboardOAuth2ClientID': '',
      'OSBDashboardRedirectURI': '',
      'OSBDashboardSecret': '',
      'OSBGUID': '5F21BAA6-CF52-43DF-8797-3A7D3C1F5629',
      'OSBMaxDBPerNode': '',
      'OSBMetadata': null,
      'OSBRequires': null,
      'OSBTags': null,
      'PlanUpdatable': false,
      'Plans': [{
        'Name': 'default',
        'OSBFree': false,
        'OSBGUID': '0CEC1E1F-CAFA-40C7-9761-491D0B164204',
        'OSBMetadata': null,
      }],
      'apiVersion': 'catalog.k8s.io/v1alpha1',
      'creationTimestamp': null,
      'kind': 'ServiceClass',
      'metadata': {
        'name': 'booksbe',
        'namespace': 'default',
        'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/serviceclasses/booksbe',
        'uid': 'c4bd388c-e415-11e6-bf38-42010a8a0138',
        'resourceVersion': '17097',
        'creationTimestamp': '2017-01-26T22:21:22Z',
      },
      'name': 'booksbe',
    },
    {
      'Bindable': false,
      'BrokerName': 'ups',
      'OSBDashboardOAuth2ClientID': '',
      'OSBDashboardRedirectURI': '',
      'OSBDashboardSecret': '',
      'OSBGUID': '4F6E6CF6-FFDD-425F-A2C7-3C9258AD2468',
      'OSBMaxDBPerNode': '',
      'OSBMetadata': null,
      'OSBRequires': null,
      'OSBTags': null,
      'PlanUpdatable': false,
      'Plans': [{
        'Name': 'default',
        'OSBFree': true,
        'OSBGUID': '86064792-7ea2-467b-af93-ac9694d96d52',
        'OSBMetadata': null,
      }],
      'apiVersion': 'catalog.k8s.io/v1alpha1',
      'creationTimestamp': null,
      'kind': 'ServiceClass',
      'metadata': {
        'name': 'user-provided-service',
        'namespace': 'default',
        'selfLink':
            '/apis/catalog.k8s.io/v1alpha1/namespaces/default/serviceclasses/user-provided-service',
        'uid': 'c4bec2e8-e415-11e6-bf38-42010a8a0138',
        'resourceVersion': '17098',
        'creationTimestamp': '2017-01-26T22:21:22Z',
      },
      'name': 'user-provided-service',
    },
  ],
  'metadata': {
    'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/serviceclasses',
    'resourceVersion': '702656',
  },
  'apiVersion': 'catalog.k8s.io/v1alpha1',
};


const SERVICE_BROKER_LIST_FAKE_DATA = {
  'kind': 'ServiceBrokerList',
  'items': [
    {
      'apiVersion': 'catalog.k8s.io/v1alpha1',
      'kind': 'ServiceBroker',
      'metadata': {
        'name': 'k8s',
        'namespace': 'default',
        'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/servicebrokers/k8s',
        'uid': 'c4a83335-e415-11e6-bf38-42010a8a0138',
        'resourceVersion': '17095',
        'creationTimestamp': '2017-01-26T22:21:22Z',
      },
      'name': 'k8s',
      'spec': {'URL': 'http://k8s-broker:8000'},
    },
    {
      'apiVersion': 'catalog.k8s.io/v1alpha1',
      'kind': 'ServiceBroker',
      'metadata': {
        'name': 'ups',
        'namespace': 'default',
        'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/servicebrokers/ups',
        'uid': 'c4ac87a4-e415-11e6-bf38-42010a8a0138',
        'resourceVersion': '17096',
        'creationTimestamp': '2017-01-26T22:21:22Z',
      },
      'name': 'ups',
      'spec': {'URL': 'http://ups-broker:8000'},
    },
  ],
  'metadata': {
    'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/servicebrokers',
    'resourceVersion': '1663596',
  },
  'apiVersion': 'catalog.k8s.io/v1alpha1',
};

import {actionbarViewName, stateName as chromeStateName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';

import {ActionBarController} from './actionbar_controller';
import {ServiceClassListController} from './serviceclasslist_controller';
import {stateName, stateUrl} from './serviceclasslist_state';

/**
 * Configures states for the service list view.
 *
 * @param {!ui.router.$stateProvider} $stateProvider
 * @ngInject
 */
export default function stateConfig($stateProvider) {
  $stateProvider.state(stateName, {
    url: `${stateUrl}?viewMode`,
    parent: chromeStateName,
    resolve: {
      'serviceClassList': resolveServiceClassList,
      'serviceBrokerList': resolveServiceBrokerList,
    },
    params: {
      viewMode: {
        type: 'string',
        value: 'list', //defaultValue
      },
    },
    data: {
      [breadcrumbsConfig]: {
        'label': i18n.MSG_BREADCRUMBS_INSTANCE_LABEL,
      },
    },
    views: {
      '': {
        controller: ServiceClassListController,
        controllerAs: 'ctrl',
        templateUrl: 'serviceclasslist/serviceclasslist.html',
      },
      [actionbarViewName]: {
        controller: ActionBarController,
        controllerAs: '$ctrl',
        templateUrl: 'serviceclasslist/actionbar.html',
      },
    },
  });
}


/**
 * @return {!Promise}
 * @ngInject
 */
export function resolveServiceClassList() {
  return Promise.resolve(SERVICE_CLASS_LIST_FAKE_DATA);
}

/**
 * @return {!Promise}
 * @ngInject
 */
export function resolveServiceBrokerList() {
  return Promise.resolve(SERVICE_BROKER_LIST_FAKE_DATA);
}

const i18n = {
  /** @type {string} @desc Label 'Catalog' that appears as a breadcrumbs on the action bar. */
  MSG_BREADCRUMBS_INSTANCE_LABEL: goog.getMsg('Catalog'),
};
