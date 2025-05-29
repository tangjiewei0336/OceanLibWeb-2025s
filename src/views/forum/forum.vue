<style scoped lang="less">
@import '~@/vant-variables.less';
.forum {
  display: flex;
  flex-direction: column;
  background-color: white;

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
  &__divider {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 4px 17px;
    height: 0;
    background-color: white !important; // 显式清除背景色
  }

  &__artical {
    // margin-top: 5px;
    background-color: white;
    padding: 10px 20px;

    &__group {
      display: flex;
      justify-content: space-between;

      &__title {
        font-size: 16px;

        &--extraDesc {
          font-size: 12px;
        }

        &--divider {
          margin: 0 5px;
        }
      }

      &__more {
        font-size: 14px;
        display: flex;
        align-items: center;
      }

      &__tabs {
        margin: 5px 0;

        &__tab {
          margin: 10px 0;
        }
      }
      &__fileBox {
        margin-top: 15px;
      }
    }
  }

}
</style>
<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
<template>
    <div class="forum">
        <AppHeader />
        <!-- 
        <div style="margin-top: 220px; margin-bottom: 50px">
            <ContentCard
            title="THE WORLD!"
            :paraList="[20, 10, 20, 0, 5]"
            />
        </div> -->
        <div>
          <div v-for="(item, index) in answers" :key="item.id">
            <QandABox :answer="item" class="forum__artical" />
            <hr v-if="index !== answers.length - 1" class="forum__divider" />
          </div>
        </div>
        
        <div style="position: fixed;bottom: 0;left: 0;right: 0;">
            <v-bottom-navigation shift color="primary" grow class="index__bottom__navigation" v-model="navigation">
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
import AppHeader from '../../components/nav/ForumHeadBar.vue'
import QandABox from '../../components/QandABox.vue'

export default {
    name: 'forum',
    components: { AppHeader, QandABox },
    data() {
        return {
        navigation: 2,
        showDialog: false,
        answers: [
          {
            id: 1,
            content: `
              <p>这是第一个回答的内容。</p>
              <img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg" />
              <img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg" />
              <img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg" />
              <img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg" />
              <img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg" />
              <p>回答内容结束。</p>
            `,
            commentCount: 5,
            likeCount: 12,
            createTime: '2025-05-26T14:00:00',
            updateTime: '2025-05-27T08:00:00',
            userId: "neo2020",
            question: {
              id: 201,
              title: 'Vue 和 React 的区别是什么？'
            }

          },
          {
            content: `
            <p>这是第二个回答，稍微短一些。</p>
            <img src="https://pic3.zhimg.com/80/v2-8eddcbe0f97aa68d7aeed10775187ddc_r.jpg" />
            `,
            commentCount: 2,
            likeCount: 4,
            createTime: '2025-05-25T18:00:00',
            updateTime: '2025-05-25T19:00:00',
            userId: "1120210090",
            question: {
              id: 202,
              title: '如何搭建个人博客？'
            }
          }
        ]
      }
    },
}
</script>