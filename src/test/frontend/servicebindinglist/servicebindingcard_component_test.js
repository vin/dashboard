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

import serviceBindingDetailModule from 'servicebindingdetail/servicebindingdetail_module';
import serviceBindingListModule from 'servicebindinglist/servicebindinglist_module';

describe('Service binding card component', () => {
  /**
   * @type {!servicebindinglist/servicebindingcard_component.ServiceBindingCardController}
   */
  let $ctrl;

  /**
   * @type {!ui.router.$state} $state
   */
  let $state;

  /**
   * @type {!Object}
   */
  let serviceBinding;

  /**
   * @type {!Object}
   */
  let serviceInstance;


  beforeEach(() => {
    serviceBinding = {};
    serviceInstance = {};
    angular.mock.module(serviceBindingDetailModule.name);
    angular.mock.module(serviceBindingListModule.name);

    angular.mock.inject(($componentController, _$state_) => {
      $state = _$state_;
      $ctrl =
          $componentController('kdServiceBindingCard', {$state}, {serviceBinding, serviceInstance});
    });
  });


  it('isSuccess should return true if Status has a condition "Ready" that is "True"', () => {
    serviceBinding.Status = {
      Conditions: [
        {Type: 'Ready', Status: 'True'},
      ],
    };
    expect($ctrl.isSuccess()).toBe(true);
  });

  it('isSuccess should return false if Status doesn\'t have a condition "Ready" that is "True"',
     () => {
       serviceBinding.Status = {
         Conditions: [
           {Type: 'Ready', Status: 'False'},
         ],
       };
       expect($ctrl.isSuccess()).toBe(false);

       serviceBinding.Status = {
         Conditions: [],
       };
       expect($ctrl.isSuccess()).toBe(false);


       delete serviceBinding.Status;
       expect($ctrl.isSuccess()).toBe(false);
     });

  it('isPending should return false if Status has a condition "Ready" that is "True"', () => {
    serviceBinding.Status = {
      Conditions: [
        {Type: 'Ready', Status: 'True'},
      ],
    };
    expect($ctrl.isPending()).toBe(false);
  });

  it('isPending should return true if Status doesn\'t have a condition "Ready" that is "True"',
      () => {
        serviceBinding.Status = {
          Conditions: [
            {Type: 'Ready', Status: 'False'},
          ],
        };
        expect($ctrl.isPending()).toBe(true);

        serviceBinding.Status = {
          Conditions: [],
        };
        expect($ctrl.isPending()).toBe(true);


        delete serviceBinding.Status;
        expect($ctrl.isPending()).toBe(true);
      });

  it('should return the correct service binding details link', () => {
    serviceInstance.metadata = {
      namespace: 'foo-namespace',
      name: 'bar-service-instance',
    };
    serviceBinding.name = 'baz-service-binding';

    expect($ctrl.getServiceBindingDetailHref())
        .toBe(
            '#/serviceinstancelist/foo-namespace/bar-service-instance/binding/baz-service-binding');
  });
});
