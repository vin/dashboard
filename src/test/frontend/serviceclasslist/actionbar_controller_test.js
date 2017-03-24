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

import {ActionBarController} from 'serviceclasslist/actionbar_controller';
import {AddCatalogDialogController} from 'serviceclasslist/addcatalogdialog_controller';
import serviceClassListModule from 'serviceclasslist/serviceclasslist_module';

describe('Service card controller', () => {
  /**
   * @type {!servicebindingdetail/servicebindingdetail_component.ServiceBindingCardListController}
   */
  let $ctrl;
  /**
   * @type {!md.$dialog}
   */
  let $mdDialog;

  /**
   * @type {!ui.router.$state} $state
   */
  let $state;

  /**
   * @type {!/common/resource/resourcedetail.StateParams} $stateParams
   */
  let $stateParams;

  beforeEach(() => {
    $stateParams = {};
    angular.mock.module(serviceClassListModule.name);

    angular.mock.inject(($controller, _$mdDialog_, _$state_) => {
      $mdDialog = _$mdDialog_;
      $state = _$state_;
      $ctrl = $controller(ActionBarController, {$mdDialog, $state, $stateParams});
    });
  });

  it('should launch the dialog correctly when showAddCatalogDialog is called', () => {
    spyOn($mdDialog, 'show');
    let mockEvent = {'mockEvent': true};
    $ctrl.showAddCatalogDialog(mockEvent);
    expect($mdDialog.show).toHaveBeenCalledWith({
      controller: AddCatalogDialogController,
      controllerAs: '$ctrl',
      templateUrl: 'serviceclasslist/addcatalogdialog.html',
      parent: angular.element(document.body),
      targetEvent: mockEvent,
    });
  });


  it('getServiceClassListHref should return the link with the right viewMode',
     () => {
       expect($ctrl.getServiceClassListHref('list'))
           .toBe(
               '#/serviceclasslist?viewMode=list');
       expect($ctrl.getServiceClassListHref('tile'))
           .toBe(
               '#/serviceclasslist?viewMode=tile');
     });


  it('isCurrentViewMode should return true if and only if it matches the view mode in the stateParams',
     () => {
       $stateParams.viewMode = 'list';
       expect($ctrl.isCurrentViewMode('list')).toBe(true);
       expect($ctrl.isCurrentViewMode('tile')).toBe(false);
       $stateParams.viewMode = 'tile';
       expect($ctrl.isCurrentViewMode('list')).toBe(false);
       expect($ctrl.isCurrentViewMode('tile')).toBe(true);
     });
});
