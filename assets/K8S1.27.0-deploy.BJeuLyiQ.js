import{_ as b}from"./ValaxyMain.vue_vue_type_style_index_0_lang.BKY0BFev.js";import"./chunks/@vueuse/motion.C1YF0VrX.js";import{d as k,u as g,a as m}from"./chunks/vue-router.B0lpXBWQ.js";import{X as f,b3 as h,b_ as a,be as t,_ as n,Y as v,a5 as s,bB as y,b5 as C}from"./framework.tSB2Odh-.js";import"./app.CfWrNu88.js";import"./chunks/dayjs.BmWuu2Zz.js";import"./chunks/vue-i18n.CP2UHYEb.js";import"./chunks/pinia.BF0-M7Fk.js";import"./chunks/nprogress.YXB5kar1.js";/* empty css                    */import"./YunComment.vue_vue_type_style_index_0_lang.DoC94HOc.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.CBF25nPr.js";import"./post.TKccRjPH.js";const P=k("/posts/K8S1.27.0-deploy",async o=>JSON.parse('{"title":"K8S1.27.0集群部署要点","description":"","frontmatter":{"title":"K8S1.27.0集群部署要点","businesscard":true,"date":"2023-06-10 00:43:16","tags":["Linux","Kubernetes","云计算"],"categories":["服务器运维","云计算","k8s"],"cover":"https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg"},"headers":[],"relativePath":"pages/posts/K8S1.27.0-deploy.md","lastUpdated":1767692976000}'),{lazy:(o,i)=>o.name===i.name}),M={__name:"K8S1.27.0-deploy",setup(o,{expose:i}){const{data:r}=P(),p=g(),u=m(),c=Object.assign(u.meta.frontmatter||{},r.value?.frontmatter||{});return p.currentRoute.value.data=r.value,C("valaxy:frontmatter",c),globalThis.$frontmatter=c,i({frontmatter:{title:"K8S1.27.0集群部署要点",businesscard:!0,date:"2023-06-10 00:43:16",tags:["Linux","Kubernetes","云计算"],categories:["服务器运维","云计算","k8s"],cover:"https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg"}}),(l,e)=>{const d=b;return h(),f(d,{frontmatter:y(c)},{"main-content-md":a(()=>[e[0]||(e[0]=n("p",null,[s("⚠️注意：本文已经严重过时且不具备任何参考价值，最新 k8s 部署请参考"),n("a",{href:"https://blog.horonlee.com/posts/ubuntu22.04-k8s-deploy",target:"_blank",rel:"noreferrer"},"Ubuntu22.04部署K8S - 皓然小站 (horonlee.com)"),n("a",{href:"./ubuntu22.04-k8s-deploy"},"ubuntu22.04-k8s-deploy")],-1)),v(" more "),e[1]||(e[1]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubeadm config images pull --kubernetes-version=v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"W0609 23:21:18.405148    2447 images.go:80] could not find officially supported version of etcd for Kubernetes v1.27.0, falling back to the nearest etcd version (3.5.7-0)")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/kube-apiserver:v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/kube-controller-manager:v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/kube-scheduler:v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/kube-proxy:v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/pause:3.9")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/etcd:3.5.7-0")]),s(`
`),n("span",{class:"line"},[n("span",null,"[config/images] Pulled registry.k8s.io/coredns/coredns:v1.10.1")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[2]||(e[2]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubeadm init --kubernetes-version=v1.27.0 --pod-network-cidr=10.224.0.0/16 --apiserver-advertise-address=192.168.1.200")]),s(`
`),n("span",{class:"line"},[n("span",null,"[init] Using Kubernetes version: v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] Running pre-flight checks")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] Pulling images required for setting up a Kubernetes cluster")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] This might take a minute or two, depending on the speed of your internet connection")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'")]),s(`
`),n("span",{class:"line"},[n("span",null,"W0609 23:23:47.717937    2546 images.go:80] could not find officially supported version of etcd for Kubernetes v1.27.0, falling back to the nearest etcd version (3.5.7-0)")]),s(`
`),n("span",{class:"line"},[n("span",null,'W0609 23:23:47.891888    2546 checks.go:835] detected that the sandbox image "registry.k8s.io/pause:3.6" of the container runtime is inconsistent with that used by kubeadm. It is recommended that using "registry.k8s.io/pause:3.9" as the CRI sandbox image.')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Using certificateDir folder "/etc/kubernetes/pki"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "ca" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "apiserver" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,"[certs] apiserver serving cert is signed for DNS names [k8s-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.1.200]")]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "apiserver-kubelet-client" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "front-proxy-ca" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "front-proxy-client" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "etcd/ca" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "etcd/server" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,"[certs] etcd/server serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.1.200 127.0.0.1 ::1]")]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "etcd/peer" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,"[certs] etcd/peer serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.1.200 127.0.0.1 ::1]")]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "etcd/healthcheck-client" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "apiserver-etcd-client" certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[certs] Generating "sa" key and public key')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubeconfig] Using kubeconfig folder "/etc/kubernetes"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubeconfig] Writing "admin.conf" kubeconfig file')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubeconfig] Writing "kubelet.conf" kubeconfig file')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubeconfig] Writing "controller-manager.conf" kubeconfig file')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubeconfig] Writing "scheduler.conf" kubeconfig file')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"')]),s(`
`),n("span",{class:"line"},[n("span",null,"[kubelet-start] Starting the kubelet")]),s(`
`),n("span",{class:"line"},[n("span",null,'[control-plane] Using manifest folder "/etc/kubernetes/manifests"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[control-plane] Creating static Pod manifest for "kube-apiserver"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[control-plane] Creating static Pod manifest for "kube-controller-manager"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[control-plane] Creating static Pod manifest for "kube-scheduler"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"')]),s(`
`),n("span",{class:"line"},[n("span",null,"W0609 23:23:52.692177    2546 images.go:80] could not find officially supported version of etcd for Kubernetes v1.27.0, falling back to the nearest etcd version (3.5.7-0)")]),s(`
`),n("span",{class:"line"},[n("span",null,'[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s')]),s(`
`),n("span",{class:"line"},[n("span",null,"[apiclient] All control plane components are healthy after 10.502621 seconds")]),s(`
`),n("span",{class:"line"},[n("span",null,'[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster')]),s(`
`),n("span",{class:"line"},[n("span",null,"[upload-certs] Skipping phase. Please see --upload-certs")]),s(`
`),n("span",{class:"line"},[n("span",null,"[mark-control-plane] Marking the node k8s-master as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]")]),s(`
`),n("span",{class:"line"},[n("span",null,"[mark-control-plane] Marking the node k8s-master as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]")]),s(`
`),n("span",{class:"line"},[n("span",null,"[bootstrap-token] Using token: ux83mg.qlhot371w5rtub2u")]),s(`
`),n("span",{class:"line"},[n("span",null,"[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles")]),s(`
`),n("span",{class:"line"},[n("span",null,"[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes")]),s(`
`),n("span",{class:"line"},[n("span",null,"[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials")]),s(`
`),n("span",{class:"line"},[n("span",null,"[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token")]),s(`
`),n("span",{class:"line"},[n("span",null,"[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster")]),s(`
`),n("span",{class:"line"},[n("span",null,'[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key')]),s(`
`),n("span",{class:"line"},[n("span",null,"[addons] Applied essential addon: CoreDNS")]),s(`
`),n("span",{class:"line"},[n("span",null,"[addons] Applied essential addon: kube-proxy")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"Your Kubernetes control-plane has initialized successfully!")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"To start using your cluster, you need to run the following as a regular user:")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  mkdir -p $HOME/.kube")]),s(`
`),n("span",{class:"line"},[n("span",null,"  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config")]),s(`
`),n("span",{class:"line"},[n("span",null,"  sudo chown $(id -u):$(id -g) $HOME/.kube/config")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"Alternatively, if you are the root user, you can run:")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"  export KUBECONFIG=/etc/kubernetes/admin.conf")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"You should now deploy a pod network to the cluster.")]),s(`
`),n("span",{class:"line"},[n("span",null,'Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:')]),s(`
`),n("span",{class:"line"},[n("span",null,"  https://kubernetes.io/docs/concepts/cluster-administration/addons/")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"Then you can join any number of worker nodes by running the following on each as root:")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"kubeadm join 192.168.1.200:6443 --token ux83mg.qlhot371w5rtub2u \\")]),s(`
`),n("span",{class:"line"},[n("span",null,"        --discovery-token-ca-cert-hash sha256:7adc6b2a7551f204371d38c6a6da34d7deb321fda863b54bfe2b4d9b1811f680")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[3]||(e[3]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-worker ~]# kubeadm join 192.168.1.200:6443 --token ux83mg.qlhot371w5rtub2u \\")]),s(`
`),n("span",{class:"line"},[n("span",null,"        --discovery-token-ca-cert-hash sha256:7adc6b2a7551f204371d38c6a6da34d7deb321fda863b54bfe2b4d9b1811f680")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] Running pre-flight checks")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] Reading configuration from the cluster...")]),s(`
`),n("span",{class:"line"},[n("span",null,"[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'")]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"')]),s(`
`),n("span",{class:"line"},[n("span",null,'[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"')]),s(`
`),n("span",{class:"line"},[n("span",null,"[kubelet-start] Starting the kubelet")]),s(`
`),n("span",{class:"line"},[n("span",null,"[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"This node has joined the cluster:")]),s(`
`),n("span",{class:"line"},[n("span",null,"* Certificate signing request was sent to apiserver and a response was received.")]),s(`
`),n("span",{class:"line"},[n("span",null,"* The Kubelet was informed of the new secure connection details.")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"Run 'kubectl get nodes' on the control-plane to see this node join the cluster.")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[4]||(e[4]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get node # 这里是因为需要管理权限的环境变量才可以执行管理命令，这一点和OpenStack十分相似")]),s(`
`),n("span",{class:"line"},[n("span",null,`E0609 23:28:28.548179    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),s(`
`),n("span",{class:"line"},[n("span",null,`E0609 23:28:28.548907    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),s(`
`),n("span",{class:"line"},[n("span",null,`E0609 23:28:28.550827    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),s(`
`),n("span",{class:"line"},[n("span",null,`E0609 23:28:28.552839    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),s(`
`),n("span",{class:"line"},[n("span",null,`E0609 23:28:28.554668    3302 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused`)]),s(`
`),n("span",{class:"line"},[n("span",null,"The connection to the server localhost:8080 was refused - did you specify the right host or port?")]),s(`
`),n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# export KUBECONFIG=/etc/kubernetes/admin.conf")]),s(`
`),n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get node")]),s(`
`),n("span",{class:"line"},[n("span",null,"NAME         STATUS     ROLES           AGE     VERSION")]),s(`
`),n("span",{class:"line"},[n("span",null,"k8s-master   NotReady   control-plane   4m42s   v1.27.0")]),s(`
`),n("span",{class:"line"},[n("span",null,"k8s-worker   NotReady   <none>          48s     v1.27.0")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[5]||(e[5]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"vim /etc/containerd/config.toml")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,'未更改：sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"')])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[6]||(e[6]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl apply -f calico.yaml")]),s(`
`),n("span",{class:"line"},[n("span",null,"poddisruptionbudget.policy/calico-kube-controllers created")]),s(`
`),n("span",{class:"line"},[n("span",null,"serviceaccount/calico-kube-controllers created")]),s(`
`),n("span",{class:"line"},[n("span",null,"serviceaccount/calico-node created")]),s(`
`),n("span",{class:"line"},[n("span",null,"configmap/calico-config created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/caliconodestatuses.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/ipreservations.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/kubecontrollersconfigurations.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrole.rbac.authorization.k8s.io/calico-kube-controllers created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrole.rbac.authorization.k8s.io/calico-node created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrolebinding.rbac.authorization.k8s.io/calico-kube-controllers created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrolebinding.rbac.authorization.k8s.io/calico-node created")]),s(`
`),n("span",{class:"line"},[n("span",null,"daemonset.apps/calico-node created")]),s(`
`),n("span",{class:"line"},[n("span",null,"deployment.apps/calico-kube-controllers created")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[7]||(e[7]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get pod -n kube-system")]),s(`
`),n("span",{class:"line"},[n("span",null,"NAME                                       READY   STATUS     RESTARTS   AGE")]),s(`
`),n("span",{class:"line"},[n("span",null,"calico-kube-controllers-6849cf9bcf-gsbzr   0/1     Pending    0          30s")]),s(`
`),n("span",{class:"line"},[n("span",null,"calico-node-bdshx                          0/1     Init:0/3   0          30s")]),s(`
`),n("span",{class:"line"},[n("span",null,"calico-node-mmjfl                          0/1     Init:0/3   0          30s")]),s(`
`),n("span",{class:"line"},[n("span",null,"coredns-5d78c9869d-spj6w                   0/1     Pending    0          16m")]),s(`
`),n("span",{class:"line"},[n("span",null,"coredns-5d78c9869d-td7nt                   0/1     Pending    0          16m")]),s(`
`),n("span",{class:"line"},[n("span",null,"etcd-k8s-master                            1/1     Running    0          16m")]),s(`
`),n("span",{class:"line"},[n("span",null,"kube-apiserver-k8s-master                  1/1     Running    0          16m")]),s(`
`),n("span",{class:"line"},[n("span",null,"kube-controller-manager-k8s-master         1/1     Running    0          16m")]),s(`
`),n("span",{class:"line"},[n("span",null,"kube-proxy-sfkrl                           1/1     Running    0          16m")]),s(`
`),n("span",{class:"line"},[n("span",null,"kube-proxy-wm8mk                           1/1     Running    0          12m")]),s(`
`),n("span",{class:"line"},[n("span",null,"kube-scheduler-k8s-master                  1/1     Running    0          16m")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[8]||(e[8]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl apply -f dashboard.yaml")]),s(`
`),n("span",{class:"line"},[n("span",null,"namespace/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"serviceaccount/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"service/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"secret/kubernetes-dashboard-certs created")]),s(`
`),n("span",{class:"line"},[n("span",null,"secret/kubernetes-dashboard-csrf created")]),s(`
`),n("span",{class:"line"},[n("span",null,"secret/kubernetes-dashboard-key-holder created")]),s(`
`),n("span",{class:"line"},[n("span",null,"configmap/kubernetes-dashboard-settings created")]),s(`
`),n("span",{class:"line"},[n("span",null,"role.rbac.authorization.k8s.io/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"deployment.apps/kubernetes-dashboard created")]),s(`
`),n("span",{class:"line"},[n("span",null,"service/dashboard-metrics-scraper created")]),s(`
`),n("span",{class:"line"},[n("span",null,"deployment.apps/dashboard-metrics-scraper created")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[9]||(e[9]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get pod -n kubernetes-dashboard -o wide")]),s(`
`),n("span",{class:"line"},[n("span",null,"NAME                                         READY   STATUS             RESTARTS   AGE   IP               NODE         NOMINATED NODE   READINESS GATES")]),s(`
`),n("span",{class:"line"},[n("span",null,"dashboard-metrics-scraper-5cb4f4bb9c-tvqlt   0/1     ImagePullBackOff   0          26s   10.224.254.132   k8s-worker   <none>           <none>")]),s(`
`),n("span",{class:"line"},[n("span",null,"kubernetes-dashboard-6967859bff-nrtsl        0/1     ImagePullBackOff   0          26s   10.224.254.133   k8s-worker   <none>           <none>")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[10]||(e[10]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get svc -n kubernetes-dashboard")]),s(`
`),n("span",{class:"line"},[n("span",null,"NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE")]),s(`
`),n("span",{class:"line"},[n("span",null,"dashboard-metrics-scraper   ClusterIP   10.106.18.213   <none>        8000/TCP   2m5s")]),s(`
`),n("span",{class:"line"},[n("span",null,"kubernetes-dashboard        ClusterIP   10.103.7.49     <none>        443/TCP    2m6s")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[11]||(e[11]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard")]),s(`
`),n("span",{class:"line"},[n("span",null,"service/kubernetes-dashboard edited # 将ClusterIP 改为NodePort")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[12]||(e[12]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get svc -n kubernetes-dashboard")]),s(`
`),n("span",{class:"line"},[n("span",null,"NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE")]),s(`
`),n("span",{class:"line"},[n("span",null,"dashboard-metrics-scraper   ClusterIP   10.106.18.213   <none>        8000/TCP        3m40s")]),s(`
`),n("span",{class:"line"},[n("span",null,"kubernetes-dashboard        NodePort    10.103.7.49     <none>        443:30571/TCP   3m41s")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[13]||(e[13]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl apply -f dashboard-user.yaml")]),s(`
`),n("span",{class:"line"},[n("span",null,"serviceaccount/admin-user created")]),s(`
`),n("span",{class:"line"},[n("span",null,"clusterrolebinding.rbac.authorization.k8s.io/admin-user created")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[14]||(e[14]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl -n kubernetes-dashboard create token admin-user")]),s(`
`),n("span",{class:"line"},[n("span",null,"eyJhbGciOiJSUzI1NiIsImtpZCI6InVCZUlsckJGWUZoMTJfRDA2eVFsMm85d3lEYml4WmQxV2RmNGtNWGlzZUEifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNjg2MzI1NzA3LCJpYXQiOjE2ODYzMjIxMDcsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJhZG1pbi11c2VyIiwidWlkIjoiYzAzOTI4OWEtMTc1MS00ZDY3LWFiNTgtMzE2ZTYzNWQ3NWEzIn19LCJuYmYiOjE2ODYzMjIxMDcsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlcm5ldGVzLWRhc2hib2FyZDphZG1pbi11c2VyIn0.BOa9nhIPfx_qWoQOn8hbfA70Y2fIeO_xcjK5wJJdrgS2yeSFIqD07LwHyw6eT9a03leNUaSA6gj3kYeAQnbCpw8pacdGJAaBBL-Y6Y31p4uVNSH9bs9TJuVAGyfKzJ4G8eyj3bZ11PlEtLNXeCr7bB_tO_8Z93lCK-F8h9VfQV5TGxCRAmjWXX3c1tpox236lIVsDA8UC8LqrWO4TW5p22om5ES9RsgVypoYQPwZ0O7hy9k_7mMe2Nh2hdiibhuezwGcm2fl_fgBsK9REaer0NZF420p1crxUBiE0LfxfvgTTGHAnbwWlw_M2pFehvx82Lx6jmduNnq-0cPcReb4cw")])])]),n("button",{class:"code-block-unfold-btn"})],-1)),e[15]||(e[15]=n("p",null,"访问Web页面相关问题，Web页面的端口是随机的，需要手动查看容器状态，可以看到下面dashboard映射出来的端口是30571",-1)),e[16]||(e[16]=n("div",{class:"language-"},[n("button",{title:"Copy code",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[n("code",{"v-pre":""},[n("span",{class:"line"},[n("span",null,"[root@k8s-master ~]# kubectl get svc -A -o wide")]),s(`
`),n("span",{class:"line"},[n("span",null,"NAMESPACE              NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE   SELECTOR")]),s(`
`),n("span",{class:"line"},[n("span",null,"default                kubernetes                  ClusterIP   10.96.0.1       <none>        443/TCP                  32m   <none>")]),s(`
`),n("span",{class:"line"},[n("span",null,"kube-system            kube-dns                    ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   32m   k8s-app=kube-dns")]),s(`
`),n("span",{class:"line"},[n("span",null,"kubernetes-dashboard   dashboard-metrics-scraper   ClusterIP   10.106.18.213   <none>        8000/TCP                 12m   k8s-app=dashboard-metrics-scraper")]),s(`
`),n("span",{class:"line"},[n("span",null,"kubernetes-dashboard   kubernetes-dashboard        NodePort    10.103.7.49     <none>        443:30571/TCP            13m   k8s-app=kubernetes-dashboard")])])]),n("button",{class:"code-block-unfold-btn"})],-1))]),"main-header":a(()=>[t(l.$slots,"main-header")]),"main-header-after":a(()=>[t(l.$slots,"main-header-after")]),"main-nav":a(()=>[t(l.$slots,"main-nav")]),"main-content-before":a(()=>[t(l.$slots,"main-content-before")]),"main-content":a(()=>[t(l.$slots,"main-content")]),"main-content-after":a(()=>[t(l.$slots,"main-content-after")]),"main-nav-before":a(()=>[t(l.$slots,"main-nav-before")]),"main-nav-after":a(()=>[t(l.$slots,"main-nav-after")]),comment:a(()=>[t(l.$slots,"comment")]),footer:a(()=>[t(l.$slots,"footer")]),aside:a(()=>[t(l.$slots,"aside")]),"aside-custom":a(()=>[t(l.$slots,"aside-custom")]),default:a(()=>[t(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{M as default,P as usePageData};
