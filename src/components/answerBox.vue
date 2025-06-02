<style scoped lang="less">
.answer-box {
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

&__thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
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

<template>
<div class="answer-box" @click="goToQuestionDetail">
    <div class="answer-box__title text-ellipsis-2">
    <v-icon class="answer-box__icon-bg">
        mdi-comment-quote-outline
    </v-icon>
    {{ question?.title || '未知问题' }}
    </div>
    <!-- <div class="answer-box__content-label">我的回答</div>
    <div class="answer-box__content text-ellipsis-3">
    {{ getPlainTextWithImagePlaceholder(content).slice(0, 100) }}
    </div> -->
    <div class="answer-box__content-wrapper">
      <div class="answer-box__content-main">
        <div class="answer-box__content-label">我的回答</div>
        <div class="answer-box__content text-ellipsis-3">
          {{ getPlainTextWithImagePlaceholder(content).slice(0, 100) }}
        </div>
      </div>

      <img
        v-if="firstImage"
        :src="firstImage"
        class="answer-box__thumbnail"
        alt="回答配图"
      />
    </div>
    <div class="answer-box__meta">
    <span class="answer-box__meta-item">{{ likeCount }} 赞</span>
    <span class="answer-box__meta-item">{{ commentCount }} 评论</span>
    <span class="answer-box__meta-item">
        {{ formattedTime }}
    </span>
    <span class="answer-box__meta-item-more">···</span>
    </div>
</div>
</template>
  
<script>
export default {
name: 'AnswerBox',
props: {
    id: [String, Number],
    content: String,
    likeCount: {
    type: [String, Number],
    default: 0,
    },
    commentCount: {
    type: [String, Number],
    default: 0,
    },
    createTime: String,
    updateTime: String,
    question: {
    type: Object,
    default: () => ({}),
    },
},
computed: {
    formattedTime() {
    const d = new Date(this.updateTime || this.createTime);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5);
    },
    firstImage() {
      const match = this.content?.match(/<img[^>]+src="([^">]+)"/i);
      return match ? match[1] : null;
    },
},
methods: {
    goToQuestionDetail() {
    if (this.question && this.question.id) {
      // 以后需要改到回答的详细页面
        this.$router.push({ path: `/question/${this.question.id}` });
    }
    },
    getPlainTextWithImagePlaceholder(html) {
        const replaced = html.replace(/<img[^>]*>/gi, ' [图片] ');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = replaced;
        return tempDiv.textContent || tempDiv.innerText || '';
    }
}
};
</script>