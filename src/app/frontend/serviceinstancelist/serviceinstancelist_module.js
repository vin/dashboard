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

import chromeModule from 'chrome/chrome_module';
import componentsModule from 'common/components/components_module';
import filtersModule from 'common/filters/filters_module';

import {serviceInstanceCardComponent} from './serviceinstancecard_component';
import {serviceInstanceCardListComponent} from './serviceinstancecardlist_component';
import stateConfig from './serviceinstancelist_stateconfig';
import {serviceInstanceListFilterComponent} from './serviceinstancelistfilter_component';
import {serviceInstanceTileComponent} from './serviceinstancetile_component';
import {serviceInstanceTilesComponent} from './serviceinstancetiles_component';


/**
 * Angular module for the Instances list view.
 *
 * The view shows Instances running in the cluster and allows to manage them.
 */
export default angular
    .module(
        'kubernetesDashboard.serviceInstanceList',
        [
          'ngMaterial',
          'ngResource',
          'ui.router',
          filtersModule.name,
          componentsModule.name,
          chromeModule.name,
        ])
    .config(stateConfig)
    .component('kdServiceInstanceCardList', serviceInstanceCardListComponent)
    .component('kdServiceInstanceCard', serviceInstanceCardComponent)
    .component('kdServiceInstanceListFilter', serviceInstanceListFilterComponent)
    .component('kdServiceInstanceTile', serviceInstanceTileComponent)
    .component('kdServiceInstanceTiles', serviceInstanceTilesComponent)
    .factory('kdServiceInstanceListResource', serviceInstanceListResource);

/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
function serviceInstanceListResource($resource) {
  return $resource('api/v1alpha1/serviceinstance');
}
