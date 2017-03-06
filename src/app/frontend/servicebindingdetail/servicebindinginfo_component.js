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
import {stateName} from 'serviceinstancedetail/serviceinstancedetail_state';

/**
 * Binding info controller.
 * @final
 */
class ServiceBindingInfoController {
  /**
   * @param {!ui.router.$state} $state
   * @param {StateParams} $stateParams
   * @ngInject
   */
  constructor($state, $stateParams) {
    /** @export {?} Initialized from a binding. */
    this.serviceBinding;

    /** @private {!ui.router.$state} */
    this.state_ = $state;

    /** @private {!StateParams} */
    this.stateParams_ = $stateParams;
  }

  /**
   * @return {string}
   * @export
   */
  getServiceInstanceDetailHref() {
    return this.state_.href(
        stateName,
        new StateParams(this.stateParams_.objectNamespace, this.stateParams_.objectName));
  }
}

/**
 * Definition object for the component that displays binding info.
 *
 * @return {!angular.Directive}
 */
export const serviceBindingInfoComponent = {
  templateUrl: 'servicebindingdetail/servicebindinginfo.html',
  bindings: {
    /** {?} */
    'serviceBinding': '<',
  },
  controller: ServiceBindingInfoController,
};
