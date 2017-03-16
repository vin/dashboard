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

import networkFunctionListModule from 'networkfunctionlist/networkfunctionlist_module';
import {AddNetworkFunctionDialogController} from 'networkfunctionlist/addnetworkfunctiondialog_controller';

describe('Network Function Card List controller', () => {
  /**
   * @type {!networkfunctionlist/networkfunctioncardlist_component.NetworkFunctionCardListController}
   */
  let $ctrl;
  /**
   * @type {!md.$dialog}
   */
  let $mdDialog;

  /**
   * @type {!Object}
   */
  let serviceBinding;

  beforeEach(() => {
    serviceBinding = {};
    angular.mock.module(networkFunctionListModule.name);

    angular.mock.inject(($componentController, _$mdDialog_) => {
      $mdDialog = _$mdDialog_;
      $ctrl = $componentController('kdNetworkFunctionCardList', {$mdDialog: _$mdDialog_}, {serviceBinding});
    });
  });

  it('should launch the correct dialog when showAddNetworkFunctionDialog is called', () => {
    spyOn($mdDialog, 'show');
    let mockEvent = {'mockEvent': true};
    $ctrl.showAddNetworkFunctionDialog(mockEvent);
    expect($mdDialog.show).toHaveBeenCalledWith({
      controller: AddNetworkFunctionDialogController,
      controllerAs: '$ctrl',
      templateUrl: 'networkfunctionlist/addnetworkfunctiondialog.html',
      parent: angular.element(document.body),
      targetEvent: mockEvent,
      locals: {serviceBinding},
    });
  });

  it('should return the istio_config field of the serviceBinding when getNetworkFunctions is called or an empty array if its not there', () => {
    expect($ctrl.getNetworkFunctions()).toEqual([]);
    let istioConfig = [{type:'quotas'}];
    $ctrl.serviceBinding.istio_config = istioConfig;
    expect($ctrl.getNetworkFunctions()).toBe(istioConfig);
  });
});
