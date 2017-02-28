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

import {AddCatalogDialogController} from './addcatalogdialog_controller';
import {stateName} from './serviceclasslist_state';

/**
 * @final
 */
export class ActionBarController {
  /**
   * @param {!md.$dialog} $mdDialog
   * @param {!ui.router.$state} $state
   * @param {?} $stateParams
   * @ngInject
   */
  constructor($mdDialog, $state, $stateParams) {
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
    /** @private {?} */
    this.stateParams_ = $stateParams;
  }

  showAddCatalogDialog(event) {
    this.mdDialog_.show({
      controller: AddCatalogDialogController,
      controllerAs: '$ctrl',
      templateUrl: 'serviceclasslist/addcatalogdialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
    });
  }

  getServiceClassListHref(viewMode) {
    return this.state_.href(stateName, {viewMode});
  }

  isCurrentViewMode(viewMode) {
    return viewMode === this.stateParams_.viewMode;
  }
}
