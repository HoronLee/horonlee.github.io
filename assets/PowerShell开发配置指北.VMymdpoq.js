import{_ as g}from"./ValaxyMain.vue_vue_type_style_index_0_lang.Df4hUQqr.js";import"./chunks/@vueuse/motion.n2Jr4alk.js";import{f as u,a as E,u as m}from"./chunks/vue-router.CPBYBm_A.js";import{a9 as y,ak as l,ac as a,ad as s,ah as i,w as b,aa as v,a0 as w}from"./framework.Du602yaV.js";import"./app.BVc48gHk.js";import"./chunks/dayjs.Byk5cVHE.js";import"./chunks/vue-i18n.tc_21sJ3.js";import"./chunks/nprogress.COTDXfmE.js";import"./chunks/pinia.Dv8YzA9U.js";import"./YunComment.vue_vue_type_style_index_0_lang.ChFfEBRg.js";import"./index.C5okkQwF.js";import"./YunPageHeader.vue_vue_type_script_setup_true_lang.ByDG0GMN.js";import"./post.v6HiTWE1.js";const C=u("/posts/PowerShell开发配置指北",async n=>JSON.parse('{"title":"PowerShell开发配置指北","description":"","frontmatter":{"layout":"post","title":"PowerShell开发配置指北","date":"2024-10-10 14:47:39","tags":["windows","powershell"],"categories":["开发","环境配置"],"cover":"https://bu.dusays.com/2024/10/10/67077952b2f10.png","password":null,"hide":null},"headers":[{"level":2,"title":"确保安装了“终端”应用","slug":"确保安装了-终端-应用","link":"#确保安装了-终端-应用","children":[]},{"level":2,"title":"安装PowerShell7","slug":"安装powershell7","link":"#安装powershell7","children":[{"level":3,"title":"下载PowerShell7安装包","slug":"下载powershell7安装包","link":"#下载powershell7安装包","children":[]},{"level":3,"title":"配置终端默认使用PowerShell7","slug":"配置终端默认使用powershell7","link":"#配置终端默认使用powershell7","children":[]}]},{"level":2,"title":"安装Scoop","slug":"安装scoop","link":"#安装scoop","children":[]},{"level":2,"title":"安装Oh My Posh","slug":"安装oh-my-posh","link":"#安装oh-my-posh","children":[{"level":3,"title":"安装Nerd Font","slug":"安装nerd-font","link":"#安装nerd-font","children":[]},{"level":3,"title":"设置前置组件","slug":"设置前置组件","link":"#设置前置组件","children":[]}]},{"level":2,"title":"配置Oh My Posh","slug":"配置oh-my-posh","link":"#配置oh-my-posh","children":[{"level":3,"title":"配置主题","slug":"配置主题","link":"#配置主题","children":[]}]},{"level":2,"title":"配置 VS code","slug":"配置-vs-code","link":"#配置-vs-code","children":[]},{"level":2,"title":"安装NeoVim","slug":"安装neovim","link":"#安装neovim","children":[{"level":3,"title":"安装LazyVim","slug":"安装lazyvim","link":"#安装lazyvim","children":[]}]},{"level":2,"title":"给LazyVim添加编程语言插件","slug":"给lazyvim添加编程语言插件","link":"#给lazyvim添加编程语言插件","children":[]}],"relativePath":"pages/posts/PowerShell开发配置指北.md","lastUpdated":1744547369000}'),{lazy:(n,h)=>n.name===h.name}),V={__name:"PowerShell开发配置指北",setup(n,{expose:h}){var p;const{data:o}=C(),c=m(),r=E(),t=Object.assign(r.meta.frontmatter||{},((p=o.value)==null?void 0:p.frontmatter)||{});return r.meta.frontmatter=t,c.currentRoute.value.data=o.value,w("valaxy:frontmatter",t),globalThis.$frontmatter=t,h({frontmatter:{layout:"post",title:"PowerShell开发配置指北",date:"2024-10-10 14:47:39",tags:["windows","powershell"],categories:["开发","环境配置"],cover:"https://bu.dusays.com/2024/10/10/67077952b2f10.png",password:null,hide:null}}),(e,k)=>{const d=g;return v(),y(d,{frontmatter:b(t)},{"main-content-md":l(()=>k[0]||(k[0]=[s("h2",{id:"确保安装了-终端-应用",tabindex:"-1"},[i("确保安装了“终端”应用 "),s("a",{class:"header-anchor",href:"#确保安装了-终端-应用","aria-label":'Permalink to "确保安装了“终端”应用"'},"​")],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120242562.png",alt:"image-20241010151031530",loading:"lazy",decoding:"async"})],-1),s("p",null,"这是必须的，windows11之前的“命令行”应用并不好用，色彩支持少、不支持多标签、自定义程度也非常低，所以我们需要使用微软最新推出的终端应用",-1),s("h2",{id:"安装powershell7",tabindex:"-1"},[i("安装PowerShell7 "),s("a",{class:"header-anchor",href:"#安装powershell7","aria-label":'Permalink to "安装PowerShell7"'},"​")],-1),s("blockquote",null,[s("p",null,"windows11自带的是PowerShell5，比较老，有些新功能没有，所以最好安装PowerShell7来对未来有更好的功能支持。"),s("p",null,"PS：下文基于PowerShell5编写，与PowerShell7无差别")],-1),s("h3",{id:"下载powershell7安装包",tabindex:"-1"},[i("下载PowerShell7安装包 "),s("a",{class:"header-anchor",href:"#下载powershell7安装包","aria-label":'Permalink to "下载PowerShell7安装包"'},"​")],-1),s("p",null,[s("a",{href:"https://learn.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4#msi",target:"_blank",rel:"noreferrer"},"在 Windows 上安装 PowerShell - PowerShell | Microsoft Learn")],-1),s("p",null,"上方链接指向微软的安装教程，使用其中的GitHub链接即可下载安装包",-1),s("p",null,"下载后，双击安装程序文件并按照提示进行操作。",-1),s("p",null,"安装程序在 Windows“开始”菜单中创建一个快捷方式。",-1),s("ul",null,[s("li",null,[i("默认情况下，包安装位置为 "),s("code",null,"$env:ProgramFiles\\PowerShell\\<version>")]),s("li",null,[i("可以通过“开始”菜单或 "),s("code",null,"$env:ProgramFiles\\PowerShell\\<version>\\pwsh.exe"),i(" 启动 PowerShell")])],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120245502.png",alt:"e33ad1e7d5ab7da80b4ba47db8376c95",loading:"lazy",decoding:"async"})],-1),s("h3",{id:"配置终端默认使用powershell7",tabindex:"-1"},[i("配置终端默认使用PowerShell7 "),s("a",{class:"header-anchor",href:"#配置终端默认使用powershell7","aria-label":'Permalink to "配置终端默认使用PowerShell7"'},"​")],-1),s("p",null,"如果PowerShell7安装成功，则在终端程序中会自动添加新的图标的PowerShell配置文件",-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120247707.png",alt:"image-20241011155754946",loading:"lazy",decoding:"async"})],-1),s("p",null,[i("如果没有找到，则可以重启终端程序，再查看是否存在，理论上会自动添加，否则需要手动复制上方"),s("code",null,"Windows PowerShell"),i("的配置文件更改实际"),s("code",null,"命令行"),i("参数")],-1),s("p",null,"接下来就是更改默认启动项了，非常简单~",-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120249619.png",alt:"image-20241011155953210",loading:"lazy",decoding:"async"})],-1),s("h2",{id:"安装scoop",tabindex:"-1"},[i("安装Scoop "),s("a",{class:"header-anchor",href:"#安装scoop","aria-label":'Permalink to "安装Scoop"'},"​")],-1),s("blockquote",null,[s("p",null,[s("a",{href:"https://scoop.sh/#/",target:"_blank",rel:"noreferrer"},"Scoop"),i(" 是 Windows 下的一款十分强大的包管理器，可以用来下载和管理各种软件包")])],-1),s("p",null,"打开 PowerShell 终端（版本 5.1 或更高版本），然后在 PS C：> 提示符下运行：",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Set-ExecutionPolicy"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ExecutionPolicy RemoteSigned "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Scope CurrentUser")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Invoke-RestMethod"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Uri https:"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"//"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"get.scoop.sh "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"|"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," Invoke-Expression")])])]),s("button",{class:"collapse"})],-1),s("p",null,"如果提示",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"PS C:\\Users\\HoronLee"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," Invoke-RestMethod"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Uri https:"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"//"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"get.scoop.sh "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"|"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," Invoke-Expression")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Initializing...")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Running the installer as administrator is disabled by "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"default,"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," see https:"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"//"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"github.com"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"ScoopInstaller"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Install"),s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"#for-admin for details.")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Abort.")])])]),s("button",{class:"collapse"})],-1),s("p",null,[i("则可以前往"),s("a",{href:"https://github.com/ScoopInstaller/Install#for-admin",target:"_blank",rel:"noreferrer"},"ScoopInstaller/Install: 📥 Next-generation Scoop (un)installer (github.com)"),i("查看原因，此时可以通过执行下方命令来在管理员权限下安装Scoop")],-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"irm get.scoop.sh "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"outfile "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'install.ps1'")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".\\install.ps1")])])]),s("button",{class:"collapse"})],-1),s("h2",{id:"安装oh-my-posh",tabindex:"-1"},[i("安装Oh My Posh "),s("a",{class:"header-anchor",href:"#安装oh-my-posh","aria-label":'Permalink to "安装Oh My Posh"'},"​")],-1),s("blockquote",null,[s("p",null,[s("a",{href:"https://ohmyposh.dev/",target:"_blank",rel:"noreferrer"},"官网 | Oh My Posh"),i("是一个shell提示主题引擎，可以让你的终端使用体验和外观都得到很好的改善")])],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120253769.png",alt:"image-20241010151715719",loading:"lazy",decoding:"async"})],-1),s("p",null,"官方文档中有很多安装方式，我们这里选择scoop安装，并且后续的所有软件几乎都是通过scoop来安装的，这样做到了软件包管理的统一性。",-1),s("p",null,"⚠️：在安装之前，确保关闭了火绒、360等杀毒软件，否则OhMyPosh会被报毒，我的windows defender没有报毒，似乎没事（笑",-1),s("p",null,"打开 PowerShell 提示符并运行以下命令：(其实也可以按照官网给的方式来)",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"winget install JanDeDobbeleer.OhMyPosh "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"s winget")])])]),s("button",{class:"collapse"})],-1),s("p",null,"这将安装以下几项内容：",-1),s("ul",null,[s("li",null,[s("code",null,"oh-my-posh.exe"),i("- Windows 可执行文件")]),s("li",null,[s("code",null,"themes"),i("- 最新的 Oh My Posh "),s("a",{href:"https://ohmyposh.dev/docs/themes",target:"_blank",rel:"noreferrer"},"主题")])],-1),s("p",null,"当终端末行出现",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Found Oh My Posh ["),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"JanDeDobbeleer.OhMyPosh"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"] Version "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"24.15"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"This application is licensed to you by its owner.")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Microsoft is not responsible "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"for,"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," nor does it grant any licenses to"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},","),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," third"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"party packages.")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Downloading https:"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"//"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"github.com"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"JanDeDobbeleer"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"oh"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"my"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"posh"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"releases"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"download"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"v24."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"15.1"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"install-x64"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},".msi")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  ██████████████████████████████  "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"5.65"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," MB "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," 5.65"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," MB")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Successfully verified installer hash")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Starting package install...")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Successfully installed")])])]),s("button",{class:"collapse"})],-1),s("p",null,"需要重新加载环境变量，建议重新启动你的终端（可以新开一个powershell标签页）",-1),s("p",null,"或者添加环境变量",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"$"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Path "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"+="),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},' ";C:\\Users\\user\\AppData\\Local\\Programs\\oh-my-posh\\bin"')])])]),s("button",{class:"collapse"})],-1),s("p",null,"Oh My Posh还需要进行一些细化的配置才能到达最佳使用状态",-1),s("h3",{id:"安装nerd-font",tabindex:"-1"},[i("安装Nerd Font "),s("a",{class:"header-anchor",href:"#安装nerd-font","aria-label":'Permalink to "安装Nerd Font"'},"​")],-1),s("blockquote",null,[s("p",null,[s("a",{href:"https://www.nerdfonts.com/",target:"_blank",rel:"noreferrer"},"Nerd Fonts"),i("是一种包含了很多额外的字符集的字体，用于显示各种小图标和特殊字体，这是后续很多软件所必需的")])],-1),s("ul",null,[s("li",null,[i("手动安装方式：进入官网"),s("a",{href:"https://www.nerdfonts.com/%EF%BC%8C%E7%82%B9%E5%87%BBDownloads%EF%BC%8C%E8%BF%9B%E5%85%A5%E5%AD%97%E4%BD%93%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2%EF%BC%8C%E9%80%89%E6%8B%A9%E4%B8%80%E4%B8%AA%E8%87%AA%E5%B7%B1%E5%96%9C%E6%AC%A2%E7%9A%84%EF%BC%8C%E4%B8%8B%E8%BD%BD%E4%B8%8B%E6%9D%A5%E5%B9%B6%E4%B8%94%E8%A7%A3%E5%8E%8B%E3%80%81%E5%AE%89%E8%A3%85%E5%88%B0windows%E4%B8%AD%EF%BC%8C%E6%88%91%E9%80%89%E6%8B%A9%E7%9A%84%E6%98%AF%E7%AC%AC%E4%B8%80%E4%B8%AA%E2%80%9C0xProto",target:"_blank",rel:"noreferrer"},"https://www.nerdfonts.com/，点击Downloads，进入字体下载页面，选择一个自己喜欢的，下载下来并且解压、安装到windows中，我选择的是第一个“0xProto"),i(" Nerd Font”，大家可以根据自己喜好选择！")]),s("li",null,"Scoop安装方式")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"scoop bucket add nerd-fonts")])])]),s("button",{class:"collapse"})],-1),s("h4",{id:"设置终端默认字体",tabindex:"-1"},[i("设置终端默认字体 "),s("a",{class:"header-anchor",href:"#设置终端默认字体","aria-label":'Permalink to "设置终端默认字体"'},"​")],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120300507.png",alt:"image-20241010153505860",loading:"lazy",decoding:"async"})],-1),s("p",null,"从下拉框中进入默认值设置的外观选项",-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120303294.png",alt:"image-20241010153549937",loading:"lazy",decoding:"async"})],-1),s("p",null,"将字体设定成自己下载安装的Nerd类型字体，在下方配置中，还有其他关于透明度等等的设置，可以自己按照喜好调试，记得点击右下角保存生效。",-1),s("h3",{id:"设置前置组件",tabindex:"-1"},[i("设置前置组件 "),s("a",{class:"header-anchor",href:"#设置前置组件","aria-label":'Permalink to "设置前置组件"'},"​")],-1),s("h4",{id:"posh-git",tabindex:"-1"},[i("posh-git "),s("a",{class:"header-anchor",href:"#posh-git","aria-label":'Permalink to "posh-git"'},"​")],-1),s("p",null,[s("a",{href:"https://github.com/dahlbyk/posh-git",target:"_blank",rel:"noreferrer"},"posh-git"),i(" 可以在 "),s("code",null,"PowerShell"),i(" 中显示 "),s("code",null,"Git"),i(" 状态的摘要信息并自动补全 "),s("code",null,"Git"),i(" 命令。")],-1),s("p",null,[i("通过 "),s("code",null,"scoop"),i(" 来安装，依次执行命令：")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"scoop bucket add extras")])])]),s("button",{class:"collapse"})],-1),s("figure",null,[s("a",{href:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628231945.png",target:"_blank",rel:"noreferrer"},[s("img",{src:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628231945.png",alt:"img",loading:"lazy",decoding:"async"})])],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"scoop install posh-git")])])]),s("button",{class:"collapse"})],-1),s("figure",null,[s("a",{href:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232008.png",target:"_blank",rel:"noreferrer"},[s("img",{src:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232008.png",alt:"img",loading:"lazy",decoding:"async"})])],-1),s("h4",{id:"terminal-icons",tabindex:"-1"},[i("Terminal-Icons "),s("a",{class:"header-anchor",href:"#terminal-icons","aria-label":'Permalink to "Terminal-Icons"'},"​")],-1),s("figure",null,[s("a",{href:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232029.png",target:"_blank",rel:"noreferrer"},[s("img",{src:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232029.png",alt:"img",loading:"lazy",decoding:"async"})])],-1),s("p",null,[s("a",{href:"https://github.com/devblackops/Terminal-Icons",target:"_blank",rel:"noreferrer"},"Terminal-Icons"),i(" 可以在 "),s("code",null,"PowerShell"),i(" 中显示项目图标并以颜色区分。让你的 "),s("code",null,"Powershell"),i(" 变得更加的花哨。")],-1),s("p",null,[i("通过 "),s("code",null,"scoop"),i(" 来安装，依次执行命令：")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"scoop bucket add extras")])])]),s("button",{class:"collapse"})],-1),s("blockquote",null,[s("p",null,"前文中已执行过该命令，此次可不在执行。")],-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"scoop install terminal-icons")])])]),s("button",{class:"collapse"})],-1),s("figure",null,[s("a",{href:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232046.png",target:"_blank",rel:"noreferrer"},[s("img",{src:"https://raw.githubusercontent.com/Muxiner/BlogImages/main/posts/20220628232046.png",alt:"img",loading:"lazy",decoding:"async"})])],-1),s("p",null,[i("安装完成后，还贴心的提示了如何使用，执行"),s("code",null,"Import-Module Terminal-Icons"),i("即可设置好小图标")],-1),s("h2",{id:"配置oh-my-posh",tabindex:"-1"},[i("配置Oh My Posh "),s("a",{class:"header-anchor",href:"#配置oh-my-posh","aria-label":'Permalink to "配置Oh My Posh"'},"​")],-1),s("blockquote",null,[s("p",null,[i("完成上述的安装后，启动 "),s("code",null,"PowerShell"),i(" 时并不会默认加载个性化后的配置，因此需要修改 "),s("code",null,"PowerShell"),i(" 配置文件来让每次启动都加载。")])],-1),s("p",null,"执行命令打开配置文件：",-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"notepad $PROFILE")])])]),s("button",{class:"collapse"})],-1),s("p",null,[i("若提示不存在文件，且提示是否创建文件，则直接创建，否则需要手动在 "),s("code",null,"PowerShell"),i(" 目录下创建一个配置文件再进行编辑。")],-1),s("p",null,"手动新增配置文件：",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"New-Item"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Path "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"$PROFILE"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," -"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Type File "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Force")])])]),s("button",{class:"collapse"})],-1),s("p",null,"在配置文件中添加一行配置文件",-1),s("div",{class:"language-json vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"json"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"# 使用 oh my posh")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"oh-my-posh init pwsh | Invoke-Expression")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"# 使用 Terminal-Icons")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Import-Module Terminal-Icons")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"# 使用 posh-git")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Import-Module posh-git")])])]),s("button",{class:"collapse"})],-1),s("p",null,"更改后，重新加载配置文件以使更改生效。（这条命令类似linux中的source /etc/profile）",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," $PROFILE")])])]),s("button",{class:"collapse"})],-1),s("h3",{id:"配置主题",tabindex:"-1"},[i("配置主题 "),s("a",{class:"header-anchor",href:"#配置主题","aria-label":'Permalink to "配置主题"'},"​")],-1),s("p",null,"首先使用以下命令获取可用主题（会弹出很多主题，可以自己一个一个看过去）",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Get-PoshThemes")])])]),s("button",{class:"collapse"})],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120308455.png",alt:"image-20241010154834079",loading:"lazy",decoding:"async"})],-1),s("p",null,[i("其中终端样式上方就有主题文件目录，可以复制下来，注意不要复制到前后多余的字符，我们只需要"),s("code",null,"C:\\Users\\HoronLee\\AppData\\Local\\Programs\\oh-my-posh\\themes\\1_shell.omp.json"),i("，"),s("code",null,"json"),i("不要复制成"),s("code",null,"jsone"),i("！")],-1),s("p",null,"然后我们继续编辑之前编辑过的配置文件",-1),s("div",{class:"language- vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"}),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",null,"notepad $PROFILE")])])]),s("button",{class:"collapse"})],-1),s("p",null,[i("更改第一个配置，新增"),s("code",null,"--config C:\\Users\\HoronLee\\AppData\\Local\\Programs\\oh-my-posh\\themes\\catppuccin.omp.json"),i("，请将主题文件改为自己之前复制的！")],-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# 使用 oh my posh")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"oh"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"my"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"posh init pwsh "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"--"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"config C:\\Users\\HoronLee\\AppData\\Local\\Programs\\oh"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"my"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"posh\\themes\\catppuccin.omp.json "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"|"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," Invoke-Expression")])])]),s("button",{class:"collapse"})],-1),s("p",null,"最后重启PowerShell，就可以看到主题已经变更，是不是更好看了！",-1),s("h2",{id:"配置-vs-code",tabindex:"-1"},[i("配置 VS code "),s("a",{class:"header-anchor",href:"#配置-vs-code","aria-label":'Permalink to "配置 VS code"'},"​")],-1),s("p",null,[i("在 "),s("code",null,"VS code"),i(" 中也能打开 "),s("code",null,"PowerShell"),i(" 终端，但是由于没有配置终端字体，因为 icon 们还是没有正常显示，而是显示的方框。因此需要设置 "),s("code",null,"VSCode"),i(" 的终端字体为在PowerShell配置中设置的Nerd字体才能正常显示。")],-1),s("p",null,[i("首先打开"),s("strong",null,"设置"),i("，搜索 "),s("code",null,"Font Family"),i("，找到"),s("code",null,"Terminal › Integrated: Font Family"),i("这个配置项目，现在下方的配置框中是空白的，需要填上Nerd字体的全民，并且加上单引号")],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120310684.png",alt:"image-20241010155558887",loading:"lazy",decoding:"async"})],-1),s("p",null,[i("最后重新打开终端，或是执行 "),s("code",null,"powershell"),i("，即可查看美化界面。")],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120312761.png",alt:"image-20241010155624591",loading:"lazy",decoding:"async"})],-1),s("h2",{id:"安装neovim",tabindex:"-1"},[i("安装NeoVim "),s("a",{class:"header-anchor",href:"#安装neovim","aria-label":'Permalink to "安装NeoVim"'},"​")],-1),s("p",null,[s("a",{href:"https://neovim.io/",target:"_blank",rel:"noreferrer"},"Neovim"),i("是vim的插件增强版，可以自定义更强大的插件来辅助开发，本文使用其发行版LazyVim来进行开发配置。")],-1),s("p",null,"使用scoop来安装Neovim",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"scoop bucket add main")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"scoop install neovim")])])]),s("button",{class:"collapse"})],-1),s("p",null,[i("安装完成后可以通过"),s("code",null,"nvim"),i("来开启Neovim，此时没有任何插件，和vim看起来并无差异")],-1),s("h3",{id:"安装lazyvim",tabindex:"-1"},[i("安装LazyVim "),s("a",{class:"header-anchor",href:"#安装lazyvim","aria-label":'Permalink to "安装LazyVim"'},"​")],-1),s("p",null,[s("a",{href:"https://www.lazyvim.org/",target:"_blank",rel:"noreferrer"},"🚀 Getting Started | LazyVim"),i("是由 "),s("a",{href:"https://github.com/folke/lazy.nvim",target:"_blank",rel:"noreferrer"},"lazy.nvim 提供支持💤"),i("的 Neovim 设置，可以轻松自定义和扩展您的配置。")],-1),s("p",null,[i("使用 "),s("a",{href:"https://github.com/PowerShell/PowerShell",target:"_blank",rel:"noreferrer"},"PowerShell"),i(" 安装 "),s("a",{href:"https://github.com/LazyVim/starter",target:"_blank",rel:"noreferrer"},"LazyVim Starter")],-1),s("ul",null,[s("li",null,[s("p",null,"备份您当前的 Neovim 文件，第一次安装可以执行，因为你根本没东西需要备份（笑"),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# required")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Move-Item"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCALAPPDATA\\nvim $"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCALAPPDATA\\nvim.bak")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#6A737D","--shiki-dark":"#6A737D"}},"# optional but recommended")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Move-Item"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCALAPPDATA\\nvim"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"data $"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCALAPPDATA\\nvim"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"data.bak")])])]),s("button",{class:"collapse"})])]),s("li",null,[s("p",null,"克隆Lazyvim"),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"git clone https:"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"//"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"github.com"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LazyVim"),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"/"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"starter $"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCALAPPDATA\\nvim")])])]),s("button",{class:"collapse"})])]),s("li",null,[s("p",null,[i("删除自带的"),s("code",null,".git"),i("文件夹，以便稍后可以将其添加到您自己的存储库")]),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Remove-Item"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," $"),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"env:"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"LOCALAPPDATA\\nvim\\.git "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Recurse "),s("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"-"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"Force")])])]),s("button",{class:"collapse"})])]),s("li",null,[s("p",null,"启动 Neovim！"),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"nvim")])])]),s("button",{class:"collapse"})])])],-1),s("p",null,"接下来就能看到neovim启动了，他变了，变得看起来更高级了（插件起作用了，在加载了），当然这个过程会从GitHub下载很多Lua语言的脚本，或许你需要为自己准备一个梯子来更快的访问以防止报错",-1),s("p",null,[i("这是安装完成的状态，你可以通过"),s("code",null,"Shift+U"),i("等组合切换选项卡")],-1),s("figure",null,[s("img",{src:"https://minio-api.horonlee.com/blogpic/img/20250312120316024.png",alt:"image-20241010160340343",loading:"lazy",decoding:"async"})],-1),s("p",null,"如果出现了红色报错，内容含有make、gcc等词汇，说明缺少了一下依赖，你需要手动安装，这很简单，还需使用伟大的scoop即可完成（我碰到的就是gcc不存在，所以我就自己安装完成了）",-1),s("div",{class:"language-powershell vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"powershell"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[s("code",{"v-pre":""},[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"scoop install gcc")])])]),s("button",{class:"collapse"})],-1),s("p",null,[i("以上步骤完成你可以开始使用lazyvim了，使用"),s("code",null,"nvim 某文件"),i("即可开始对其进行编辑，关于vim和lazyvim的各种快捷键可以在"),s("a",{href:"https://vim.rtorr.com/lang/zh_cn",target:"_blank",rel:"noreferrer"},"vim键位指南"),i("和"),s("a",{href:"https://www.lazyvim.org/keymaps",target:"_blank",rel:"noreferrer"},"⌨️ Keymaps | LazyVim"),i("中找到，请尽情探索，相信你可以只用键盘实现高于键鼠的代码效率！")],-1),s("h2",{id:"给lazyvim添加编程语言插件",tabindex:"-1"},[i("给LazyVim添加编程语言插件 "),s("a",{class:"header-anchor",href:"#给lazyvim添加编程语言插件","aria-label":'Permalink to "给LazyVim添加编程语言插件"'},"​")],-1),s("blockquote",null,[s("p",null,"未完待续…")],-1)])),"main-header":l(()=>[a(e.$slots,"main-header")]),"main-header-after":l(()=>[a(e.$slots,"main-header-after")]),"main-nav":l(()=>[a(e.$slots,"main-nav")]),"main-content-before":l(()=>[a(e.$slots,"main-content-before")]),"main-content":l(()=>[a(e.$slots,"main-content")]),"main-content-after":l(()=>[a(e.$slots,"main-content-after")]),"main-nav-before":l(()=>[a(e.$slots,"main-nav-before")]),"main-nav-after":l(()=>[a(e.$slots,"main-nav-after")]),comment:l(()=>[a(e.$slots,"comment")]),footer:l(()=>[a(e.$slots,"footer")]),aside:l(()=>[a(e.$slots,"aside")]),"aside-custom":l(()=>[a(e.$slots,"aside-custom")]),default:l(()=>[a(e.$slots,"default")]),_:3},8,["frontmatter"])}}};export{V as default,C as usePageData};
