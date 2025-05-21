<style scoped lang="less">
@import '~@/vant-variables.less';
.forum {
  display: flex;
  flex-direction: column;
  background-color: #fafafa;

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

  &__artical {
    margin-top: 5px;
    background-color: white;
    padding: 20px;

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

        <div style="margin-top: 220px; margin-bottom: 50px">
            <ContentCard
            title="THE WORLD!"
            :paraList="[20, 10, 20, 0, 5]"
            />
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
import ContentCard from '../../components/forum/ContentCard.vue';

export default {
    components: { AppHeader, ContentCard },
    data() {
        return {
        navigation: 2,
        showDialog: false,
        }
    },
}
</script>