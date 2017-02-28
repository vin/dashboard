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

import {stateName as serviceInstanceListStateName} from 'serviceinstancelist/serviceinstancelist_state';

/**
 * @final
 */
export class ServiceClassDetailCreateFormController {
  /**
   * @param {!angular.$resource} $resource
   * @param {!./../common/csrftoken/csrftoken_service.CsrfTokenService} kdCsrfTokenService
   * @param {!ui.router.$state} $state
   * @param {!./../common/resource/resourcedetail.StateParams} $stateParams
   * @ngInject
   */
  constructor($resource, kdCsrfTokenService, $state, $stateParams) {
    /** @export {?} */
    this.serviceClass;
    /** @export {Function} */
    this.onCancel;
    /** @export {?} */
    this.formData = {
      name: '',
      plan: '',
      parameters: '',
      labels: [{
        key: '',
        value: '',
      }],
    };
    /** @private {!angular.$resource} */
    this.resource_ = $resource;
    /** @private {!angular.$q.Promise} */
    this.tokenPromise_ = kdCsrfTokenService.getTokenForAction('serviceinstance');
    /** @private {!ui.router.$state} */
    this.state_ = $state;
    /** @private {!./../common/resource/resourcedetail.StateParams} */
    this.stateParams_ = $stateParams;
  }

  $onInit() {
    this.formData.plan = this.serviceClass.Plans[0].Name;
  }

  getPutData() {
    let putData = {
      "kind": "ServiceInstance",
      "metadata": {
        "name": this.formData.name,
      },
      "name": this.formData.name,
      "spec": {
        "serviceClassName": this.serviceClass.name,
        "planName": this.formData.plan,
      },
      "space_guid": "default",
    };

    if(this.formData.parameters.trim()){
      putData.parameters = JSON.parse(this.formData.parameters);
    }
    return putData;
  }

  createInstance() {
    this.tokenPromise_
        .then((token) => {
          /** @type {!angular.Resource} */
          let resource = this.resource_(
              `api/v1alpha1/serviceinstance/${this.stateParams_.namespace}`, {},
              {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
          return resource.save(this.getPutData()).$promise;
        })
        .then(() => {
          this.state_.go(serviceInstanceListStateName);
        });
  }
}

/**
 *
 * @type {!angular.Component}
 */
export const serviceClassDetailCreateFormComponent = {
  templateUrl: 'serviceclassdetail/serviceclassdetailcreateform.html',
  controller: ServiceClassDetailCreateFormController,
  bindings: {
    /** {?} */
    'serviceClass': '<',
    /** {?} */
    'onCancel': '&',
  },
};
