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

import serviceInstanceDetailModule from 'serviceinstancedetail/serviceinstancedetail_module';
import serviceBindingDetailModule from 'servicebindingdetail/servicebindingdetail_module';

describe('Service card controller', () => {
  /**
   * @type {!servicebindingdetail/servicebindingdetail_component.ServiceBindingDetailController}
   */
  let $ctrl;

  /**
   * @type {!ui.router.$state} $state
   */
  let $state;

  /**
   * @type {!./servicebindingdetail/servicebindingdetail_state.StateParams} $stateParams
   */
  let $stateParams;

  /**
   * @type {!Object}
   */
  let serviceBinding;


  beforeEach(() => {
    serviceBinding = {};
    $stateParams = {objectNamespace: 'foo', objectName: 'bar', bindingName: 'baz'};
    angular.mock.module(serviceInstanceDetailModule.name);
    angular.mock.module(serviceBindingDetailModule.name);

    angular.mock.inject(($componentController, _$state_) => {
      $state = _$state_;
      $ctrl = $componentController('kdServiceBindingInfo', {$state, $stateParams}, {serviceBinding});
    });
  });

  it('should return service instance details link', () => {
    // given
    $stateParams.objectNamespace = 'foo-namespace';
    $stateParams.objectName = 'bar-service-instance';

    // then
    expect($ctrl.getServiceInstanceDetailHref()).toBe('#/serviceinstancelist/foo-namespace/bar-service-instance');
  });
});
