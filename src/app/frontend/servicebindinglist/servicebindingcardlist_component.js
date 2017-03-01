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

import {CreateServiceBindingDialogController} from './createservicebindingdialog_controller';


/**
 * @final
 */
export class ServiceBindingCardListController {
  /**
   * @param {!md.$dialog} $mdDialog
   * @ngInject
   */
  constructor($mdDialog) {
    /** @export {?} Initialized from binding. */
    this.serviceBindingList;

    /** @export {?} Initialized from binding. */
    this.serviceInstance;

    /** @export {!md.$dialog} */
    this.mdDialog = $mdDialog;
  }

  /**
   * @param {!angular.Scope.Event} event
   * @export
   */
  showAddBindingDialog(event) {
    this.mdDialog.show({
      controller: CreateServiceBindingDialogController,
      controllerAs: '$ctrl',
      templateUrl: 'servicebindinglist/createservicebindingdialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      locals: {
        'serviceInstance': this.serviceInstance,
      },
    });
  }
}

/**
 * Definition object for the component that displays service card list.
 *
 * @type {!angular.Component}
 */
export const serviceBindingCardListComponent = {
  templateUrl: 'servicebindinglist/servicebindingcardlist.html',
  controller: ServiceBindingCardListController,
  bindings: {
    /** {?} */
    'serviceBindingList': '<',
    /** {?} */
    'serviceInstance': '<?',
  },
};
