<style scoped lang="less">
@import "~@/vant-variables.less";

.forum {
  display: flex;
  flex-direction: column;
  height: 100vh; // 确保占满整个视口
  background-color: white;

  /* ========== 顶部留白部分 ========== */
  &__top {
    background-color: white;
    padding: 20px;

    &__logo {
      width: 120px;
    }

    &__searchBox {
      margin: 10px 0;
    }

    &__grid {
      margin: 10px 0;
    }

    &__adSwipe {
      margin-bottom: 10px;
    }
  }

  /* 分割线 */
  &__divider {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 4px 17px;
    height: 0;
    background-color: white !important; // 显式清除背景
  }

  /* 可滚动的内容容器 */
  &__content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 56px; // 为底部导航栏留出空间
  }

  /* 列表项外层容器，做一点上下 padding 让整体不紧贴顶端，但底部留白留给底部导航 */
  .van-pull-refresh,
  .van-list {
    /* 整个内容区往下平移（避开 header）*/
    margin-top: 0px;
  }

  /* 如果 answers 为空显示占位 */
  &__empty {
    text-align: center;
    padding: 20px;
    color: #999;
  }

  /* 回答列表里每一项外层，可做些 margin/padding */
  &__article-item {
    background-color: white;
    padding: 10px 20px;
  }
}

/* ========== 底部导航：固定在底部 ========== */
.forum__bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

/* 下面是你原先的样式，保持不变 */
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
<template>
  <div class="forum">
    <!-- 页头组件，固定在顶部 -->
    <AppHeader />

    <!-- 可滚动的内容区域 -->
    <div class="forum__content">
      <!-- 下拉刷新 + 列表 -->
      <van-pull-refresh
        v-model="isRefreshing"
        @refresh="onRefresh"
        head-height="50"
        :animation-duration="300"
      >
        <!-- 如果 answers 为空并且不是加载状态，显示占位 -->
        <div v-if="!isLoading && answers.length === 0" class="forum__empty">
          暂无回答
        </div>

        <!-- 用 van-list 实现分页加载 -->
        <van-list
          v-else
          v-model="isLoading"
          :finished="isFinished"
          finished-text="没有更多了"
          @load="onLoadMore"
        >
          <!-- 遍历 answers 并渲染 QandABox -->
          <div
            v-for="(item, index) in answers"
            :key="item.id"
            class="forum__article-item"
          >
            <QandABox :answer="item" />
            <hr
              v-if="index !== answers.length - 1"
              class="forum__divider"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 底部导航：固定在底部 -->
    <div class="forum__bottom-nav">
      <v-bottom-navigation
        shift
        color="primary"
        grow
        v-model="navigation"
      >
        <v-btn link to="/index">
          <span>文库</span>
          <v-icon>mdi-text-box-search</v-icon>
        </v-btn>
        <v-btn link to="/wall">
          <span>互助</span>
          <v-icon>mdi-handshake</v-icon>
        </v-btn>
        <v-btn link to="/forum/recommend">
          <span>知乎</span>
          <v-icon>mdi-forum</v-icon>
        </v-btn>
        <v-btn link to="/mine">
          <span>我的</span>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/nav/ForumHeadBar.vue";
import QandABox from "@/components/QandABox.vue";
// 确认你已经安装并在 main.js 中注册了 Vant：
import { PullRefresh, List } from "vant";

export default {
  name: "forum",
  components: {
    AppHeader,
    QandABox,
    // 如果你用的是按需导入，需要在这里声明
    "van-pull-refresh": PullRefresh,
    "van-list": List,
  },
  data() {
    return {
      navigation: 2,

      // ========== 下拉刷新 & 分页所需状态 ==========
      isRefreshing: false, // 下拉刷新状态
      isLoading: false,    // 上拉加载状态 (van-list 会在 load 开始时设为 true，load 完后设为 false)
      isFinished: false,   // 是否已经加载到最后一页

      answers: [],         // 回答列表，最终用于渲染
      page: 1,             // 当前页码，从 1 开始
      pageSize: 6,        // 每页大小
    };
  },
  methods: {
    // ========== 下拉刷新 ==========
    async onRefresh() {
      // 用户下拉触发：把 page 重置为 1，再去拉最新数据
      this.page = 1;
      this.isFinished = false;
      try {
        const resp = await this.$Axios({
          method: "get",
          url: "/qaService/answer/all",
          params: {
            page: this.page,
            pageSize: this.pageSize,
          },
        });
        const data = resp.data.msg;
        if (data && Array.isArray(data.content)) {
          // 直接覆盖 answers
          this.answers = data.content;
          // 如果返回的条数 < pageSize，就说明没有更多
          this.isFinished = data.content.length < this.pageSize;
        } else {
          this.answers = [];
          this.isFinished = true;
        }
      } catch (err) {
        console.error("下拉刷新获取列表失败：", err);
        this.answers = [];
        this.isFinished = true;
      } finally {
        // 结束下拉刷新动画
        this.isRefreshing = false;
      }
    },

    // ========== 上拉加载更多 ==========
    async onLoadMore() {
      // van-list 在开始调用 load 之前会把 isLoading 设为 true
      // 组件中绑定了 v-model="isLoading"，所以这里不需要手动设。
      // 只需要在结束后把 isLoading = false 即可。

      // 如果已经加载到最后一页，就直接把 isLoading 设为 false
      if (this.isFinished) {
        this.isLoading = false;
        return;
      }

      // 准备拉取下一页
      this.page += 1;
      try {
        const resp = await this.$Axios({
          method: "get",
          url: "/qaService/answer/all",
          params: {
            page: this.page,
            pageSize: this.pageSize,
          },
        });
        const data = resp.data.msg;
        if (data && Array.isArray(data.content)) {
          // 把新数组追加到 answers 末尾
          this.answers = this.answers.concat(data.content);
          // 如果本次返回不足 pageSize 条，就视为最后一页
          if (data.content.length < this.pageSize) {
            this.isFinished = true;
          }
        } else {
          this.isFinished = true;
        }
      } catch (err) {
        console.error("上拉加载更多失败：", err);
        // 出错也要把 isFinished 标记为 true，避免无限重试
        this.isFinished = true;
      } finally {
        // 结束上拉加载动画
        this.isLoading = false;
      }
    },
  },
  mounted() {
    // 页面一进来先调用一次下拉刷新逻辑
    this.onRefresh();
  },
};
</script>