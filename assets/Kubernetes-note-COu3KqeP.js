import{_ as d}from"./ValaxyMain.vue_vue_type_style_index_0_lang-DDCvNgxk.js";import{c as g,w as a,f as o,e as c,p as r,o as y,g as i,h as s,r as t}from"./app-9VzoTw0V.js";import"./YunComment.vue_vue_type_style_index_0_lang-DWsj5PCs.js";import"./index-C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang-Ckhr63jS.js";import"./post-BQ4lb_uo.js";const A={__name:"Kubernetes-note",setup(E,{expose:F}){const e=JSON.parse('{"title":"初试Kubernetes笔记","description":"","frontmatter":{"title":"初试Kubernetes笔记","date":"2023-04-04 13:27:28","tags":["Linux","Kubernetes","云计算"],"categories":["服务器运维","云计算","k8s"],"cover":"https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg"},"headers":[],"relativePath":"pages/posts/Kubernetes-note.md","path":"/home/runner/work/horonlee.github.io/horonlee.github.io/pages/posts/Kubernetes-note.md","lastUpdated":1734628163000}'),k=c(),h=e.frontmatter||{};return k.meta.frontmatter=Object.assign(k.meta.frontmatter||{},e.frontmatter||{}),r("pageData",e),r("valaxy:frontmatter",h),globalThis.$frontmatter=h,F({frontmatter:{title:"初试Kubernetes笔记",date:"2023-04-04 13:27:28",tags:["Linux","Kubernetes","云计算"],categories:["服务器运维","云计算","k8s"],cover:"https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg"}}),(l,n)=>{const p=d;return y(),g(p,{frontmatter:o(h)},{"main-content-md":a(()=>n[0]||(n[0]=[i("h1",{id:"关于k8s镜像的下载",tabindex:"-1"},[s("关于k8s镜像的下载 "),i("a",{class:"header-anchor",href:"#关于k8s镜像的下载","aria-label":'Permalink to "关于k8s镜像的下载"'},"​")],-1),i("blockquote",null,[i("p",null,"说实话我真的吐了，没有科学上网真的寸步难行，没办法直接拉取k8s.gcr.io的镜像，所以只能先用阿里云的 但是后续的安装没办法直接使用阿里云的镜像，所以还得改tag")],-1),i("p",null,[s("有个小坑，k8s官方镜像的coredns是"),i("code",null,"k8s.gcr.io/coredns/coredns:v1.8.6"),s("而阿里的却是"),i("code",null,"registry.aliyuncs.com/google_containers/coredns:v1.8.6"),s("，官方的多套了一层"),i("code",null,"/coredns"),s("，这直接导致我研究了半天"),i("code",null,"报错 pull access denied"),s("，我发现后就把阿里的镜像给删掉了一层。")],-1),i("p",null,"因为总共要下载7个镜像（master节点），所以我打算写一个shell脚本来批量操作，经过一番高强度网上冲浪，我给整出来了：",-1),i("div",{class:"language-shell vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"shell"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}}," #!/bin/bash")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"images_list"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/kube-apiserver:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/kube-controller-manager:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/kube-scheduler:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/kube-proxy:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/pause:3.7")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/etcd:3.5.3-0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"k8s.gcr.io/coredns/coredns:v1.8.6")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ali_images_list"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/kube-apiserver:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/kube-controller-manager:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/kube-scheduler:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/kube-proxy:v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/pause:3.7")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/etcd:3.5.3-0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"registry.aliyuncs.com/google_containers/coredns:v1.8.6")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 批量下载阿里镜像并且更改tag为k8s标准镜像")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $ali_images_list")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"do")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        docker"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," pull"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $i")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        for"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," j "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $images_list")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        do")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"                docker"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," tag"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $i $j")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"        done")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"done")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 删除阿里镜像")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," i "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"in"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $ali_images_list")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"do")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        docker"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," image"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," rm"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $i")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"done")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 导出k8s镜像为tar包")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"docker"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," save"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," -o"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," k8s-1-24-0.tar"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $images_list")])])]),i("button",{class:"collapse"})],-1),i("p",null,"第一次写脚本这样应该很不错了吧（汗",-1),i("h1",{id:"关于kubeadm-init的报错",tabindex:"-1"},[s("关于kubeadm init的报错 "),i("a",{class:"header-anchor",href:"#关于kubeadm-init的报错","aria-label":'Permalink to "关于kubeadm init的报错"'},"​")],-1),i("blockquote",null,[i("p",null,[s("先前安装的kubeadm等组件使用了"),i("code",null,"yum -y install kubeadm kubelet kubectl"),s("，默认版本比较高 所以引发了下面一系列错误")])],-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[root@k8s-master01 "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"~"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]# kubeadm init --kubernetes-version"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"v1.24.0"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," --pod-network-cidr"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"10.224.0.0/16"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," --apiserver-advertise-address"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"192.168.100.100"),i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"  --cri-socket"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," unix:///var/run/cri-dockerd.sock")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"this"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," version"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," of"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," kubeadm"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," only"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," supports"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," deploying"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," clusters"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," with"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," control"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," plane"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," version"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," >"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 1.25.0."),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," Current"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," version:"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"To"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," see"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," stack"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," trace"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," of"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," this"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," error"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," execute"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," with"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," --v=5"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," or"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," higher")])])]),i("button",{class:"collapse"})],-1),i("p",null,"需要版本高于v1.25.0的control plane，但是我升级了组件镜像为v1.25.0也同样报错！ 所以我采用指定yum安装kubeadm、kubelet和kubectl：",-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[root@k8s-master01 "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"~"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]# yum -y remove  kubeadm  kubelet kubectl")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[root@k8s-master01 "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"~"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]# yum install -y kubelet-1.25.0 kubeadm-1.25.0 kubectl-1.25.0")])])]),i("button",{class:"collapse"})],-1),i("p",null,"不出意外又是报错",-1),i("div",{class:"language- vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"}),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",null,"[preflight] Running pre-flight checks")]),s(`
`),i("span",{class:"line"},[i("span",null,"error execution phase preflight: [preflight] Some fatal errors occurred:")]),s(`
`),i("span",{class:"line"},[i("span",null,'        [ERROR KubeletVersion]: the kubelet version is higher than the control plane version. This is not a supported version skew and may lead to a malfunctional cluster. Kubelet version: "1.25.0" Control plane version: "1.24.0"')]),s(`
`),i("span",{class:"line"},[i("span",null,"[preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`")]),s(`
`),i("span",{class:"line"},[i("span",null,"To see the stack trace of this error execute with --v=5 or higher")])])]),i("button",{class:"collapse"})],-1),i("p",null,"意思是kubeadm还是高于panel组件的版本，这里我尝试降级kubeadm、kubelet和kubectl：",-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[root@k8s-master01 "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"~"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]# yum remove -y kubelet-1.25.0 kubeadm-1.25.0 kubectl-1.25.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[root@k8s-master01 "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"~"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"]# yum install -y kubelet-1.24.0 kubeadm-1.24.0 kubectl-1.24.0")])])]),i("button",{class:"collapse"})],-1),i("p",null,"更换kubeadm、kubelet、kubectl版本为v1.24.0之后：",-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[init] Using Kubernetes version: v1.24.0")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[preflight] Running pre-flight checks")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[preflight] Pulling images required "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," setting up a Kubernetes cluster")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[preflight] This might take a minute or two, depending on the speed of your internet connection")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[preflight] You can also perform this action in beforehand using "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'kubeadm config images pull'")])])]),i("button",{class:"collapse"})],-1),i("p",null,"这里问题不大，我一开始拉了一点v1.25.0的镜像，我给全部换成v1.24.0就好了 PS：记得再次修改配置：",-1),i("div",{class:"language-vim vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"vim"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"#"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," vim "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#DBEDFF"}},"/etc/"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"sysconfig/kubelet")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"KUBELET_EXTRA_ARGS"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"--cgroup-driver=systemd"')]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"systemctl enable kubelet")])])]),i("button",{class:"collapse"})],-1),i("p",null,"然后就可以正常初始化了…吗？",-1),i("div",{class:"language-bash vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"bash"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",{"v-pre":""},[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[wait-control-plane] Waiting "),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," the kubelet to boot up the control plane as static Pods from directory "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"/etc/kubernetes/manifests"'),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},". This can take up to 4m0s")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[kubelet-check] Initial timeout of 40s passed.")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Unfortunately,"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," an"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," error"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," has"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," occurred:")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        timed"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," out"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," waiting"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," for"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," condition")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"This"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," error"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," is"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," likely"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," caused"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," by:")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        -"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," The"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," kubelet"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," is"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," not"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," running")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        -"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," The"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," kubelet"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," is"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," unhealthy"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," due"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," to"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," a"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," misconfiguration"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," of"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," node"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," in"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," some"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," way"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," (required "),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"cgroups"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," disabled"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"If"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," you"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," are"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," on"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," a"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," systemd-powered"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," system,"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," you"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," can"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," try"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," to"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," troubleshoot"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," error"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," with"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," following"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," commands:")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        -"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'systemctl status kubelet'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        -"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'journalctl -xeu kubelet'")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Additionally,"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," a"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," control"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," plane"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," component"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," may"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," have"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," crashed"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," or"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," exited"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," when"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," started"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," by"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," container"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," runtime.")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"To"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," troubleshoot,"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," list"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," all"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," containers"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," using"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," your"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," preferred"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," container"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," runtimes"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," CLI.")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"Here"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," is"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," one"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," example"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," how"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," you"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," may"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," list"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," all"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," running"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," Kubernetes"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," containers"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," by"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," using"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," crictl:")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        -"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'crictl --runtime-endpoint unix:///var/run/cri-dockerd.sock ps -a | grep kube | grep -v pause'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        Once"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," you"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," have"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," found"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," the"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," failing"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," container,"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," you"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," can"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," inspect"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," its"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," logs"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," with:")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"        -"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," 'crictl --runtime-endpoint unix:///var/run/cri-dockerd.sock logs CONTAINERID'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"error"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," execution"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," phase"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," wait-control-plane:"),i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}}," couldn't initialize a Kubernetes cluster")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"To see the stack trace of this error execute with --v=5 or higher")])])]),i("button",{class:"collapse"})],-1),i("p",null,"初始化control-plane超时了 至此，问题还没有解决。",-1)])),"main-header":a(()=>[t(l.$slots,"main-header")]),"main-header-after":a(()=>[t(l.$slots,"main-header-after")]),"main-nav":a(()=>[t(l.$slots,"main-nav")]),"main-content":a(()=>[t(l.$slots,"main-content")]),"main-content-after":a(()=>[t(l.$slots,"main-content-after")]),"main-nav-before":a(()=>[t(l.$slots,"main-nav-before")]),"main-nav-after":a(()=>[t(l.$slots,"main-nav-after")]),comment:a(()=>[t(l.$slots,"comment")]),footer:a(()=>[t(l.$slots,"footer")]),aside:a(()=>[t(l.$slots,"aside")]),"aside-custom":a(()=>[t(l.$slots,"aside-custom")]),default:a(()=>[t(l.$slots,"default")]),_:3},8,["frontmatter"])}}};export{A as default};