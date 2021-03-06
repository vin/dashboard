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

    /** @export {backendApi.ServiceInstanceList} */
    this.serviceInstances;
    /** @export {backendApi.ServiceBindingList} */
    this.serviceBindings;
    /** @export {backendApi.ServiceClassList} */
    this.serviceClasses;
  }

  $onInit() {
    this.fetcher_.getData().then(response => this.generateServiceGraph(response.data));
    //this.fetcher_.getData().then(response => this.generateIstioGraph(response.data));
  }

  /**
   * Generates graph using this.metrics provided.
   * @private
   * @param {{edges: Array<Object>, nodes: Array<Object>}} data
   */
  generateIstioGraph(data) {
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

  /**
   * @param {{edges: Array<Object>, nodes: Array<Object>}} istioData
   */
  generateServiceGraph(istioData) {
    let svgEl = this.element_.find('svg')[0];
    let width = svgEl.clientWidth;
    let height = svgEl.clientHeight;
    let svg = d3.select(this.element_[0]).select('svg.servicegraph');
    let overlay = d3.select(this.element_[0]).select('.overlay');

    let nodes = this.serviceInstances.serviceInstances || [];
    let nodemap = {};
    for (let n of nodes) {
      n.x = width / 2;
      n.y = height / 2;
      if (n.kind == 'ServiceInstance') {
        n.href = `#/serviceinstancelist/${n.metadata.namespace}/${n.name}`;
      }
      let serviceClass = this.getServiceClass(n);
      if (serviceClass) {
        n.imgURL = serviceClass.ImageURL;
      }
      nodemap[n.name] = n;
    }

    let links = this.serviceBindings.items || [];
    for (let l of links) {
      let name = l.name;
      let [from, to] = name.split('-');
      if (!(from in nodemap)) {
        nodemap[from] = {name: from}
        nodes.push(nodemap[from])
      }
      l.source = nodemap[from];
      if (!(to in nodemap)) {
        nodemap[to] = {name: to}
        nodes.push(nodemap[from])
      }
      l.target = nodemap[to];
      if (istioData.edges) {
        let istioEdge = istioData.edges.find(e => e.source == name);
        if (istioEdge) {
          l.labels = istioEdge.labels;
        }
      }
    }

    let force = d3.layout.force()
        .gravity(0.05)
        .distance(height / 1.5)
        .linkStrength(0.3)
        .charge(-5000)
        .chargeDistance(300)
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .start();

    let link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("g")
        .attr("class", "link")
        .append("line");

    let node = overlay.selectAll(".node")
        .data(nodes, node => node.name)
        .enter().append("div")
        .attr("class", "node")
        .html(d => getNodeTemplate(d))
        .call(force.drag);

    node.on("click", c => {
      node.classed("selected", d => ( d == c ));
    });

    let constrain = (min, max) => (v) => {
        v = Math.max(v, min);
        v = Math.min(v, max);
        return v;
    }

    let linkText = svg.selectAll(".link")
        .append("text")
        .attr("class", "link-label")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) {
          if (d.labels) {
            return Math.round(d.labels['qps']) + " qps";
          }
        });

    force.on("tick", () => {
      link.attr("x1", (d) => constrain(110, width-110)(d.source.x))
          .attr("y1", (d) => constrain(60, height-60)(d.source.y))
          .attr("x2", (d) => constrain(110, width-110)(d.target.x))
          .attr("y2", (d) => constrain(60, height-60)(d.target.y));

      node.style("left", d => `${constrain(110, width - 110)(d.x) - 110}px`);
      node.style("top", d => `${constrain(60, height - 60)(d.y) - 60}px`);

      linkText.attr("x", (d) => (d.source.x + d.target.x) / 2)
          .attr("y", (d) => (d.source.y + d.target.y) / 2);
    });

  }

  getServiceClass(node) {
    return this.serviceClasses.items.find(sc => (sc.name == node.spec.serviceClassName));
  }
}

function getNodeTemplate(node) {
  let template = `<div id='node_${node.name}' class='node_inner'>`
  template += "<div class='background'></div>";
  if (node.imgURL) {
    template += `<img class='logo' src='${node.imgURL}' />`;
  }
  if (node.href) {
    template += `<div class="title"><a href="${node.href}">${node.name}</a></div>`;
  } else {
    template += '<div class="title">' + node.name + '</div>';
  }
  if (node.spec && node.spec.serviceClassName) {
    template += `<div class="kd-service-instance-tile-class">instance of ${node.spec.serviceClassName}</div>`;
  }
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
    'serviceInstances': '<',
    'serviceBindings': '<',
    'serviceClasses': '<',
  },
  controller: ServiceGraphController,
  templateUrl: 'common/components/servicegraph/servicegraph.html',
};
