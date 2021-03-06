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

import {actionbarViewName, stateName as chromeStateName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';
import {appendDetailParamsToUrl} from 'common/resource/resourcedetail';
import {stateName} from 'servicebindingdetail/servicebindingdetail_state'
import {ActionBarController} from './actionbar_controller';
import {stateName as serviceInstanceDetailStateName} from 'serviceinstancedetail/serviceinstancedetail_state';
import {stateUrl as baseStateUrl} from 'serviceinstancelist/serviceinstancelist_state';

import {ServiceBindingDetailController} from './servicebindingdetail_controller';

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
      'serviceBindingResource': getServiceBindingResource,
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
      [actionbarViewName]: {
        controller: ActionBarController,
        controllerAs: '$ctrl',
        templateUrl: 'servicebindingdetail/actionbar.html',
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
 * @param {!./servicebindingdetail_state.StateParams} $stateParams
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function getServiceBindingResource($stateParams, $resource) {
  return $resource(`api/v1alpha1/servicebinding/:namespace/${$stateParams.bindingName}`);
}

/**
 * @param {!angular.Resource} serviceBindingResource
 * @param {!./servicebindingdetail_state.StateParams} $stateParams
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceBinding(serviceBindingResource, $stateParams) {
  return serviceBindingResource.get({namespace: $stateParams.objectNamespace})
      .$promise.then((serviceBinding) => {
        serviceBinding['typeMeta'] = {
          'kind': 'servicebinding',
        };
        serviceBinding['objectMeta'] = serviceBinding['metadata'];
        return serviceBinding;
      });
}
