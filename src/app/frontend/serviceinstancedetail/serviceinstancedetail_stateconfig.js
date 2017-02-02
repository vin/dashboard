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
function getServiceInstanceDetailFakeData(name) {
  const serviceInstanceDetailFakeData = {
    'backend': {
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
    },
  };
  return serviceInstanceDetailFakeData[name];
}

/**
 * @param {string} name
 * @return {?}
 */
function getServiceBindingListFakeData(name) {
  let serviceBindingListFakeData = {
    'kind': 'ServiceBindingList',
    'serviceBindings': [{
      'Status': {'Conditions': [{'Message': '', 'Reason': '', 'Status': 'True', 'Type': 'Ready'}]},
      'apiVersion': 'catalog.k8s.io/v1alpha1',
      'creationTimestamp': null,
      'kind': 'ServiceBinding',
      'metadata': {
        'name': 'database',
        'namespace': 'default',
        'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/servicebindings/database',
        'uid': 'e9446fba-e415-11e6-bf38-42010a8a0138',
        'resourceVersion': '17221',
        'creationTimestamp': '2017-01-26T22:22:24Z',
      },
      'name': 'database',
      'spec': {
        'AppLabelSelector': {},
        'ConfigMapName': '',
        'OSBGUID': '09290646-2857-43a0-8b7e-7e8ce1bd2fef',
        'Parameters': null,
        'SecretName': '',
        'instanceRef': {'name': 'backend', 'namespace': 'default'},
        'serviceName': 'booksbe',
      },
    }],
    'metadata': {
      'selfLink': '/apis/catalog.k8s.io/v1alpha1/namespaces/default/servicebindings',
      'resourceVersion': '958778',
    },
    'listMeta': {
      'totalItems': 1,
    },
    'apiVersion': 'catalog.k8s.io/v1alpha1',
  };
  serviceBindingListFakeData.serviceBindings = serviceBindingListFakeData.serviceBindings.filter(
      (binding) => binding.spec.instanceRef.name === name);
  serviceBindingListFakeData.listMeta.totalItems =
      serviceBindingListFakeData.serviceBindings.length;
  return serviceBindingListFakeData;
}


import {stateName as chromeStateName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';
import {appendDetailParamsToUrl} from 'common/resource/resourcedetail';

import {stateName as serviceInstanceListStateName, stateUrl} from './../serviceinstancelist/serviceinstancelist_state';
import {ServiceInstanceDetailController} from './serviceinstancedetail_controller';
import {stateName} from './serviceinstancedetail_state';

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
      'serviceInstance': resolveServiceInstanceDetail,
      'serviceBindingList': resolveServiceBindingList,
    },
    data: {
      [breadcrumbsConfig]: {
        'label': '{{$stateParams.objectName}}',
        'parent': serviceInstanceListStateName,
      },
    },
    views: {
      '': {
        controller: ServiceInstanceDetailController,
        controllerAs: 'ctrl',
        templateUrl: 'serviceinstancedetail/serviceinstancedetail.html',
      },
    },
  });
}

/**
 * @return {?}
 * @ngInject
 */
export function resolveServiceInstanceDetail($stateParams) {
  return Promise.resolve(getServiceInstanceDetailFakeData($stateParams.objectName));
}

/**
 * @return {?}
 * @ngInject
 */
export function resolveServiceBindingList($stateParams) {
  return Promise.resolve(getServiceBindingListFakeData($stateParams.objectName));
}
