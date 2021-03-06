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

/**
 * @final
 */
export class ServiceClassTilesController {
  /**
   * @ngInject
   */
  constructor() {
    /** @export {!backendApi.ServiceClassList} */
    this.serviceClassList;
    /** @export {!backendApi.ServiceBrokerList} */
    this.serviceBrokerList;
  }

  /**
   * @param {!backendApi.ServiceClass} serviceClass
   * @return {!backendApi.ServiceBroker}
   * @export
   */
  getServiceBrokerForServiceClass(serviceClass) {
    let ret = this.serviceBrokerList.items.find(
        (serviceBroker) => serviceBroker.name === serviceClass.BrokerName);
    if (!ret) {
      throw new Error(
          `Could not find broker "${serviceClass.BrokerName}" ` +
          `in the service broker list`);
    }
    return ret;
  }
}

/**
 *
 * @type {!angular.Component}
 */
export const serviceClassTilesComponent = {
  templateUrl: 'serviceclasslist/serviceclasstiles.html',
  controller: ServiceClassTilesController,
  bindings: {
    /** {!backendApi.ServiceClassList} */
    'serviceClassList': '<',
    /** {!backendApi.ServiceBrokerList} */
    'serviceBrokerList': '<',
  },
  // transclude: {
  //   'searchInput': 'kdServiceClassCardListSearchInput',
  //   'catalogSelector': 'kdServiceClassCardListCatalogSelector',
  // },
};
