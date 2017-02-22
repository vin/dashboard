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
export class ServiceClassDetailCreateFormLabelsInputController {
  /**
   * @ngInject
   */
  constructor() {
    /** @export {?} */
    this.labelsModel;
  }

  addLabel() {
    this.labelsModel.push({key: '', value: ''});
  }

  /**
   * @param {?} labelObject
   */
  deleteLabel(labelObject) {
    let labelObjectIndex = this.labelsModel.indexOf(labelObject);
    this.labelsModel.splice(labelObjectIndex, 1);
  }
}

/**
 *
 * @type {!angular.Component}
 */
export const serviceClassDetailCreateFormLabelsInputComponent = {
  templateUrl: 'serviceclassdetail/serviceclassdetailcreateformlabelsinput.html',
  controller: ServiceClassDetailCreateFormLabelsInputController,
  bindings: {
    'labelsModel': '=',
  },
};
