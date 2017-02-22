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

export class CreateServiceBindingDialogController {
  /**
   * @param {?} serviceInstance
   * @param {!angular.$scope} $scope
   * @param {!md.$dialog} $mdDialog
   * @ngInject
   */
  constructor(serviceInstance, $scope, $mdDialog) {
    this.serviceInstance = serviceInstance;
    this.scope = $scope;
    this.scope.binding = {
      name: '',
    };
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
  }

  closeDialog() {
    this.mdDialog_.hide();
  }
}
