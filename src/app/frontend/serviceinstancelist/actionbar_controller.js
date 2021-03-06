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

import {stateName} from './serviceinstancelist_state';

/**
 * @final
 */
export class ActionBarController {
  /**
   * @param {!ui.router.$state} $state
   * @param {{viewMode: string}} $stateParams
   * @ngInject
   */
  constructor($state, $stateParams) {
    /** @private {!ui.router.$state} */
    this.state_ = $state;
    /** @private {{viewMode: string}} */
    this.stateParams_ = $stateParams;
  }

  /**
   * @param {string} viewMode
   * @returns {string}
   * @export
   */
  getServiceInstanceListHref(viewMode) {
    return this.state_.href(stateName, {'viewMode': viewMode});
  }

  /**
   * @param {string} viewMode
   * @return {boolean}
   * @export
   */
  isCurrentViewMode(viewMode) {
    return viewMode === this.stateParams_.viewMode;
  }

  /**
   * @param {string} viewMode
   * @return {string}
   * @export
   */
  getIconForViewMode(viewMode) {
    switch (viewMode) {
      case 'list':
        return 'view_list';
      case 'tile':
        return 'view_module';
      case 'graph':
      default:
        return 'share';
    }
  }
}
