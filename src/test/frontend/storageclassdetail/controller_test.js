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

import {StorageClassController} from 'storageclassdetail/controller';
import storageClassDetailModule from 'storageclassdetail/module';

describe('Storage Class Detail controller', () => {

  beforeEach(() => {
    angular.mock.module(storageClassDetailModule.name);
  });

  it('should initialize storage class controller', angular.mock.inject(($controller) => {
    let data = {};
    /** @type {!StorageClassController} */
    let ctrl = $controller(StorageClassController, {storageClass: data});

    expect(ctrl.storageClass).toBe(data);
  }));
});
