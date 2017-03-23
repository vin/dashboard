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

import {CreateServiceBindingDialogController} from 'servicebindinglist/createservicebindingdialog_controller';
import serviceBindingListModule from 'servicebindinglist/servicebindinglist_module';

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
   * @type {!Object}
   */
  let serviceBindingList;
  /**
   * @type {!Object}
   */
  let serviceInstance;
  /**
   * @type {!Object}
   */
  let serviceInstanceList;

  beforeEach(() => {
    serviceBindingList = {};
    serviceInstance = {};
    serviceInstanceList = {};
    angular.mock.module(serviceBindingListModule.name);

    angular.mock.inject(($componentController, _$mdDialog_) => {
      $mdDialog = _$mdDialog_;
      $ctrl = $componentController(
          'kdServiceBindingCardList', {$mdDialog},
          {serviceBindingList, serviceInstance, serviceInstanceList});
    });
  });

  it('should return service instance details link', () => {
    spyOn($mdDialog, 'show');
    let mockEvent = {'mockEvent': true};
    serviceInstance.name = 'foo';
    serviceInstanceList.name = 'bar';
    $ctrl.showAddBindingDialog(mockEvent);
    expect($mdDialog.show).toHaveBeenCalledWith({
      controller: CreateServiceBindingDialogController,
      controllerAs: '$ctrl',
      templateUrl: 'servicebindinglist/createservicebindingdialog.html',
      parent: angular.element(document.body),
      targetEvent: mockEvent,
      locals: {serviceInstance, serviceInstanceList},
    });
  });
});
