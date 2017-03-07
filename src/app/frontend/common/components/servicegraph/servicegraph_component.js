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

export class ServiceGraphController {
  /**
   * @ngInject
   * @param {!angular.Scope} $scope
   * @param {!angular.JQLite} $element
   */
  constructor($scope, $element, kdServiceGraphFetcher) {
    /** @private {!angular.Scope} */
    this.scope_ = $scope;

    /** @private {!angular.JQLite} */
    this.element_ = $element;

    this.fetcher_ = kdServiceGraphFetcher;
  }

  $onInit() {
    this.fetcher_.getData().then(response => this.generateGraph(response.data));
  }

  /**
   * Generates graph using this.metrics provided.
   * @private
   * @param {{edges: Array<Object>, nodes: Array<Object>}} data
   */
  generateGraph(data) {
    let svgEl = this.element_.find('svg')[0];
    let width = svgEl.clientWidth;
    let height = svgEl.clientHeight;
    let svg = d3.select(this.element_[0]).select('svg.servicegraph');
    let overlay = d3.select(this.element_[0]).select('.overlay');

    let nodes = [];
    let nodemap = {};
    for (let k in data['nodes']) {
      let node = {
        name: k
      };
      nodes.push(node);
      nodemap[k] = node;
    }

    let edges = data['edges'] || []

    let links = edges.map(edge => ({
      source: nodemap[edge.source],
      target: nodemap[edge.target],
      labels: edge.labels,
    }));

    let force = d3.layout.force()
        .gravity(0.02)
        .distance(height / 3)
        .charge(-500)
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .start();

    let link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("g")
        .attr("class", "link")
        .append("line")
        .attr("marker-mid", "url(#arrowhead)");

    let node = overlay.selectAll(".node")
        .data(nodes, node => node.name)
        .enter().append("div")
        .attr("class", "node")
        .html(d => getNodeTemplate(d))
        .call(force.drag);

    node.on("click", c => {
      node.classed("selected", d => ( d == c ));
    });

    let linkText = svg.selectAll(".link")
        .append("text")
        .attr("class", "link-label")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) {
          return Math.round(d.labels['qps']) + " qps";
        });

    force.on("tick", () => {
      link.attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

      node.style("left", d => `${d.x - 95}px`);
      node.style("top", d => `${d.y - 40}px`);

      linkText.attr("x", (d) => (d.source.x + d.target.x) / 2)
          .attr("y", (d) => (d.source.y + d.target.y) / 2);
    });
  }
}

function getNodeTemplate(node) {
  let template = `<div id='node_${node.name}' class='node_inner'>`
  template += "<div class='background'></div>";
  //template += "<img class='logo' src='/static/"+node.name+".png' />";
  template += '<div class="title">' + node.name + '</div>';
  if (node.labels) {
    template += '<div class="labels">';
    for (let label of node.labels) {
      for (let key in label) {
        template += '<div class="label">' + key + ':' + label[key] + '</div>';
      }
    }
    template += '</div>'; // close .labels
  }
  template += '</div>'; // close .inner
  //console.log(template);
  return template;
}


/**
 * Definition object for the service graph component.
 *
 * @type {!angular.Component}
 */
export const serviceGraphComponent = {
  bindings: {
    'metrics': '<',
  },
  controller: ServiceGraphController,
  templateUrl: 'common/components/servicegraph/servicegraph.html',
};
