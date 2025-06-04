<style scoped lang="less">
.question-box {
  background: #fff;
  // 倒角
  // padding: 16px;
  // border-radius: 12px;
  // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 0px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  &__content-label {
    font-size: 12px;
    color: #2d8cf0;
    font-weight: 500;
    margin-bottom: 4px;
  }

  &__title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      line-height: 1.5;
  }

  &__content {
      font-size: 12px;
      color: #555;
      margin-bottom: 10px;
      line-height: 1.6;
  }

  &__meta {
      display: flex;
      font-size: 12px;
      color: #999;
      margin-bottom: 0px;

      &-item {
      margin-right: 10px;
      align-items: center;
      }
      
      &-item-more {
      margin-left: auto;
      }
  }

  &__content-wrapper {
    display: flex;
    gap: 12px;
  }

  &__content-main {
    flex: 1;
    overflow: hidden;
  }

  // &__tags {
  //   display: flex;
  //   flex-wrap: wrap;

  //   .question-box__tag {
  //     margin-right: 6px;
  //     margin-bottom: 4px;
  //   }
  // }

  &__icon-bg {
      font-size: 120%;
      color: #2d8cf0;
  }

  .coin-icon {
      width: 14px;
      height: 14px;
      margin-right: 4px;
      vertical-align: middle;
  }

  .text-ellipsis-2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
  }

  .text-ellipsis-3 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
  }
}
</style>
<template>
  <div class="question-box" @click="goToDetail">
    <div class="question-box__title text-ellipsis-2">
      <v-icon class="question-box__icon-bg">
        mdi-comment-question-outline
      </v-icon>
      {{ title }}
    </div>
    <!-- <div class="question-box__content text-ellipsis-3" v-html="replaceImagesWithPlaceholder(content)"></div> -->
    <div class="question-box__content-wrapper">
      <div class="question-box__content-main">
        <div class="question-box__content-label">问题描述</div>
        <div class="question-box__content text-ellipsis-3">
          {{ getPlainTextWithImagePlaceholder(content).slice(0, 100) }}
        </div>
      </div>
    </div>
    <div class="question-box__meta">
      <!-- <span class="question-box__meta-item">{{ formattedTime }}</span> -->
      <span class="question-box__meta-item">{{ answerCount }} 回答</span>
      <span class="question-box__meta-item">{{ viewCount }} 浏览</span>
      <span class="question-box__meta-item" v-if="rewardPoints > 0">
        <img src="../images/main-icon/coin.svg" class="coin-icon" />
        {{ rewardPoints }}
      </span>
      <span class="question-box__meta-item-more">···</span>
    </div>
    <!-- <div class="question-box__tags">
      <van-tag
        v-for="tag in tagIds"
        :key="tag"
        type="primary"
        class="question-box__tag"
      >
        {{ tag }}
      </van-tag>
    </div> -->
  </div>
</template>
  
<script>
export default {
  name: 'QuestionBox',
  props: {
    bindId: [String, Number],
    title: String,
    content: String,
    userId: [String, Number],
    createTime: String,
    updateTime: String,
    isDeleted: Boolean,
    isPosted: Boolean,
    isHidden: Boolean,
    rewardPoints: [String, Number],
    answerCount: [String, Number],
    viewCount: [String, Number],
    likeCount: Number,
    isLiked: Boolean,
    tagIds: {
      type: Array,
      default: () => [],
    },
    attachmentIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    formattedTime() {
      const d = new Date(this.createTime);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5);
    },
  },
  methods: {
    goToDetail() {
      // 以后需要改到问题的详细页面
      localStorage.setItem('id', this.bindId)
      this.$router.push('/forum/question')
    },
    getPlainTextWithImagePlaceholder(html) {
      const replaced = html.replace(/<img[^>]*>/gi, ' [图片] ');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = replaced;
      return tempDiv.textContent || tempDiv.innerText || '';
    }
  },
};
</script>
  
  