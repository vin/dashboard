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

export class AddNetworkFunctionDialogController {
  /**
   * @param {?} serviceBinding
   * @param {!angular.$resource} $resource
   * @param {!./../common/csrftoken/csrftoken_service.CsrfTokenService} kdCsrfTokenService
   * @param {!md.$dialog} $mdDialog
   * @param {!ui.router.$state} $state
   * @param {!Object} $stateParams
   * @ngInject
   */
  constructor(serviceBinding, $resource, kdCsrfTokenService, $mdDialog, $state, $stateParams) {
    /** @export {?} */
    this.serviceBinding = serviceBinding;
    /** @private {!angular.$resource} */
    this.resource_ = $resource;
    /** @private {!angular.$q.Promise} */
    this.tokenPromise_ = kdCsrfTokenService.getTokenForAction('servicebroker');
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
    /** @export {?} */
    this.formData = {
      'kind': 'quota',
      'params': '',
    };
    /** @private {!Object} */
    this.stateParams_ = $stateParams;
  }

  getPutData() {
    let putData = angular.copy(this.serviceBinding);
    delete putData.typeMeta;
    delete putData.objectMeta;

    if(!putData['istio_config']){
      putData['istio_config'] = {};
    }
    if(!putData['istio_config']['rules']){
      putData['istio_config']['rules'] = [];
    }

    putData['istio_config']['rules']push(
        {'kind': this.formData['kind'], 'params': JSON.parse(this.formData['params'])});

    return putData;
  }

  /**
   * @export
   */
  createNetworkFunction() {
    this.tokenPromise_
        .then((token) => {
          let namespace = this.serviceBinding.metadata.namespace;
          /** @type {!angular.Resource} */
          let resource = this.resource_(
              `api/v1alpha1/servicebinding/${namespace}/${this.serviceBinding.name}`,
              {}, {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
          return resource.save(this.getPutData()).$promise;
        })
        .then(() => {
          this.state_.reload();
          this.hide();
        })
        .catch(() => {
          // TODO rossholland: better error handling
          this.hide();
        });
  }

  /**
   * @export
   */
  hide() {
    this.mdDialog_.hide();
  }
}
