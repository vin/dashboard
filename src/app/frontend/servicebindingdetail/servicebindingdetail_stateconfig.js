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
function getServiceBindingListFakeData(name) {
  let serviceBindingListFakeData = {
    'database': {
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
    },
  };
  return serviceBindingListFakeData[name];
}


import {stateName as chromeStateName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';
import {appendDetailParamsToUrl} from 'common/resource/resourcedetail';

import {ServiceBindingDetailController} from './servicebindingdetail_controller';
import {stateUrl as baseStateUrl} from 'serviceinstancelist/serviceinstancelist_state';
import {stateName as serviceInstanceDetailStateName} from 'serviceinstancedetail/serviceinstancedetail_state';
import {stateName} from 'servicebindingdetail/servicebindingdetail_state';

/**
 * Configures states for the service binding details view.
 *
 * @param {!ui.router.$stateProvider} $stateProvider
 * @ngInject
 */
export default function stateConfig($stateProvider) {
  $stateProvider.state(stateName, {
    url: appendBindingParamsToUrl(appendDetailParamsToUrl(baseStateUrl)),
    parent: chromeStateName,
    resolve: {
      'serviceBinding': resolveServiceBinding,
    },
    data: {
      [breadcrumbsConfig]: {
        'label': '{{$stateParams.bindingName}}',
        'parent': serviceInstanceDetailStateName,
      },
    },
    views: {
      '': {
        controller: ServiceBindingDetailController,
        controllerAs: 'ctrl',
        templateUrl: 'servicebindingdetail/servicebindingdetail.html',
      },
    },
  });
}


/**
 * @param {string} baseUrl
 * @return {string}
 */
function appendBindingParamsToUrl(baseUrl) {
  return `${baseUrl}/binding/{bindingName:[^/]+}`;
}

/**
 * @return {?}
 * @ngInject
 */
export function resolveServiceBinding($stateParams) {
  return Promise.resolve(getServiceBindingListFakeData($stateParams.bindingName));
}
