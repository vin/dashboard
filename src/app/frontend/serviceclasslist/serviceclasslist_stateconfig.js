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
        controller: ServiceClassListController,
        controllerAs: '$ctrl',
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
 * @param {!angular.Resource} kdServiceClassListResource
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceClassList(kdServiceClassListResource) {
  return kdServiceClassListResource.get().$promise;
}

/**
 * @param {!angular.Resource} kdServiceBrokerListResource
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveServiceBrokerList(kdServiceBrokerListResource) {
  return kdServiceBrokerListResource.get().$promise;
}

const i18n = {
  /** @type {string} @desc Label 'Catalog' that appears as a breadcrumbs on the action bar. */
  MSG_BREADCRUMBS_INSTANCE_LABEL: goog.getMsg('Catalog'),
};
