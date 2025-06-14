<template>
  <div class="qa" @click="goToQuestionDetail">
    <div class="qa__title text-ellipsis-2">
      <!-- <v-icon class="qa__icon-bg">mdi-comment-quote-outline</v-icon> -->
      {{ answer.question?.title || '未知问题' }}
    </div>
    <div class="qa__content-wrapper">
      <div class="qa__content-main">
        <div class="qa__content-label user-info-label">
          <username 
            :username="answer.userId" 
            :avatarSize="20" 
            type="avater" 
            :useCachedImage="true"
            style="margin-right: 6px;"
          />
          <username 
            :username="answer.userId" 
            type="username" 
          />
        </div>
        <div class="qa__content text-ellipsis-3">
          {{ getPlainTextWithImagePlaceholder(answer.content).slice(0, 100) }}
        </div>
        <div class="qa__images">
          <CachedImage
            v-for="(img, index) in allImages"
            :key="index"
            :src="img"
            alt="回答图片"
            class="answer-image"
            :width="80"
            :height="80"
            border-radius="4px"
          />
        </div>
      </div>
    </div>

    <div class="qa__meta">
      <span class="qa__meta-item">{{ answer.likeCount }} 赞</span>
      <span class="qa__meta-item">{{ answer.commentCount }} 评论</span>
      <span class="qa__meta-item">{{ answer.formattedTime }}</span>
      <span class="qa__meta-item-more">···</span>
    </div>
  </div>
</template>

<script>
import CachedImage from './CachedImage.vue';
import username from './common/username/username.vue';
import imageCache from '@/utils/imageCache';

export default {
  name: "QandABox",
  components: {
    CachedImage,
    username
  },
  props: {
    answer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userInfo: {
        avatar: "",
        username: "",
      },
    };
  },
  computed: {
    formattedTime() {
		const d = new Date(this.answer.updateTime || this.answer.createTime);
		return d.toLocaleDateString() + " " + d.toLocaleTimeString().slice(0, 5);
    },
    allImages() {
		if (!this.answer.content) return [];
		const imgMatches = [...this.answer.content.matchAll(/<img[^>]+src="([^">]+)"/gi)];
		return imgMatches.map((m) => m[1]);
    },
  },
  methods: {
    goToQuestionDetail() {
		let question = this.answer.question
		console.log(question)
		if (question && question.bindId) {
			// 以后需要改到回答的详细页面
			localStorage.setItem('id', question.bindId)
			localStorage.setItem('topAid', this.answer.id)
      localStorage.setItem('questionTitle', question.title)
			this.$router.push({ name: 'forumAnswer' });
		}
    },
    getPlainTextWithImagePlaceholder(html) {
		const replaced = html.replace(/<img[^>]*>/gi, " [图片] ");
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = replaced;
		return tempDiv.textContent || tempDiv.innerText || "";
    },
    async fetchUserInfo() {
		this.userInfo.avatar = this.answer.avatar || "https://th.bing.com/th/id/OIP.cCtgBVWW7Sm6RxLzXOZhIwAAAA?rs=1&pid=ImgDetMain";
		this.userInfo.username = this.answer.userId;
    },
    
    // 预加载图片
    preloadImages() {
      // 预加载头像
      if (this.userInfo.avatar) {
        imageCache.preloadImage(this.userInfo.avatar);
      }
      
      // 预加载回答中的图片（限制数量避免过度预加载）
      if (this.allImages.length > 0) {
        // 只预加载前3张图片
        const imagesToPreload = this.allImages.slice(0, 3);
        setTimeout(() => {
          imageCache.preloadImages(imagesToPreload);
        }, 200);
      }
    },
  },
  mounted() {
		this.fetchUserInfo();
		this.preloadImages();
  },
  // 添加错误捕获
  errorCaptured(err, vm, info) {
    console.error('QandABox - 捕获到错误:', err, vm, info);
    return false;
  },
};
</script>

<style scoped lang="less">
.qa {
  background: #fff;
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
    display: flex;
    align-items: center;
    gap: 6px;

    &.user-info-label {
      color: #333;
      font-weight: 600;
    }
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

  &__images {
    display: flex;
    flex-wrap: nowrap; /* 一行展示 */
    overflow-x: auto;  /* 横向滚动 */
    gap: 8px;
    margin-top: 6px;
    padding-bottom: 4px;
    /* 美化滚动条（可选） */
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  .answer-image {
    flex: 0 0 auto;
  }

  .user-avatar {
    /* CachedImage 组件会处理尺寸和样式 */
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

  &__icon-bg {
    font-size: 120%;
    color: #2d8cf0;
  }

  &__content-wrapper {
    display: flex;
    gap: 12px;
  }

  &__content-main {
    flex: 1;
    overflow: hidden;
  }
  .text-ellipsis-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
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
