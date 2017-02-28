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

import {StateParams as ResourceStateParams} from 'common/resource/resourcedetail';
import {stateName} from 'servicebindingdetail/servicebindingdetail_state';

export class StateParams extends ResourceStateParams {
  /**
   * @param {string} objectNamespace
   * @param {string} objectName
   * @param {string} bindingName
   */
  constructor(objectNamespace, objectName, bindingName) {
    super(objectNamespace, objectName);

    this.bindingName = bindingName;
  }
}

/**
 * @final
 */
export class ServiceBindingCardController {
  /**
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor($state) {
    /** @export {?} */
    this.serviceBinding;
    /** @export {?} */
    this.serviceInstance;

    /** @private {!ui.router.$state} */
    this.state_ = $state;
  }

  isSuccess() {
    return this.serviceBinding && this.serviceBinding.Status &&
        !!this.serviceBinding.Status.Conditions.find(
            ({Type, Status}) => Type === 'Ready' && Status === 'True');
  }

  isPending() {
    return !this.isSuccess();
  }

  /**
   * @return {string}
   * @export
   */
  getServiceBindingDetailHref() {
    let stateParams = new StateParams(
        this.serviceInstance.metadata.namespace,
        this.serviceInstance.metadata.name,
        this.serviceBinding.name);
    return this.state_.href(stateName, stateParams);
  }
}

/**
 * Definition object for the component that displays service card.
 *
 * @type {!angular.Component}
 */
export const serviceBindingCardComponent = {
  templateUrl: 'servicebindinglist/servicebindingcard.html',
  controller: ServiceBindingCardController,
  bindings: {
    /** {?} */
    'serviceBinding': '<',
    /** {?} */
    'serviceInstance': '<',
  },
};
