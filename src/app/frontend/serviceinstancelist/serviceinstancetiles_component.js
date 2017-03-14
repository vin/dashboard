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
export class ServiceInstanceTilesController {
  /**
   * @ngInject
   */
  constructor() {
    /** @export {!backendApi.ServiceInstanceList} */
    this.serviceInstanceList;
    /** @export {!backendApi.ServiceClassList} */
    this.serviceClassList;
  }

  /**
   * @param {!backendApi.ServiceInstance} serviceInstance
   * @return {!backendApi.ServiceClass} serviceClass
   * @export
   */
  getServiceClassForServiceInstance(serviceInstance){
    let retServiceClass = this.serviceClassList.items.find((serviceClass) =>
      serviceInstance['spec']['serviceClassName'] === serviceClass['name']
    );
    if(!retServiceClass){
      throw new Error(
          `Could not find the service class with name ` +
          `'${serviceInstance['spec']['serviceClassName']}' for ` +
          `serviceInstance with name ${serviceInstance}`);
    } else {
      return retServiceClass;
    }
  }
}

/**
 *
 * @type {!angular.Component}
 */
export const serviceInstanceTilesComponent = {
  templateUrl: 'serviceinstancelist/serviceinstancetiles.html',
  controller: ServiceInstanceTilesController,
  bindings: {
    /** {!backendApi.ServiceInstanceList} */
    'serviceInstanceList': '<',
    /** {!backendApi.ServiceClassList} */
    'serviceClassList': '<',
  },
};
