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

export class AddCatalogDialogController {
  /**
   * @param {!angular.$resource} $resource
   * @param {!./../common/csrftoken/csrftoken_service.CsrfTokenService} kdCsrfTokenService
   * @param {!md.$dialog} $mdDialog
   * @param {!ui.router.$state} $state
   * @param {!Object} $stateParams
   * @ngInject
   */
  constructor($resource, kdCsrfTokenService, $mdDialog, $state, $stateParams) {
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
      name: '',
      url: '',
      loginRequired: false,
      login: '',
      password: '',
    };
    /** @private {!Object} */
    this.stateParams_ = $stateParams;
  }

  getPutData() {
    if (this.formData.loginRequired) {
      return {
        'name': this.formData.name,
        'url': this.formData.url,
        'login': this.formData.login,
        'password': this.formData.password,
      };
    } else {
      return {
        'apiVersion': 'catalog.k8s.io/v1alpha1',
        'kind': 'ServiceBroker',
        'metadata': {
          'name': this.formData.name,
        },
        'name': this.formData.name,
        'spec': {
          'URL': this.formData.url,
        },
      };
    }
  }

  /**
   * @export
   */
  createCatalog() {
    this.tokenPromise_
        .then((token) => {
          /** @type {!angular.Resource} */
          let resource = this.resource_(
              `api/v1alpha1/servicebroker/${this.stateParams_.namespace}`, {},
              {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
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
