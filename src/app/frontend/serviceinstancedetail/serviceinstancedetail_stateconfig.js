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
      'serviceInstanceDetailResource': getServiceInstanceDetailResource,
      'serviceInstance': resolveServiceInstanceDetail,
      'serviceBindingListResource': getServiceBindingListResource,
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
 * @param {!./../common/resource/resourcedetail.StateParams} $stateParams
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function getServiceInstanceDetailResource($stateParams, $resource) {
  return $resource(`api/v1alpha1/serviceinstance/:namespace/${$stateParams.objectName}`);
}

/**
 * @param {!angular.Resource} serviceInstanceDetailResource
 * @param {!./../common/resource/resourcedetail.StateParams} $stateParams
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceInstanceDetail(serviceInstanceDetailResource, $stateParams) {
  return serviceInstanceDetailResource.get({namespace: $stateParams.namespace}).$promise;
}


/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function getServiceBindingListResource($resource) {
  return $resource(`api/v1alpha1/servicebinding/:namespace`);
}

/**
 * @param {!angular.Resource} serviceBindingListResource
 * @param {!./../common/resource/resourcedetail.StateParams} $stateParams
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceBindingList(serviceBindingListResource, $stateParams) {
  return serviceBindingListResource.get({namespace: $stateParams.namespace})
      .$promise.then((serviceBindingList) => {
        serviceBindingList.serviceBindings = serviceBindingList.items.filter(
            (binding) => binding.spec.instanceRef.name === $stateParams.objectName);
        delete serviceBindingList.items;
        serviceBindingList.listMeta = {
          totalItems: serviceBindingList.serviceBindings.length,
        };
        return serviceBindingList;
      });
}
