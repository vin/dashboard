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
export class ServiceInstanceListController {
  /**
   * @param {!backendApi.ServiceInstanceList} serviceInstanceList
   * @param {!backendApi.ServiceClassList} serviceClassList
   * @param {!backendApi.ServiceBindingList} serviceBindingList
   * @param {{viewMode: string}} $stateParams
   * @ngInject
   */
  constructor(serviceInstanceList, serviceClassList, serviceBindingList, $stateParams) {
    /** @export {!backendApi.ServiceInstanceList} */
    this.serviceInstanceList = serviceInstanceList;
    /** @export {!backendApi.ServiceClassList} */
    this.serviceClassList = serviceClassList;
    /** @export {!backendApi.ServiceBindingList} */
    this.serviceBindingList = serviceBindingList;
    /** @export {string} */
    this.filterTerm = '';
    /** @private {string} */
    this.previousFilterTerm_ = '';
    /** @private {backendApi.ServiceInstanceList} */
    this.filteredServiceInstanceList_;
    /** @private {string} */
    this.viewMode_ = $stateParams.viewMode;
  }

  /**
   * @return {boolean}
   * @export
   */
  shouldShowZeroState() {
    return this.serviceInstanceList['listMeta']['totalItems'] === 0 && this.filterTerm === '';
  }

  /**
   * @return {!backendApi.ServiceInstanceList}
   * @export
   */
  getFilteredServiceInstanceList() {
    if (!this.filteredServiceInstanceList_ ||
        this.filterTerm !== this.previousFilterTerm_) {
      let filterTerm = this.filterTerm.toLowerCase();
      this.filteredServiceInstanceList_ = angular.copy(this.serviceInstanceList);
      this.filteredServiceInstanceList_['serviceInstances'] =
          this.filteredServiceInstanceList_['serviceInstances'].filter(
              (serviceInstance) => serviceInstance['name'].toLowerCase().includes(filterTerm));
      this.filteredServiceInstanceList_['listMeta'] = {
        'totalItems': this.filteredServiceInstanceList_['serviceInstances'].length,
      };
      this.previousFilterTerm_ = this.filterTerm;
    }
    return this.filteredServiceInstanceList_;
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

  /**
   * @return {boolean}
   * @export
   */
  shouldShowGraphView() {
    return this.viewMode_ === 'graph';
  }
}
