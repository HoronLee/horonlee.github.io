import{l as k,u as T,x as U,b as z,y as A,c as D,h as F,e as M,f as N}from"./app.BVc48gHk.js";import"./chunks/@vueuse/motion.n2Jr4alk.js";import{G as y,A as h,ab as _,aa as s,ad as a,ag as i,ae as u,w as o,a9 as m,a8 as H,Z as r,ak as p,at as x,ac as I,J as j}from"./framework.Du602yaV.js";import{u as E}from"./chunks/vue-i18n.tc_21sJ3.js";import{_ as G}from"./YunSponsor.vue_vue_type_style_index_0_lang.DdkQFvZq.js";import{_ as J,a as O,b as W}from"./YunPostMeta.vue_vue_type_script_setup_true_lang.CPw1eJwu.js";import{d as C}from"./chunks/dayjs.Byk5cVHE.js";import"./chunks/vue-router.CPBYBm_A.js";import"./chunks/nprogress.COTDXfmE.js";import"./chunks/pinia.Dv8YzA9U.js";import"./index.DQ3TBYmS.js";import"./animation.BmKSPrMr.js";const Z={class:"post-copyright"},q={class:"post-copyright-author"},K={key:0,class:"post-copyright-link"},Q=["href","title"],X={class:"post-copyright-license"},ee=["innerHTML"],te=y({__name:"ValaxyCopyright",props:{url:{default:""}},setup(v){const{t:e,locale:t}=E(),n=k(),l=n.value.license.type==="zero"?"1.0":"4.0",f=n.value.license.type==="zero"?"publicdomain":"licenses",g=h(()=>{const c=n.value.license.language?n.value.license.language:t.value==="zh-CN"?"zh":"en";return`https://creativecommons.org/${f}/${n.value.license.type}/${l}/deed.${c}`}),d=h(()=>e("post.copyright.license_content",[`<a href="${g.value}" target="_blank" rel="noopener" title="CC ${`${n.value.license.type.toUpperCase()} ${l}`} ">CC ${n.value.license.type.toUpperCase()}</a>`]));return(c,$)=>(s(),_("ul",Z,[a("li",q,[a("strong",null,u(o(e)("post.copyright.author")+o(e)("symbol.colon")),1),a("span",null,u(o(n).author.name),1)]),c.url?(s(),_("li",K,[a("strong",null,u(o(e)("post.copyright.link")+o(e)("symbol.colon")),1),a("a",{href:c.url,target:"_blank",title:o(e)("post.copyright.link")},u(decodeURI(c.url)),9,Q)])):i("v-if",!0),a("li",X,[a("strong",null,u(o(e)("post.copyright.license_title")+o(e)("symbol.colon")),1),a("span",{innerHTML:d.value},null,8,ee)])]))}}),oe={class:"inline-flex",text:"sm",py:"1"},ne={key:1,mx:"2"},se=y({__name:"YunPostCategoriesAndTags",props:{frontmatter:{}},setup(v){return(e,t)=>{const n=J,l=O;return s(),_("div",oe,[e.frontmatter.categories?(s(),m(n,{key:0,categories:e.frontmatter.categories},null,8,["categories"])):i("v-if",!0),e.frontmatter.categories&&e.frontmatter.tags?(s(),_("span",ne)):i("v-if",!0),e.frontmatter.tags?(s(),m(l,{key:2,tags:e.frontmatter.tags},null,8,["tags"])):i("v-if",!0)])}}}),he=y({__name:"post",setup(v){const e=k(),t=T(),n=U(),l=h(()=>typeof t.value.sponsor=="boolean"?t.value.sponsor:e.value.sponsor.enable),f={"@type":"BlogPosting",headline:t.value.title,description:t.value.description,author:[{name:e.value.author.name,url:e.value.author.link}],datePublished:C(t.value.date||"").toDate(),dateModified:C(t.value.updated||"").toDate()},g=t.value.image||t.value.cover;return g&&(f.image=g),z(A(f)),(d,c)=>{const $=D,b=W,Y=se,L=G,P=te,V=H("RouterView"),S=F,w=M,B=N;return s(),_(j,null,[r(w,null,{default:p(()=>[r($),r(V,null,{default:p(({Component:R})=>[(s(),m(x(R),null,{"main-header-after":p(()=>[r(b,{frontmatter:o(t)},null,8,["frontmatter"]),r(Y,{class:"mt-2",frontmatter:o(t)},null,8,["frontmatter"])]),"main-content-after":p(()=>[l.value?(s(),m(L,{key:0,m:"t-6"})):i("v-if",!0),o(t).copyright||o(t).copyright!==!1&&o(e).license.enabled?(s(),m(P,{key:1,url:o(n),m:"y-4"},null,8,["url"])):i("v-if",!0)]),"aside-custom":p(()=>[I(d.$slots,"aside-custom")]),_:2},1024))]),_:3}),r(S)]),_:3}),r(B)],64)}}});export{he as default};
