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
    /** @export
     * {{
     *  name: string,
     *  url: string,
     *  loginRequired: boolean,
     *  login: string,
     *  password: string,
     * }}
     */
    this.formData = {
      'name': '',
      'url': '',
      'loginRequired': false,
      'login': '',
      'password': '',
    };
    /** @export {boolean} */
    this.isCreatingCatalog = false;
    /** @private {!Object} */
    this.stateParams_ = $stateParams;
  }

  getPutData() {
    let result = {
      'apiVersion': 'catalog.k8s.io/v1alpha1',
      'kind': 'ServiceBroker',
      'metadata': {
        'name': this.formData['name'],
      },
      'name': this.formData['name'],
      'spec': {
        'URL': this.formData['url'],
      },
    };
    if (this.formData['loginRequired']) {
      Object.assign(result['spec'], {
        'AuthUsername': this.formData['login'],
        'AuthPassword': this.formData['password'],
      });
    }
    return result;
  }

  /**
   * @export
   * @return {!Promise}
   */
  createCatalog() {
    return this.tokenPromise_
        .then((token) => {
          /** @type {!angular.Resource} */
          let resource = this.resource_(
              `api/v1alpha1/servicebroker/${this.stateParams_.namespace}`, {},
              {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
          return resource.save(this.getPutData()).$promise;
        })
        .then(() => {
          this.isCreatingCatalog = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              this.state_.reload();
              this.hide();
              resolve();
            }, 5000);
          });
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
