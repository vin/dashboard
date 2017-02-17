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


const SERVICE_INSTANCE_LIST_FAKE_DATA = {
  'kind': 'ServiceInstanceList',
  'listMeta': {'totalItems': 2},
  'serviceInstances': [{
    'Status': {'Conditions': [{'Message': '', 'Reason': '', 'Status': 'True', 'Type': 'Ready'}]},
    'apiVersion': 'catalog.k8s.io/v1alpha1',
    'creationTimestamp': null,
    'kind': 'ServiceInstance',
    'metadata': {
      'name': 'backend',
      'namespace': 'default',
      'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/serviceinstances/backend',
      'uid': 'd4d4b081-e415-11e6-bf38-42010a8a0138',
      'resourceVersion': '17160',
      'creationTimestamp': '2017-01-26T22:21:49Z',
    },
    'name': 'backend',
    'spec': {
      'OSBCredentials': '',
      'OSBDashboardURL': '',
      'OSBGUID': 'b06e0534-ecc7-47c4-8d3a-5dd45c048e5b',
      'OSBInternalID': '',
      'OSBLastOperation': '',
      'OSBPlanID': '0CEC1E1F-CAFA-40C7-9761-491D0B164204',
      'OSBServiceID': '5F21BAA6-CF52-43DF-8797-3A7D3C1F5629',
      'OSBSpaceGUID': '',
      'OSBType': '',
      'Parameters': null,
      'planName': 'default',
      'serviceClassName': 'booksbe',
    },
  }],
  'metadata': {
    'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/serviceinstances',
    'resourceVersion': '689431',
  },
  'apiVersion': 'catalog.k8s.io/v1alpha1',
};

import {actionbarViewName, stateName as chromeStateName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';

import {ActionBarController} from './actionbar_controller';
import {ServiceInstanceListController} from './serviceinstancelist_controller';
import {stateName, stateUrl} from './serviceinstancelist_state';

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
      'serviceInstanceList': resolveServiceInstanceList,
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
        controller: ServiceInstanceListController,
        controllerAs: 'ctrl',
        templateUrl: 'serviceinstancelist/serviceinstancelist.html',
      },
      [actionbarViewName]: {
        controller: ActionBarController,
        controllerAs: '$ctrl',
        templateUrl: 'serviceinstancelist/actionbar.html',
      },
    },
  });
}


/**
 * @return {!Promise}
 * @ngInject
 */
export function resolveServiceInstanceList() {
  return Promise.resolve(SERVICE_INSTANCE_LIST_FAKE_DATA);
}

const i18n = {
  /** @type {string} @desc Label 'Instances' that appears as a breadcrumbs on the action bar. */
  MSG_BREADCRUMBS_INSTANCE_LABEL: goog.getMsg('Instances'),
};
