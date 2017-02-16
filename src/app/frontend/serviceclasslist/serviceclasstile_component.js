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

import {StateParams} from 'common/resource/resourcedetail';
import {stateName} from 'serviceclassdetail/serviceclassdetail_state';


/**
 * @final
 */
export class ServiceClassTileController {
  /**
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor($state) {
    /** @export {?} */
    this.serviceClass;
    /** @export {?} */
    this.serviceBroker;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
  }

  /**
   * @return {string}
   * @export
   */
  getServiceClassDetailHref() {
    return this.state_.href(
        stateName,
        new StateParams(
            this.serviceClass.metadata.namespace, this.serviceClass.metadata.name));
  }
}

/**
 *
 * @type {!angular.Component}
 */
export const serviceClassTileComponent = {
  templateUrl: 'serviceclasslist/serviceclasstile.html',
  controller: ServiceClassTileController,
  bindings: {
    /** {?} */
    'serviceClass': '<',
    /** {?} */
    'serviceBroker': '<',
  },
};
