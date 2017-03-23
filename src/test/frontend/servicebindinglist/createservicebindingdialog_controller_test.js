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

import {CreateServiceBindingDialogController} from 'servicebindinglist/createservicebindingdialog_controller';
import serviceBindingListModule from 'servicebindinglist/servicebindinglist_module';

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
   * @type {!Object}
   */
  let serviceInstance;

  /**
   * @type {!Object}
   */
  let serviceInstanceList;

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
    serviceInstance = {};
    serviceInstanceList = {};
    angular.mock.module(serviceBindingListModule.name);

    angular.mock.inject(
        ($controller, kdCsrfTokenService, _$mdDialog_, _$state_, _$stateParams_) => {
          $resource = jasmine.createSpy('$resource');
          tokenPromise = Promise.resolve(token);
          spyOn(kdCsrfTokenService, 'getTokenForAction').and.returnValue(tokenPromise);
          $mdDialog = _$mdDialog_;
          $state = _$state_;
          $stateParams = _$stateParams_;

          $ctrl = $controller(CreateServiceBindingDialogController, {
            serviceInstance,
            serviceInstanceList,
            $mdDialog,
            $resource,
            kdCsrfTokenService,
            $state,
            $stateParams,
          });
        });
  });

  it('createBinding should create a resource and then call save on it and then call hide the dialog and reload the state',
     (done) => {
       let saveSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
       $resource.and.callFake(() => {
         return {
           save: saveSpy,
         };
       });
       serviceInstance.name = 'fooinstance';
       $ctrl.formData.fromLabel = 'app:barlabel';
       $ctrl.formData.parameters = '{"useProxy": true}';
       $stateParams.objectNamespace = 'baz-namespace';
       spyOn($mdDialog, 'hide');
       spyOn($state, 'reload');


       $ctrl.createBinding().then(() => {
         expect($resource).toHaveBeenCalledWith(
             'api/v1alpha1/servicebinding/baz-namespace', {},
             {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
         expect(saveSpy).toHaveBeenCalledWith({
           'apiVersion': 'catalog.k8s.io/v1alpha1',
           'kind': 'ServiceBinding',
           'metadata': {
             'name': 'barlabel-fooinstance',
           },
           'name': 'barlabel-fooinstance',
           'spec': {
             'instanceRef': {
               'name': 'fooinstance',
               'namespace': 'baz-namespace',
             },
             'serviceName': 'fooinstance',
             'parameters': {
               'useProxy': true,
             },
           },
           'to': 'fooinstance',
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
