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

import {ServiceClassDetailController} from 'serviceclassdetail/serviceclassdetail_controller';
import serviceClassDetailModule from 'serviceclassdetail/serviceclassdetail_module';

describe('Service binding card component', () => {
  /**
   * @type {!servicebindinglist/servicebindingcard_component.ServiceBindingCardController}
   */
  let $ctrl;

  /**
   * @type {!Object}
   */
  let serviceClass;


  beforeEach(() => {
    serviceClass = {};
    angular.mock.module(serviceClassDetailModule.name);

    angular.mock.inject(($controller) => {
      $ctrl = $controller(ServiceClassDetailController, {serviceClass});
    });
  });


  it('should not be instantiating a class by default', () => {
    expect($ctrl.isInstantiatingClass()).toBe(false);
  });

  it('after calling start instantiating class, it should now be instantiating a class', () => {
    $ctrl.startInstantiatingClass();
    expect($ctrl.isInstantiatingClass()).toBe(true);
  });

  it('after calling stop instantiating class, it should no longer be instantiating a class', () => {
    $ctrl.startInstantiatingClass();
    $ctrl.stopInstantiatingClass();
    expect($ctrl.isInstantiatingClass()).toBe(false);
  });

});
