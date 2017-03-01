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

package client

import (
	"log"
	"runtime/debug"

	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

func buildConfigFromFlags(apiserverHost string, kubeConfig string) (*rest.Config, error) {
	if apiserverHost == "" && kubeConfig == "" {
		return rest.InClusterConfig()
	}
	return clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
		&clientcmd.ClientConfigLoadingRules{ExplicitPath: kubeConfig},
		&clientcmd.ConfigOverrides{ClusterInfo: clientcmdapi.Cluster{Server: apiserverHost}}).ClientConfig()
}


// CreateDynamicClient creates new client-go dynamic client, for accessing third party resources.
// groupName
// apiVersion
// kubeConfig location of kubeconfig file
func CreateDynamicClient(apiserverHost string, kubeConfig string, groupName string, apiVersion string) (*dynamic.Client, error) {

	log.Printf("Creating dynamic client.")
	cfg, err := buildConfigFromFlags(apiserverHost, kubeConfig)
	if err != nil {
		debug.PrintStack()
		log.Printf("%v", kubeConfig)
		log.Printf("%v", err)
		return nil, err
	}
	cfg.ContentConfig.GroupVersion = &schema.GroupVersion{groupName, apiVersion}
	cfg.APIPath = "apis"

	log.Printf("Creating dynamic client for %s", cfg.Host)
	client, err := dynamic.NewClient(cfg)

	if err != nil {
		debug.PrintStack()
		return nil, err
	}
	return client, nil
}
