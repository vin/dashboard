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

	"k8s.io/client-go/1.5/dynamic"
	"k8s.io/client-go/1.5/pkg/api/unversioned"
	"k8s.io/client-go/1.5/tools/clientcmd"
)

// CreateDynamicClient creates new client-go dynamic client, for accessing third party resources.
// groupName
// apiVersion
// kubeConfig location of kubeconfig file
func CreateDynamicClient(apiserverHost string, kubeConfig string, groupName string, apiVersion string) (*dynamic.Client, error) {

	cfg, err := clientcmd.BuildConfigFromFlags(apiserverHost, kubeConfig)
	if err != nil {
		debug.PrintStack()
		log.Printf("%v", kubeConfig)
		log.Printf("%v", err)
		return nil, err
	}
	cfg.ContentConfig.GroupVersion = &unversioned.GroupVersion{groupName, apiVersion}
	cfg.APIPath = "apis"

	log.Printf("Creating dynamic client for %s", cfg.Host)
	client, err := dynamic.NewClient(cfg)

	if err != nil {
		debug.PrintStack()
		return nil, err
	}
	return client, nil
}
