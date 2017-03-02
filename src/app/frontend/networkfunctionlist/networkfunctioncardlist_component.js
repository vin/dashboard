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

import {AddNetworkFunctionDialogController} from './addnetworkfunctiondialog_controller';


/**
 * @final
 */
export class NetworkFunctionCardListController {
  /**
   * @param {!md.$dialog} $mdDialog
   * @ngInject
   */
  constructor($mdDialog) {
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @export {?} */
    this.serviceBinding;
  }

  /**
   * @export
   */
  showAddNetworkFunctionDialog(event) {
    this.mdDialog_.show({
      controller: AddNetworkFunctionDialogController,
      controllerAs: '$ctrl',
      templateUrl: 'networkfunctionlist/addnetworkfunctiondialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      locals: {
        'serviceBinding': this.serviceBinding,
      },
    });
  }

  /**
   * @export
   */
  getNetworkFunctions(){
    if(this.serviceBinding['istio_config']){
      return this.serviceBinding['istio_config'];
    } else {
      return [];
    }
  }
}

/**
 * Definition object for the component that displays network function card list.
 *
 * @type {!angular.Component}
 */
export const networkFunctionCardListComponent = {
  templateUrl: 'networkfunctionlist/networkfunctioncardlist.html',
  controller: NetworkFunctionCardListController,
  bindings: {
    /** {?} */
    'serviceBinding': '<',
  },
};
