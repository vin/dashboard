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
import networkFunctionListModule from 'networkfunctionlist/networkfunctionlist_module';

import stateConfig from './servicebindingdetail_stateconfig';
import {serviceBindingInfoComponent} from './servicebindinginfo_component';


/**
 * Angular module for the Instances list view.
 *
 * The view shows Instances running in the cluster and allows to manage them.
 */
export default angular
    .module(
        'kubernetesDashboard.serviceBindingDetail',
        [
          'ngMaterial',
          'ngResource',
          'ui.router',
          filtersModule.name,
          componentsModule.name,
          chromeModule.name,
          networkFunctionListModule.name,
        ])
    .config(stateConfig)
    .component('kdServiceBindingInfo', serviceBindingInfoComponent);
