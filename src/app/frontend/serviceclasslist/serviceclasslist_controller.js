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
   * @param {!{viewMode: string}} $stateParams
   * @ngInject
   */
  constructor(serviceClassList, serviceBrokerList, $stateParams) {
    /** @export {!backendApi.ServiceClassList} */
    this.serviceClassList = serviceClassList;
    /** @export {!backendApi.ServiceBrokerList} */
    this.serviceBrokerList = serviceBrokerList;
    /** @export {string} */
    this.searchTerm = '';
    /** @export {string} */
    this.selectedBroker = 'all';
    /** @private {string} */
    this.previousSearchTerm_ = '';
    /** @private {string} */
    this.previousSelectedBroker_ = '';
    /** @private {Array<!backendApi.ServiceClass>} */
    this.searchedServiceClassList_ = null;
    /** @private {string} */
    this.viewMode_ = $stateParams.viewMode;
  }

  /**
   * @return {Array}
   * @export
   */
  getSearchedServiceClassList() {
    if (this.searchedServiceClassList_ === null ||
        this.selectedBroker !== this.previousSelectedBroker_ ||
        this.searchTerm !== this.previousSearchTerm_) {
      let searchTerm = this.searchTerm.toLowerCase();
      this.searchedServiceClassList_ = this.serviceClassList.items.filter((serviceClass) => {
        let matchesSearchTerm = serviceClass.name.toLowerCase().includes(searchTerm) ||
            serviceClass.DisplayName.toLowerCase().includes(searchTerm);
        let matchesCatalog =
            (this.selectedBroker === 'all' || serviceClass.BrokerName === this.selectedBroker);
        return matchesSearchTerm && matchesCatalog;
      });
      this.previousSelectedBroker_ = this.selectedBroker;
      this.previousSearchTerm_ = this.searchTerm;
    }
    return this.searchedServiceClassList_;
  }

  /**
   * @return {boolean}
   * @export
   */
  shouldShowListView() {
    return this.viewMode_ === 'list';
  }

  /**
   * @return {boolean}
   * @export
   */
  shouldShowTileView() {
    return this.viewMode_ === 'tile';
  }
}
