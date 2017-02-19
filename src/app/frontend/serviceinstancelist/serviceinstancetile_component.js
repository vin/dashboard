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
 * @final
 */
export class ServiceInstanceTileController {
  /**
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor($state) {
    /** @export {?} */
    this.serviceInstance;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
  }

  isSuccess() {
    return !!this.serviceInstance.Status.Conditions.find(
        ({Type, Status}) => Type === 'Ready' && Status === 'True');
  }

  isPending() {
    return !this.isSuccess();
  }

  /**
   * @return {string}
   * @export
   */
  getServiceInstanceDetailHref() {
    return this.state_.href(
        stateName,
        new StateParams(
            this.serviceInstance.metadata.namespace, this.serviceInstance.metadata.name));
  }
}

/**
 *
 * @type {!angular.Component}
 */
export const serviceInstanceTileComponent = {
  templateUrl: 'serviceinstancelist/serviceinstancetile.html',
  controller: ServiceInstanceTileController,
  bindings: {
    /** {?} */
    'serviceInstance': '<',
  },
};
