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

import {AddNetworkFunctionDialogController} from 'networkfunctionlist/addnetworkfunctiondialog_controller';
import networkFunctionListModule from 'networkfunctionlist/networkfunctionlist_module';

describe('Service list controller', () => {

  /**
   * @type {!AddNetworkFunctionDialogController}
   */
  let $ctrl;
  /**
   * @type {!md.$dialog}
   */
  let $mdDialog;

  /**
   * @type {!Object}
   */
  let serviceBinding;

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
   * @type {!./servicebindingdetail/servicebindingdetail_state.StateParams} $stateParams
   */
  let $stateParams;

  beforeEach(() => {
    serviceBinding = {};
    angular.mock.module(networkFunctionListModule.name);

    angular.mock.inject(
        ($controller, kdCsrfTokenService, _$mdDialog_, _$state_, _$stateParams_) => {
          $resource = jasmine.createSpy('$resource');
          tokenPromise = Promise.resolve(token);
          spyOn(kdCsrfTokenService, 'getTokenForAction').and.returnValue(tokenPromise);
          $mdDialog = _$mdDialog_;
          $state = _$state_;
          $stateParams = _$stateParams_;

          $ctrl = $controller(
              AddNetworkFunctionDialogController,
              {serviceBinding, $resource, kdCsrfTokenService, $mdDialog, $state, $stateParams});
        });
  });

  it('createNetworkFunction should create a resource and then call save on it and then call hide the dialog and reload the state',
     (done) => {
       let saveSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
       $resource.and.callFake(() => {
         return {
           save: saveSpy,
         };
       });
       $ctrl.serviceBinding.typeMeta = {};
       $ctrl.serviceBinding.objectMeta = {};
       $ctrl.serviceBinding.metadata = {
         namespace: 'binding-namespace',
       };
       $ctrl.serviceBinding.name = 'service-binding';
       $ctrl.formData.kind = 'networkfunction-kind';
       spyOn($mdDialog, 'hide');
       spyOn($state, 'reload');


       $ctrl.createNetworkFunction().then(() => {
         expect($resource).toHaveBeenCalledWith(
             'api/v1alpha1/servicebinding/binding-namespace/service-binding', {},
             {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
         expect(saveSpy).toHaveBeenCalledWith({
           istio_config: [{kind: 'networkfunction-kind'}],
           name: 'service-binding',
           metadata: {
             namespace: 'binding-namespace',
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
