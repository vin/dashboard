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

/**
 * @param {string} name
 * @return {?}
 */
function getServiceClassDetailFakeData(name) {
  const serviceClassDetailFakeData = {
    'booksbe': {
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
    'user-provided-service': {
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
  };
  return serviceClassDetailFakeData[name];
}

import {stateName as chromeStateName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';
import {appendDetailParamsToUrl} from 'common/resource/resourcedetail';

import {stateName as serviceClassList, stateUrl} from '../serviceclasslist/serviceclasslist_state';
import {ServiceClassDetailController} from './serviceclassdetail_controller';
import {stateName} from './serviceclassdetail_state';

/**
 * Configures states for the service details view.
 *
 * @param {!ui.router.$stateProvider} $stateProvider
 * @ngInject
 */
export default function stateConfig($stateProvider) {
  $stateProvider.state(stateName, {
    url: appendDetailParamsToUrl(stateUrl),
    parent: chromeStateName,
    resolve: {
      'serviceClass': resolveServiceClassDetail,
    },
    data: {
      [breadcrumbsConfig]: {
        'label': '{{$stateParams.objectName}}',
        'parent': serviceClassList,
      },
    },
    views: {
      '': {
        controller: ServiceClassDetailController,
        controllerAs: 'ctrl',
        templateUrl: 'serviceclassdetail/serviceclassdetail.html',
      },
    },
  });
}

/**
 * @return {?}
 * @ngInject
 */
export function resolveServiceClassDetail($stateParams) {
  return Promise.resolve(getServiceClassDetailFakeData($stateParams.objectName));
}