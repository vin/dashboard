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

import {serviceClassCardComponent} from './serviceclasscard_component';
import {serviceClassCardColumnComponent} from './serviceclasscardcolumn_component';
import {serviceClassCardColumnMultiLineComponent} from './serviceclasscardcolumnmultiline_component';
import {serviceClassCardColumnsComponent} from './serviceclasscardcolumns_component';
import {serviceClassCardListComponent} from './serviceclasscardlist_component';
import {serviceClassCardListColumnHeaderComponent} from './serviceclasscardlistcolumnheader_component';
import {serviceClassCardListColumnHeadersComponent} from './serviceclasscardlistcolumnheaders_component';
import {serviceClassCardListHeaderComponent} from './serviceclasscardlistheader_component';
import stateConfig from './serviceclasslist_stateconfig';
import {serviceClassListCatalogSelectorComponent} from './serviceclasslistcatalogselector_component';
import {serviceClassListSearchInputComponent} from './serviceclasslistsearchinput_component';
import {serviceClassTileComponent} from './serviceclasstile_component';
import {serviceClassTilesComponent} from './serviceclasstiles_component';

/**
 * Angular module for the Catalog list view.
 *
 * The view shows Service Classes running in the cluster and allows to manage them.
 */
export default angular
    .module(
        'kubernetesDashboard.serviceClassList',
        [
          'ngMaterial',
          'ngResource',
          'ui.router',
          componentsModule.name,
          chromeModule.name,
        ])
    .config(stateConfig)
    .component('kdServiceClassCard', serviceClassCardComponent)
    .component('kdServiceClassCardColumn', serviceClassCardColumnComponent)
    .component('kdServiceClassCardColumnMultiLine', serviceClassCardColumnMultiLineComponent)
    .component('kdServiceClassCardColumns', serviceClassCardColumnsComponent)
    .component('kdServiceClassCardList', serviceClassCardListComponent)
    .component('kdServiceClassCardListColumnHeader', serviceClassCardListColumnHeaderComponent)
    .component('kdServiceClassCardListColumnHeaders', serviceClassCardListColumnHeadersComponent)
    .component('kdServiceClassCardListHeader', serviceClassCardListHeaderComponent)
    .component('kdServiceClassListCatalogSelector', serviceClassListCatalogSelectorComponent)
    .component('kdServiceClassListSearchInput', serviceClassListSearchInputComponent)
    .component('kdServiceClassTile', serviceClassTileComponent)
    .component('kdServiceClassTiles', serviceClassTilesComponent)
    .factory('kdServiceBrokerListResource', serviceBrokerListResource)
    .factory('kdServiceClassListResource', serviceClassListResource);

/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
function serviceBrokerListResource($resource) {
  return $resource('api/v1alpha1/servicebroker/:namespace');
}

/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
function serviceClassListResource($resource) {
  return $resource('api/v1alpha1/serviceclass/:namespace');
}
