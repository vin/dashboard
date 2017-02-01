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

/**
 * @final
 */
export class ServiceInstanceCardController {
  /**
   * @ngInject
   */
  constructor() {
    /** @export {?} */
    this.serviceInstance;
  }

  isSuccess() {
    return !!this.serviceInstance.Status.Conditions.find(
        ({Type, Status}) => Type === 'Ready' && Status === 'True');
  }

  isPending() {
    return !this.isSuccess();
  }
}

/**
 * Definition object for the component that displays service card.
 *
 * @type {!angular.Component}
 */
export const serviceInstanceCardComponent = {
  templateUrl: 'serviceinstancelist/serviceinstancecard.html',
  controller: ServiceInstanceCardController,
  bindings: {
    /** {?} */
    'serviceInstance': '<',
  },
};
