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
 * Service info controller.
 * @final
 */
class ServiceInstanceInfoController {

  /**
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor($state) {
    /** @export {!backendApi.ServiceInstance} Initialized from a binding. */
    this.serviceInstance;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
  }

  /**
   *
   * @return {string}
   * @export
   */
  getServiceClassDetailHref() {
    return this.state_.href(
      stateName,
      new StateParams(this.serviceInstance['metadata']['namespace'], this.serviceInstance['spec']['serviceClassName']));
  }
}

/**
 * Definition object for the component that displays service info.
 *
 * @return {!angular.Directive}
 */
export const serviceInstanceInfoComponent = {
  templateUrl: 'serviceinstancedetail/serviceinstanceinfo.html',
  bindings: {
    /** {!backendApi.ServiceInstance} */
    'serviceInstance': '<',
  },
  controller: ServiceInstanceInfoController,
};
