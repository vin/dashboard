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

import {StorageClassListController} from 'storageclasslist/controller';
import storageClassListModule from 'storageclasslist/module';

describe('Storage Class list controller', () => {
  /** @type {!storageclasslist/controller.StorageClassListController}
   */
  let ctrl;

  beforeEach(() => {
    angular.mock.module(storageClassListModule.name);

    angular.mock.inject(($controller) => {
      ctrl = $controller(StorageClassListController, {storageClassList: {storageClasses: []}});
    });
  });

  it('should initialize storage class controller', angular.mock.inject(($controller) => {
    let ctrls = {};
    /** @type {!StorageClassListController} */
    let ctrl = $controller(StorageClassListController, {storageClassList: {storageClasses: ctrls}});

    expect(ctrl.storageClassList.storageClasses).toBe(ctrls);
  }));

  it('should show zero state', () => {
    expect(ctrl.shouldShowZeroState()).toBe(true);
  });

  it('should hide zero state', () => {
    // given
    ctrl.storageClassList = {storageClasses: ['mock']};

    // then
    expect(ctrl.shouldShowZeroState()).toBe(false);
  });
});
