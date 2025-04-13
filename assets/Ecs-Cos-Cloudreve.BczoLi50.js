import{_ as p}from"./ValaxyMain.vue_vue_type_style_index_0_lang.Df4hUQqr.js";import"./chunks/@vueuse/motion.n2Jr4alk.js";import{f as E,a as g,u as m}from"./chunks/vue-router.CPBYBm_A.js";import{a9 as y,ak as i,ac as t,ad as l,ah as s,w as v,aa as f,a0 as b}from"./framework.Du602yaV.js";import"./app.BVc48gHk.js";import"./chunks/dayjs.Byk5cVHE.js";import"./chunks/vue-i18n.tc_21sJ3.js";import"./chunks/nprogress.COTDXfmE.js";import"./chunks/pinia.Dv8YzA9U.js";import"./YunComment.vue_vue_type_style_index_0_lang.ChFfEBRg.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.ByDG0GMN.js";import"./post.v6HiTWE1.js";const _=E("/posts/Ecs-Cos-Cloudreve",async n=>JSON.parse('{"title":"Ecs+Cos+Cloudreve","description":null,"frontmatter":{"title":"Ecs+Cos+Cloudreve","businesscard":true,"date":"2023-04-03 18:33:39","updated":null,"tags":["CentOS","Linux","Cloudreve","COS"],"categories":["对象存储"],"keywords":null,"description":null,"top_img":null,"comments":null,"cover":"https://img.81857.net/2020/0707/20200707024741450.jpg","toc":null,"toc_number":null,"toc_style_simple":null,"copyright":null,"copyright_author":null,"copyright_author_href":null,"copyright_url":null,"copyright_info":null,"mathjax":null,"katex":null,"aplayer":null,"highlight_shrink":null,"aside":null,"swiper_index":null},"headers":[],"relativePath":"pages/posts/Ecs-Cos-Cloudreve.md","lastUpdated":1744547369000}'),{lazy:(n,r)=>n.name===r.name}),q={__name:"Ecs-Cos-Cloudreve",setup(n,{expose:r}){var u;const{data:o}=_(),k=m(),h=g(),a=Object.assign(h.meta.frontmatter||{},((u=o.value)==null?void 0:u.frontmatter)||{});return h.meta.frontmatter=a,k.currentRoute.value.data=o.value,b("valaxy:frontmatter",a),globalThis.$frontmatter=a,r({frontmatter:{title:"Ecs+Cos+Cloudreve",businesscard:!0,date:"2023-04-03 18:33:39",updated:null,tags:["CentOS","Linux","Cloudreve","COS"],categories:["对象存储"],keywords:null,description:null,top_img:null,comments:null,cover:"https://img.81857.net/2020/0707/20200707024741450.jpg",toc:null,toc_number:null,toc_style_simple:null,copyright:null,copyright_author:null,copyright_author_href:null,copyright_url:null,copyright_info:null,mathjax:null,katex:null,aplayer:null,highlight_shrink:null,aside:null,swiper_index:null}}),(e,d)=>{const c=p;return f(),y(c,{frontmatter:v(a)},{"main-content-md":i(()=>d[0]||(d[0]=[l("h1",{id:"下载安装cloudreve",tabindex:"-1"},[s("下载安装Cloudreve "),l("a",{class:"header-anchor",href:"#下载安装cloudreve","aria-label":'Permalink to "下载安装Cloudreve"'},"​")],-1),l("blockquote",null,[l("p",null,"这里我选用的是阿里云的Ecs轻应用 并且不是使用Docker来部署（那也太傻瓜操作了吧😂")],-1),l("ol",null,[l("li",null,"登录到Shell终端"),l("li",null,[s("部署"),l("a",{href:"https://cloudreve.org/",target:"_blank",rel:"noreferrer"},"Cloudreve"),s("云盘软件")]),l("li",null,[s("下载Cloudreve-3.7.1软件包👉"),l("a",{href:"https://github.com/cloudreve/Cloudreve/releases/tag/3.7.1",target:"_blank",rel:"noreferrer"},"GitHub-Release"),s("，记得选择Linux、amd64版的tar.gz包（cloudreve_3.7.1_linux_amd64.tar.gz），下载后上传到服务器的某个目录")]),l("li",null,"cd进上传软件包的目录"),l("li",null,[s("解压文件"),l("code",null,"tar -xvzf cloudreve_3.7.1_linux_amd64.tar.gz")]),l("li",null,[s("解压之后文件应该全部在当前目录，现在给予运行权限"),l("code",null,"chmod +x ./cloudreve")]),l("li",null,[s("现在理论上可以直接运行Cloudreve了"),l("code",null,"./cloudreve"),s("，运行成功之后会显示初始账号密码，访问网页的地址就是http://"),l("em",null,"$IP"),s(":5212（记得在服务器安全组开启5212的端口放行）。")])],-1),l("blockquote",null,[l("p",null,[s("但是为了以后方便开机自启和软件后台运行，我们需要为它配置"),l("a",{href:"https://blog.csdn.net/lianghe_work/article/details/47659889",target:"_blank",rel:"noreferrer"},"守护进程")])],-1),l("p",null,[s("登录进去的主页大概是张这样的（我改了一些配色啥的）："),l("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312115454563.png",alt:"Cloudreve"})],-1),l("h1",{id:"配置守护进程",tabindex:"-1"},[s("配置守护进程 "),l("a",{class:"header-anchor",href:"#配置守护进程","aria-label":'Permalink to "配置守护进程"'},"​")],-1),l("blockquote",null,[l("p",null,"这里我们采用systemd方式（Systemctl） 还有一个叫做Supervisor的，我没用过所以不写（逊了")],-1),l("ol",null,[l("li",null,[s("编辑配置文件"),l("code",null,"vim /usr/lib/systemd/system/cloudreve.service"),s("，其中PATH_TO_CLOUDREVE替换成你cloudreve的安装目录")])],-1),l("div",{class:"language-vim vp-adaptive-theme"},[l("button",{title:"Copy Code",class:"copy"}),l("span",{class:"lang"},"vim"),l("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[l("code",{"v-pre":""},[l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[Unit]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Description"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Cloudreve")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Documentation"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"https://docs.cloudreve.org")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"After"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"network.target")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"After"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"mysqld.service")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Wants"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"network.target")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[Service]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"WorkingDirectory"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"/PATH_TO_CLOUDREVE")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ExecStart"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#DBEDFF"}},"/PATH_TO_CLOUDREVE/"),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"cloudreve")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Re"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"start="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"on-abnormal")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"RestartSec"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"5s")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"KillMode"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"mixed")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"StandardOutput"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"null")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"StandardError"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"syslog")]),s(`
`),l("span",{class:"line"}),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"[Install]")]),s(`
`),l("span",{class:"line"},[l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"WantedBy"),l("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"="),l("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"multi-user.target")])])]),l("button",{class:"collapse"})],-1),l("ol",{start:"2"},[l("li",null,[s("更新配置"),l("code",null,"systemctl daemon-reload")]),l("li",null,[s("启动服务"),l("code",null,"systemctl start cloudreve")]),l("li",null,[s("设置自启动"),l("code",null,"systemctl enable cloudreve")]),l("li",null,[s("查看进程状态和部分log"),l("code",null,"systemctl status cloudreve")])],-1),l("h1",{id:"使用nginx配置反向代理",tabindex:"-1"},[s("使用Nginx配置反向代理 "),l("a",{class:"header-anchor",href:"#使用nginx配置反向代理","aria-label":'Permalink to "使用Nginx配置反向代理"'},"​")],-1),l("blockquote",null,[l("p",null,"我也想，但是考虑到国内服务器备案变严格了，非80、443端口也没办法用域名直接访问了，所以就作此就罢。")],-1),l("h1",{id:"连接到腾讯cos对象储存",tabindex:"-1"},[s("连接到腾讯Cos对象储存 "),l("a",{class:"header-anchor",href:"#连接到腾讯cos对象储存","aria-label":'Permalink to "连接到腾讯Cos对象储存"'},"​")],-1),l("p",null,[s("直接看"),l("a",{href:"https://cloud.tencent.com/developer/article/2041954",target:"_blank",rel:"noreferrer"},"这篇文章"),s("罢，一路没什么好说的。 配置完cos储存策略后，记得设置你所在的用户组的储存策略为cos的，然后上传一个文件试试，如果没问问题就会呈现以下效果： "),l("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312115457671.png",alt:"Cloudreve+cos"})],-1),l("h1",{id:"使用宝塔面板nginx的重定向或者反向代理代理ip-端口的访问方式",tabindex:"-1"},[s("使用宝塔面板Nginx的重定向或者反向代理代理IP+端口的访问方式 "),l("a",{class:"header-anchor",href:"#使用宝塔面板nginx的重定向或者反向代理代理ip-端口的访问方式","aria-label":'Permalink to "使用宝塔面板Nginx的重定向或者反向代理代理IP+端口的访问方式"'},"​")],-1),l("blockquote",null,[l("p",null,"我推荐使用重定向，因为这样不用看代理服务器的带宽，也能低成本的让我们免去记忆Cloudreve所在服务器IP的麻烦")],-1),l("p",null,[s("注意：记得取消勾选"),l("strong",null,"保留URI参数"),s("，要不然后面会多一个“/”导致直接打开的网页404。")],-1),l("figure",null,[l("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312115459942.png",alt:"宝塔设置",loading:"lazy",decoding:"async"})],-1)])),"main-header":i(()=>[t(e.$slots,"main-header")]),"main-header-after":i(()=>[t(e.$slots,"main-header-after")]),"main-nav":i(()=>[t(e.$slots,"main-nav")]),"main-content-before":i(()=>[t(e.$slots,"main-content-before")]),"main-content":i(()=>[t(e.$slots,"main-content")]),"main-content-after":i(()=>[t(e.$slots,"main-content-after")]),"main-nav-before":i(()=>[t(e.$slots,"main-nav-before")]),"main-nav-after":i(()=>[t(e.$slots,"main-nav-after")]),comment:i(()=>[t(e.$slots,"comment")]),footer:i(()=>[t(e.$slots,"footer")]),aside:i(()=>[t(e.$slots,"aside")]),"aside-custom":i(()=>[t(e.$slots,"aside-custom")]),default:i(()=>[t(e.$slots,"default")]),_:3},8,["frontmatter"])}}};export{q as default,_ as usePageData};
