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

import {ActionBarController} from './actionbar_controller';
import {resolveServiceClassList} from 'serviceclasslist/serviceclasslist_stateconfig';
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
      'serviceClassList': resolveServiceClassList,
    },
    params: {
      viewMode: {
        type: 'string',
        value: 'list',  // defaultValue
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
 * @param {!angular.Resource} kdServiceInstanceListResource
 * @param {!./../chrome/chrome_state.StateParams} $stateParams
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceInstanceList(kdServiceInstanceListResource, $stateParams) {
  return kdServiceInstanceListResource.get({namespace: $stateParams.namespace})
      .$promise.then((serviceInstanceList) => {
        serviceInstanceList.serviceInstances = serviceInstanceList.items;
        delete serviceInstanceList.items;
        serviceInstanceList.listMeta = {};
        serviceInstanceList.listMeta.totalItems = serviceInstanceList.serviceInstances.length;
        return serviceInstanceList;
      });
}

const i18n = {
  /** @type {string} @desc Label 'Instances' that appears as a breadcrumbs on the action bar. */
  MSG_BREADCRUMBS_INSTANCE_LABEL: goog.getMsg('Instances'),
};
