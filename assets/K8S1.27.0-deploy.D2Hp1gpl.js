import{Bt as e,G as t,Ht as n,Q as r,U as i,W as a,er as o,qn as s,qt as c,yn as l}from"./framework.Bt6Pg2Om.js";import{n as u}from"./theme.B7a9fncF.js";import"./chunks/vue-i18n.DVqrc9hU.js";import{a as d,i as f}from"./chunks/vue-router.C-veEj9W.js";var p={__name:`K8S1.27.0-deploy`,setup(p,{expose:m}){let h=s(JSON.parse(`{"title":"K8S1.27.0集群部署要点","description":"","frontmatter":{"title":"K8S1.27.0集群部署要点","businesscard":true,"date":"2023-06-10 00:43:16","tags":["Linux","Kubernetes","云计算"],"categories":["服务器运维","云计算","k8s"],"cover":"https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg"},"headers":[],"relativePath":"pages/posts/K8S1.27.0-deploy.md"}`)),g=d(),_=f(),v=Object.assign(_.meta.frontmatter||{},h.value?.frontmatter||{});return g.currentRoute.value.data=h.value,n(`valaxy:frontmatter`,v),globalThis.$frontmatter=v,m({frontmatter:{title:`K8S1.27.0集群部署要点`,businesscard:!0,date:`2023-06-10 00:43:16`,tags:[`Linux`,`Kubernetes`,`云计算`],categories:[`服务器运维`,`云计算`,`k8s`],cover:`https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg`}}),(n,s)=>{let d=u;return e(),a(d,{frontmatter:o(v)},{"main-content-md":l(()=>[s[0]||=i(`p`,null,[r(`⚠️注意：本文已经严重过时且不具备任何参考价值，最新 k8s 部署请参考`),i(`a`,{href:`https://blog.horonlee.com/posts/ubuntu22.04-k8s-deploy`,target:`_blank`,rel:`noreferrer`},`Ubuntu22.04部署K8S - 皓然小站 (horonlee.com)`),i(`a`,{href:`./ubuntu22.04-k8s-deploy`},`ubuntu22.04-k8s-deploy`)],-1),t(` more `),s[1]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubeadm config images pull --kubernetes-version=v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`W0609 23:21:18.405148    2447 images.go:80] could not find officially supported version of etcd for Kubernetes v1.27.0, falling back to the nearest etcd version (3.5.7-0)`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/kube-apiserver:v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/kube-controller-manager:v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/kube-scheduler:v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/kube-proxy:v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/pause:3.9`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/etcd:3.5.7-0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[config/images] Pulled registry.k8s.io/coredns/coredns:v1.10.1`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[2]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubeadm init --kubernetes-version=v1.27.0 --pod-network-cidr=10.224.0.0/16 --apiserver-advertise-address=192.168.1.200`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[init] Using Kubernetes version: v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] Running pre-flight checks`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] Pulling images required for setting up a Kubernetes cluster`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] This might take a minute or two, depending on the speed of your internet connection`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`W0609 23:23:47.717937    2546 images.go:80] could not find officially supported version of etcd for Kubernetes v1.27.0, falling back to the nearest etcd version (3.5.7-0)`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`W0609 23:23:47.891888    2546 checks.go:835] detected that the sandbox image "registry.k8s.io/pause:3.6" of the container runtime is inconsistent with that used by kubeadm. It is recommended that using "registry.k8s.io/pause:3.9" as the CRI sandbox image.`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Using certificateDir folder "/etc/kubernetes/pki"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "ca" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "apiserver" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] apiserver serving cert is signed for DNS names [k8s-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.1.200]`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "apiserver-kubelet-client" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "front-proxy-ca" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "front-proxy-client" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "etcd/ca" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "etcd/server" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] etcd/server serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.1.200 127.0.0.1 ::1]`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "etcd/peer" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] etcd/peer serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.1.200 127.0.0.1 ::1]`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "etcd/healthcheck-client" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "apiserver-etcd-client" certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[certs] Generating "sa" key and public key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubeconfig] Using kubeconfig folder "/etc/kubernetes"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubeconfig] Writing "admin.conf" kubeconfig file`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubeconfig] Writing "kubelet.conf" kubeconfig file`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubeconfig] Writing "controller-manager.conf" kubeconfig file`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubeconfig] Writing "scheduler.conf" kubeconfig file`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Starting the kubelet`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[control-plane] Using manifest folder "/etc/kubernetes/manifests"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[control-plane] Creating static Pod manifest for "kube-apiserver"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[control-plane] Creating static Pod manifest for "kube-controller-manager"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[control-plane] Creating static Pod manifest for "kube-scheduler"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`W0609 23:23:52.692177    2546 images.go:80] could not find officially supported version of etcd for Kubernetes v1.27.0, falling back to the nearest etcd version (3.5.7-0)`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[apiclient] All control plane components are healthy after 10.502621 seconds`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[upload-certs] Skipping phase. Please see --upload-certs`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[mark-control-plane] Marking the node k8s-master as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[mark-control-plane] Marking the node k8s-master as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Using token: ux83mg.qlhot371w5rtub2u`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[addons] Applied essential addon: CoreDNS`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[addons] Applied essential addon: kube-proxy`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`Your Kubernetes control-plane has initialized successfully!`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`To start using your cluster, you need to run the following as a regular user:`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`  mkdir -p $HOME/.kube`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`  sudo chown $(id -u):$(id -g) $HOME/.kube/config`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`Alternatively, if you are the root user, you can run:`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`  export KUBECONFIG=/etc/kubernetes/admin.conf`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`You should now deploy a pod network to the cluster.`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`  https://kubernetes.io/docs/concepts/cluster-administration/addons/`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`Then you can join any number of worker nodes by running the following on each as root:`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kubeadm join 192.168.1.200:6443 --token ux83mg.qlhot371w5rtub2u \\`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`        --discovery-token-ca-cert-hash sha256:7adc6b2a7551f204371d38c6a6da34d7deb321fda863b54bfe2b4d9b1811f680`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[3]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-worker ~]# kubeadm join 192.168.1.200:6443 --token ux83mg.qlhot371w5rtub2u \\`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`        --discovery-token-ca-cert-hash sha256:7adc6b2a7551f204371d38c6a6da34d7deb321fda863b54bfe2b4d9b1811f680`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] Running pre-flight checks`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] Reading configuration from the cluster...`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Starting the kubelet`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`This node has joined the cluster:`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`* Certificate signing request was sent to apiserver and a response was received.`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`* The Kubelet was informed of the new secure connection details.`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`Run 'kubectl get nodes' on the control-plane to see this node join the cluster.`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[4]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get node # 这里是因为需要管理权限的环境变量才可以执行管理命令，这一点和OpenStack十分相似`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`E0609 23:28:28.548179    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`E0609 23:28:28.548907    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`E0609 23:28:28.550827    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`E0609 23:28:28.552839    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`E0609 23:28:28.554668    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`The connection to the server localhost:8080 was refused - did you specify the right host or port?`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# export KUBECONFIG=/etc/kubernetes/admin.conf`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get node`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`NAME         STATUS     ROLES           AGE     VERSION`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`k8s-master   NotReady   control-plane   4m42s   v1.27.0`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`k8s-worker   NotReady   <none>          48s     v1.27.0`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[5]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`vim /etc/containerd/config.toml`)]),r(`
`),i(`span`,{class:`line`},[i(`span`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`未更改：sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[6]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl apply -f calico.yaml`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`poddisruptionbudget.policy/calico-kube-controllers created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`serviceaccount/calico-kube-controllers created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`serviceaccount/calico-node created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`configmap/calico-config created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/caliconodestatuses.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/ipreservations.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/kubecontrollersconfigurations.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrole.rbac.authorization.k8s.io/calico-kube-controllers created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrole.rbac.authorization.k8s.io/calico-node created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrolebinding.rbac.authorization.k8s.io/calico-kube-controllers created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrolebinding.rbac.authorization.k8s.io/calico-node created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`daemonset.apps/calico-node created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`deployment.apps/calico-kube-controllers created`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[7]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get pod -n kube-system`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`NAME                                       READY   STATUS     RESTARTS   AGE`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`calico-kube-controllers-6849cf9bcf-gsbzr   0/1     Pending    0          30s`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`calico-node-bdshx                          0/1     Init:0/3   0          30s`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`calico-node-mmjfl                          0/1     Init:0/3   0          30s`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`coredns-5d78c9869d-spj6w                   0/1     Pending    0          16m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`coredns-5d78c9869d-td7nt                   0/1     Pending    0          16m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`etcd-k8s-master                            1/1     Running    0          16m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kube-apiserver-k8s-master                  1/1     Running    0          16m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kube-controller-manager-k8s-master         1/1     Running    0          16m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kube-proxy-sfkrl                           1/1     Running    0          16m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kube-proxy-wm8mk                           1/1     Running    0          12m`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kube-scheduler-k8s-master                  1/1     Running    0          16m`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[8]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl apply -f dashboard.yaml`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`namespace/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`serviceaccount/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`service/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`secret/kubernetes-dashboard-certs created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`secret/kubernetes-dashboard-csrf created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`secret/kubernetes-dashboard-key-holder created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`configmap/kubernetes-dashboard-settings created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`role.rbac.authorization.k8s.io/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`deployment.apps/kubernetes-dashboard created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`service/dashboard-metrics-scraper created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`deployment.apps/dashboard-metrics-scraper created`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[9]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get pod -n kubernetes-dashboard -o wide`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`NAME                                         READY   STATUS             RESTARTS   AGE   IP               NODE         NOMINATED NODE   READINESS GATES`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`dashboard-metrics-scraper-5cb4f4bb9c-tvqlt   0/1     ImagePullBackOff   0          26s   10.224.254.132   k8s-worker   <none>           <none>`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kubernetes-dashboard-6967859bff-nrtsl        0/1     ImagePullBackOff   0          26s   10.224.254.133   k8s-worker   <none>           <none>`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[10]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get svc -n kubernetes-dashboard`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`dashboard-metrics-scraper   ClusterIP   10.106.18.213   <none>        8000/TCP   2m5s`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kubernetes-dashboard        ClusterIP   10.103.7.49     <none>        443/TCP    2m6s`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[11]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`service/kubernetes-dashboard edited # 将ClusterIP 改为NodePort`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[12]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get svc -n kubernetes-dashboard`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`dashboard-metrics-scraper   ClusterIP   10.106.18.213   <none>        8000/TCP        3m40s`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kubernetes-dashboard        NodePort    10.103.7.49     <none>        443:30571/TCP   3m41s`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[13]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl apply -f dashboard-user.yaml`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`serviceaccount/admin-user created`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`clusterrolebinding.rbac.authorization.k8s.io/admin-user created`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[14]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl -n kubernetes-dashboard create token admin-user`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`eyJhbGciOiJSUzI1NiIsImtpZCI6InVCZUlsckJGWUZoMTJfRDA2eVFsMm85d3lEYml4WmQxV2RmNGtNWGlzZUEifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjg2MzI1NzA3LCJpYXQiOjE2ODYzMjIxMDcsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJhZG1pbi11c2VyIiwidWlkIjoiYzAzOTI4OWEtMTc1MS00ZDY3LWFiNTgtMzE2ZTYzNWQ3NWEzIn19LCJuYmYiOjE2ODYzMjIxMDcsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDphZG1pbi11c2VyIn0.BOa9nhIPfx_qWoQOn8hbfA70Y2fIeO_xcjK5wJJdrgS2yeSFIqD07LwHyw6eT9a03leNUaSA6gj3kYeAQnbCpw8pacdGJAaBBL-Y6Y31p4uVNSH9bs9TJuVAGyfKzJ4G8eyj3bZ11PlEtLNXeCr7bB_tO_8Z93lCK-F8h9VfQV5TGxCRAmjWXX3c1tpox236lIVsDA8UC8LqrWO4TW5p22om5ES9RsgVypoYQPwZ0O7hy9k_7mMe2Nh2hdiibhuezwGcm2fl_fgBsK9REaer0NZF420p1crxUBiE0LfxfvgTTGHAnbwWlw_M2pFehvx82Lx6jmduNnq-0cPcReb4cw`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1),s[15]||=i(`p`,null,`访问Web页面相关问题，Web页面的端口是随机的，需要手动查看容器状态，可以看到下面dashboard映射出来的端口是30571`,-1),s[16]||=i(`div`,{class:`language-`},[i(`button`,{title:`Copy code`,class:`copy`}),i(`span`,{class:`lang`}),i(`pre`,{class:`shiki shiki-themes github-light github-dark vp-code`},[i(`code`,{"v-pre":``},[i(`span`,{class:`line`},[i(`span`,null,`[root@k8s-master ~]# kubectl get svc -A -o wide`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`NAMESPACE              NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE   SELECTOR`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`default                kubernetes                  ClusterIP   10.96.0.1       <none>        443/TCP                  32m   <none>`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kube-system            kube-dns                    ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   32m   k8s-app=kube-dns`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kubernetes-dashboard   dashboard-metrics-scraper   ClusterIP   10.106.18.213   <none>        8000/TCP                 12m   k8s-app=dashboard-metrics-scraper`)]),r(`
`),i(`span`,{class:`line`},[i(`span`,null,`kubernetes-dashboard   kubernetes-dashboard        NodePort    10.103.7.49     <none>        443:30571/TCP            13m   k8s-app=kubernetes-dashboard`)])])]),i(`button`,{class:`code-block-unfold-btn`})],-1)]),"main-header":l(()=>[c(n.$slots,`main-header`)]),"main-header-after":l(()=>[c(n.$slots,`main-header-after`)]),"main-nav":l(()=>[c(n.$slots,`main-nav`)]),"main-content-before":l(()=>[c(n.$slots,`main-content-before`)]),"main-content":l(()=>[c(n.$slots,`main-content`)]),"main-content-after":l(()=>[c(n.$slots,`main-content-after`)]),"main-nav-before":l(()=>[c(n.$slots,`main-nav-before`)]),"main-nav-after":l(()=>[c(n.$slots,`main-nav-after`)]),comment:l(()=>[c(n.$slots,`comment`)]),footer:l(()=>[c(n.$slots,`footer`)]),aside:l(()=>[c(n.$slots,`aside`)]),"aside-custom":l(()=>[c(n.$slots,`aside-custom`)]),default:l(()=>[c(n.$slots,`default`)]),_:3},8,[`frontmatter`])}}};export{p as default};