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

export class CreateServiceBindingDialogController {
  /**
   * @param {?} serviceInstance
   * @param {!angular.Scope} $scope
   * @param {!md.$dialog} $mdDialog
   * @param {!angular.$resource} $resource
   * @param {!./../common/csrftoken/csrftoken_service.CsrfTokenService} kdCsrfTokenService
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor(serviceInstance, $scope, $mdDialog, $resource, kdCsrfTokenService, $state) {
    this.serviceInstance = serviceInstance;
    this.scope = $scope;
    this.scope.formData = {
      bindingName: '',
      labelSelector: '',
    };
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @private {!angular.$resource} */
    this.resource_ = $resource;
    /** @private {!angular.$q.Promise} */
    this.tokenPromise_ = kdCsrfTokenService.getTokenForAction('servicebinding');
    /** @private {!ui.router.$state} */
    this.state_ = $state;
  }

  getPutData() {
    return {
      apiVersion: 'catalog.k8s.io/v1alpha1',
      kind: 'ServiceBinding',
      metadata: {
        name: this.formData.bindingName,
      },
      name: this.formData.bindingName,
      spec: {
        instanceRef: {
          name: this.serviceInstance.name,
          namespace: 'default',
        },
        serviceName: this.serviceInstance.name,
        // TODO rossholland do something with the label selector
      },
      to: this.serviceInstance.name,
    };
  }


  createBinding() {
    this.tokenPromise_
        .then((token) => {
          /** @type {!angular.Resource} */
          let resource = this.resource_(
              'api/v1alpha1/servicebinding', {},
              {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
          return resource.save(this.getPutData()).$promise;
        })
        .then(() => {
          this.state_.reload();
          this.hide();
        });
  }

  hide() {
    this.mdDialog_.hide();
  }
}
