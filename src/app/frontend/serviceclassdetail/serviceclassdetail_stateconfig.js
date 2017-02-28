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
      'serviceClassDetailResource': getServiceClassDetailResource,
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
 * @param {!./../common/resource/resourcedetail.StateParams} $stateParams
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource<!backendApi.ServiceDetail>}
 * @ngInject
 */
export function getServiceClassDetailResource($stateParams, $resource) {
  return $resource(`api/v1alpha1/serviceclass/:namespace/${$stateParams.objectName}`);
}


/**
 * @param {!angular.Resource} serviceClassDetailResource
 * @param {!./../common/resource/resourcedetail.StateParams} $stateParams
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceClassDetail(serviceClassDetailResource, $stateParams) {
  return serviceClassDetailResource.get({namespace: $stateParams.namespace}).$promise;
}
