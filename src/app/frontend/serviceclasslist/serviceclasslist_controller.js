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
export class ServiceClassListController {
  /**
   * @param {!backendApi.ServiceClassList} serviceClassList
   * @param {!backendApi.ServiceBrokerList} serviceBrokerList
   * @ngInject
   */
  constructor(serviceClassList, serviceBrokerList) {
    /** @export {!backendApi.ServiceClassList} */
    this.serviceClassList = serviceClassList;
    /** @export {!backendApi.ServiceBrokerList} */
    this.serviceBrokerList = serviceBrokerList;
    /** @export {string} */
    this.searchTerm = '';
    /** @export {string} */
    this.currentBroker = 'all';
    /** @private {string} */
    this.previousSearchTerm_ = '';
    /** @private {string} */
    this.previousBroker_ = '';
    /** @private {?} */
    this.searchedServiceClassList_ = null;
  }

  /**
   * @return {Array}
   */
  getSearchedServiceClassList() {
    if (this.searchedServiceClassList_ === null || this.currentBroker !== this.previousBroker_ ||
        this.searchTerm !== this.previousSearchTerm_) {
      let searchTerm = this.searchTerm.toLowerCase();
      this.searchedServiceClassList_ = this.serviceClassList.items.filter(
          (serviceClass) => serviceClass.name.toLowerCase().indexOf(searchTerm) !== -1 &&
              (this.currentBroker === 'all' || serviceClass.BrokerName === this.currentBroker));
      this.previousBroker_ = this.currentBroker;
      this.previousSearchTerm_ = this.searchTerm;
    }
    return this.searchedServiceClassList_;
  }
}
