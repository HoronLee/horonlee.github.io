<script lang="ts" setup>
import { useScriptTag } from '@vueuse/core'
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'

useScriptTag('//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js')
</script>

<template>
  <YunFooter style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
    <!-- 自定义页脚内容 -->
    <a href="https://icp.gov.moe/?keyword=20241146" target="_blank">萌ICP备20241146号</a>
    <a href="https://icp.redcha.cn/beian/ICP-2025080111.html" title="茶ICP备2025080111号" target="_blank">茶ICP备2025080111号</a>
    <div style="width: 120px;height: auto;">
    <a href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" title="开往-友链接力">
    <img src="https://www.travellings.cn/assets/logo.gif" alt="开往-友链接力" ></a>
    </div>
    <div style="display: flex;">
    <a class="github-badge" target="_blank" href="https://vercel.com/" style="margin-inline:5px" title="本站采用多线部署，主线路托管于Vercel"><img src="https://sourcebucket.s3.bitiful.net/badge/Hosted-Vercel-brightgreen.svg" data-lazy-src="https://sourcebucket.s3.bitiful.net/badge/Hosted-Vercel-brightgreen.svg" alt="" data-ll-status="loaded" class="entered loaded"></a>
    <a class="github-badge" target="_blank" href="https://github.com/" style="margin-inline:5px" title="本网站源码由Github提供存储仓库"><img src="https://sourcebucket.s3.bitiful.net/badge/Source-Github-d021d6.svg" data-lazy-src="https://sourcebucket.s3.bitiful.net/badge/Source-Github-d021d6.svg" alt="" data-ll-status="loaded" class="entered loaded"></a>
    </div>
    <div>本站总访问量 <span id="busuanzi_value_site_pv" /> 次</div>
    <div>本站访客数 <span id="busuanzi_value_site_uv" /> 人次</div>
    <VCLiveTime mt="2" start-time="2022-2-10">
      <template #live-time-before>
        <span>本站已运行</span>
      </template>
    </VCLiveTime>
  </YunFooter>
</template>