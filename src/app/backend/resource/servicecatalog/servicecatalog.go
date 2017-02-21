package servicecatalog

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/pkg/apis/extensions/v1beta1"
)

type resourceType int

type ResourceType resourceType

// These define the Third Party Resources that we can handle or operate on.
const (
	ServiceInstance = iota
	ServiceBinding
	ServiceBroker
	ServiceClass
)

func (rt *resourceType) name() string {
	return resourceTypeNames[*rt]
}

var resourceTypeNames = []string{
	"ServiceInstance",
	"ServiceBinding",
	"ServiceBroker",
	"ServiceClass",
}

// These resources _must_ exist in the cluster before proceeding.
var resourceTypes = []resourceType{ServiceInstance, ServiceBinding, ServiceBroker, ServiceClass}

const (
	// GroupName is a name of a Kubernetes API extension implemented by the service catalog.
	GroupName = "catalog.k8s.io"

	// APIVersion is a version of the Kubernetes API extension implemented by the service catalog.
	APIVersion = "v1alpha1"

	// FullAPIVersion is a fully qualified name of the Kubernetes API extension implemented by the service catalog.
	FullAPIVersion = GroupName + "/" + APIVersion

	// ServiceBrokerKind is a name of a Service Broker resource, a Kubernetes third party resource.
	ServiceBrokerKind = "ServiceBroker"

	// ServiceBindingKind is a name of a Service Binding resource, a Kubernetes third party resource.
	ServiceBindingKind = "ServiceBinding"

	// ServiceClassKind is a name of a Service Class resource, a Kubernetes third party resource.
	ServiceClassKind = "ServiceClass"

	// ServiceInstanceKind is a name of a Service Instance resource, a Kubernetes third party resource.
	ServiceInstanceKind = "ServiceInstance"
)

var thirdPartyResourceTypes = map[string]v1beta1.ThirdPartyResource{
	"service-broker.catalog.k8s.io": {
		ObjectMeta:  metav1.ObjectMeta{Name: "service-broker.catalog.k8s.io"},
		Description: "A Service Broker representation. Adds a service broker and fetches its catalog",
		Versions:    []v1beta1.APIVersion{{Name: "v1alpha1"}},
	},
	"service-class.catalog.k8s.io": {
		ObjectMeta:  metav1.ObjectMeta{Name: "service-class.catalog.k8s.io"},
		Description: "A Service Type representation. Something that a customer can instantiate",
		Versions:    []v1beta1.APIVersion{{Name: "v1alpha1"}},
	},
	"service-instance.catalog.k8s.io": {
		ObjectMeta:  metav1.ObjectMeta{Name: "service-instance.catalog.k8s.io"},
		Description: "A Service Instance representation, creates a Service Instance",
		Versions:    []v1beta1.APIVersion{{Name: "v1alpha1"}},
	},
	"service-binding.catalog.k8s.io": {
		ObjectMeta:  metav1.ObjectMeta{Name: "service-binding.catalog.k8s.io"},
		Description: "A Service Binding representation, creates a Service Binding",
		Versions:    []v1beta1.APIVersion{{Name: "v1alpha1"}},
	},
}

var serviceInstanceResource = metav1.APIResource{
	Name:       "serviceinstances",
	Kind:       ServiceInstanceKind,
	Namespaced: true,
}

var serviceBindingResource = metav1.APIResource{
	Name:       "servicebindings",
	Kind:       ServiceBindingKind,
	Namespaced: true,
}

var serviceBrokerResource = metav1.APIResource{
	Name:       "servicebrokers",
	Kind:       ServiceBrokerKind,
	Namespaced: true,
}

var serviceClassResource = metav1.APIResource{
	Name:       "serviceclasses",
	Kind:       ServiceClassKind,
	Namespaced: true,
}

func GetResourceClient(client *dynamic.Client, t ResourceType, namespace string) *dynamic.ResourceClient {
	switch t {
	case ServiceInstance:
		return client.Resource(&serviceInstanceResource, namespace)
	case ServiceBinding:
		return client.Resource(&serviceBindingResource, namespace)
	case ServiceBroker:
		return client.Resource(&serviceBrokerResource, namespace)
	case ServiceClass:
		return client.Resource(&serviceClassResource, namespace)
	}
	return nil
}
