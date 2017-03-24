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

import serviceBindingListModule from 'servicebindinglist/servicebindinglist_module';
import {AddCatalogDialogController} from 'serviceclasslist/addcatalogdialog_controller';

describe('Service card controller', () => {
  /**
   * @type {!CreateServiceBindingDialogController}
   */
  let $ctrl;

  /**
   * @type {!md.$dialog}
   */
  let $mdDialog;

  /**
   * @type {!Function}
   */
  let $resource;

  /**
   * @type {string}
   */
  let token = 'abc123';

  /**
   * @type {!Promise<string>}
   */
  let tokenPromise;

  /**
   * @type {!ui.router.$state} $state
   */
  let $state;

  /**
   * @type {!/common/resource/resourcedetail.StateParams} $stateParams
   */
  let $stateParams;


  beforeEach(() => {
    angular.mock.module(serviceBindingListModule.name);

    angular.mock.inject(
        ($controller, kdCsrfTokenService, _$mdDialog_, _$state_, _$stateParams_) => {
          $resource = jasmine.createSpy('$resource');
          tokenPromise = Promise.resolve(token);
          spyOn(kdCsrfTokenService, 'getTokenForAction').and.returnValue(tokenPromise);
          $mdDialog = _$mdDialog_;
          $state = _$state_;
          $stateParams = _$stateParams_;

          $ctrl = $controller(AddCatalogDialogController, {
            $mdDialog,
            $resource,
            kdCsrfTokenService,
            $state,
            $stateParams,
          });
        });
  });

  it('createCatalog should create a resource and then call save on it and then call hide the dialog and reload the state',
     (done) => {
       let saveSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
       $resource.and.callFake(() => {
         return {
           save: saveSpy,
         };
       });
       $stateParams.namespace = 'boz-namespace';
       $ctrl.formData.name = 'foocatalog';
       $ctrl.formData.url = 'http://foocatalog:8000'
       $ctrl.formData.loginRequired = true;
       $ctrl.formData.login = 'barlogin';
       $ctrl.formData.password = 'bazpassword';
       spyOn($mdDialog, 'hide');
       spyOn($state, 'reload');
       spyOn(window, 'setTimeout').and.callFake((callback) => {
         callback();
       });

       $ctrl.createCatalog().then(() => {
         expect($resource).toHaveBeenCalledWith(
             'api/v1alpha1/servicebroker/boz-namespace', {},
             {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
         expect(saveSpy).toHaveBeenCalledWith({
           'apiVersion': 'catalog.k8s.io/v1alpha1',
           'kind': 'ServiceBroker',
           'metadata': {
             'name': 'foocatalog',
           },
           'name': 'foocatalog',
           'spec': {
             'URL': 'http://foocatalog:8000',
             'AuthUsername': 'barlogin',
             'AuthPassword': 'bazpassword',
           },
         });
         expect($mdDialog.hide).toHaveBeenCalled();
         expect($state.reload).toHaveBeenCalled();

         done();
       });

     });


  it('hide should hide the dialog', () => {
    spyOn($mdDialog, 'hide');
    $ctrl.hide();
    expect($mdDialog.hide).toHaveBeenCalled();
  });
});
