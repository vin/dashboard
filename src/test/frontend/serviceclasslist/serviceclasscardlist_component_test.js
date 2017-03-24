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

import serviceClassListModule from 'serviceclasslist/serviceclasslist_module';

describe('Service card controller', () => {
  /**
   * @type {!serviceclasslist/serviceclasscardlist_component.ServiceClassCardListController}
   */
  let $ctrl;

  /**
   * @type {!Object}
   */
  let serviceClassList;

  /**
   * @type {!Object}
   */
  let serviceBrokerList;

  beforeEach(() => {
    serviceClassList = {};
    serviceBrokerList = {
      items: [
        {name: 'foobroker', data: 'foo'},
        {name: 'barbroker', data: 'bar'},
        {name: 'bazbroker', data: 'baz'},
      ],
    };
    angular.mock.module(serviceClassListModule.name);

    angular.mock.inject(($componentController) => {
      $ctrl =
          $componentController('kdServiceClassCardList', {}, {serviceClassList, serviceBrokerList});
    });
  });

  it('getServiceBrokerForServiceClass should return the correct service broker for the given class',
     () => {
       expect($ctrl.getServiceBrokerForServiceClass({name: 'class1', BrokerName: 'foobroker'}))
           .toEqual({name: 'foobroker', data: 'foo'});
       expect($ctrl.getServiceBrokerForServiceClass({name: 'class2', BrokerName: 'foobroker'}))
           .toEqual({name: 'foobroker', data: 'foo'});
       expect($ctrl.getServiceBrokerForServiceClass({name: 'class3', BrokerName: 'barbroker'}))
           .toEqual({name: 'barbroker', data: 'bar'});
       expect($ctrl.getServiceBrokerForServiceClass({name: 'class4', BrokerName: 'bazbroker'}))
           .toEqual({name: 'bazbroker', data: 'baz'});
     });

  it('getServiceBrokerForServiceClass should throw an error if a given service broker cannot be found',
     () => {
       expect(() => {
         $ctrl.getServiceBrokerForServiceClass({name: 'class1', BrokerName: 'errorbroker'});
       }).toThrow();
     });
});
