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

import serviceClassDetailModule from 'serviceclassdetail/serviceclassdetail_module';
import {stateName as serviceInstanceListStateName} from 'serviceinstancelist/serviceinstancelist_state';

describe('Service card controller', () => {
  /**
   * @type {!CreateServiceBindingDialogController}
   */
  let $ctrl;

  /**
   * @type {!Object}
   */
  let serviceClass;

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
    serviceClass = {};
    angular.mock.module(serviceClassDetailModule.name);

    angular.mock.inject(($componentController, kdCsrfTokenService, _$state_, _$stateParams_) => {
      $resource = jasmine.createSpy('$resource');
      tokenPromise = Promise.resolve(token);
      spyOn(kdCsrfTokenService, 'getTokenForAction').and.returnValue(tokenPromise);
      $state = _$state_;
      $stateParams = _$stateParams_;

      $ctrl = $componentController(
          'kdServiceClassDetailCreateForm', {
            $resource,
            kdCsrfTokenService,
            $state,
            $stateParams,
          },
          {serviceClass});
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
       serviceClass.name = 'fooclass';
       $ctrl.formData.name = 'barinstance';
       $ctrl.formData.useProxy = true;
       $ctrl.formData.plan = 'bozplan';
       $stateParams.objectNamespace = 'baz-namespace';
       spyOn($state, 'go');


       $ctrl.createInstance().then(() => {
         expect($resource).toHaveBeenCalledWith(
             'api/v1alpha1/serviceinstance/baz-namespace', {},
             {save: {method: 'PUT', headers: {'X-CSRF-TOKEN': token}}});
         expect(saveSpy).toHaveBeenCalledWith({
           'kind': 'ServiceInstance',
           'metadata': {
             'name': 'barinstance',
           },
           'name': 'barinstance',
           'spec': {
             'serviceClassName': 'fooclass',
             'planName': 'bozplan',
           },
           'space_guid': 'default',
           'Parameters': {'useProxy': true},
         });
         expect($state.go).toHaveBeenCalledWith(serviceInstanceListStateName);
         done();
       });

     });
});
