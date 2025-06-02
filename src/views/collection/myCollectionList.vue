<style scoped lang="less">
@import '~@/vant-variables.less';
.collectionlist {
  margin-top: 10px;
  &__box {
    padding: 10px 20px;
    &__title {
      margin-right: 10px;
    }
  }
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="我的收藏" left-text="返回" left-arrow @click-left="back" fixed placeholder 
    @click="$router.push({ path: '/newCollection', query: { mainType: collections[active].mainType } })">
      <template #right>
        <a @click="$router.push({ path: '/newCollection', query: { mainType: collections[active].mainType } })">新增</a>
      </template>
    </van-nav-bar>
    <div class="collectionlist full">
      <van-tabs v-model="active" @change="onTabChange">
        <van-tab v-for="(item, index) in collections" :key="index" :title="item.title">
          <van-pull-refresh v-model="refreshing" @refresh="getCollection()" class="full">
            <van-list v-model="loading" :finished="finished" @load="getCollection()">
              <div v-for="(item, index) in myCollection" :key="index">
                <van-swipe-cell>
                  <van-cell
                    class="collectionlist__box"
                    :label="item.files.length + ' 个内容 · ' + (item.isPublic ? '公开收藏夹' : '私密收藏夹')"
                    @click="showItem(item.collectionID, item.name, item.desc, item.isPublic)"
                  >
                    <template #title>
                      <span class="collectionlist__box__title">{{ item.name }}</span>
                      <v-icon size="20" color="primary" v-if="!item.isPublic">mdi-eye-remove-outline</v-icon>
                    </template>
                  </van-cell>
                  <template #right>
                    <van-button
                      square
                      text="修改"
                      type="danger"
                      style="height: 100%"
                      @click="toChangeCollection(item.collectionID, item.name, item.desc, item.isPublic)"
                    />
                  </template>
                </van-swipe-cell>
              </div>
              <template #finished>
                <!--若无收藏夹则显示空提示-->
                <van-empty description="您尚未建立收藏夹" v-if="myCollection.length == 0">
                  <template slot="image">
                    <img src="@/images/empty-picture/no_data.svg" />
                  </template>
                  <template>
                    <v-btn color="primary" small @click="$router.push({ path: '/newCollection', query: { mainType: collections[active].mainType } })">
                      新增收藏夹
                      <v-icon right dark> mdi-star-plus </v-icon>
                    </v-btn>
                  </template>
                </van-empty>
                <div v-else class="notice-nomore__text">没有更多的收藏了</div>
              </template>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: Number(this.$route.query.active || 0),

      myCollection: [],
      refreshing: false,
      loading: false,
      finished: false,
      // active: 0,
      collections: [
        { title: "文档", mainType: "DOCUMENT" },
        { title: "问题", mainType: "QUESTION" },
        { title: "回答", mainType: "ANSWER" }
      ],
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    onTabChange(newIndex) {
      // this.active = newIndex;
      this.getCollection(); // 切换 Tab 时重新加载数据
      // this.$router.replace({
      //   path: this.$route.path,
      //   query: {
      //     // 保留其它可能存在的 query 字段，比如分页、筛选之类
      //     ...this.$route.query,
      //     active: newIndex
      //   }
      // });
    },
    getCollection() {
      console.log(this.collections[this.active].mainType)
      this.$Axios({
        method: 'get',
        url: '/collectionService/getCollection',
        params: {
          mainType: this.collections[this.active].mainType
        }
      }).then((response) => {
        this.myCollection = response.data.msg.collection.map(item => ({
          ...item,
          files: item.files || []  // 如果 files 是 undefined，则赋值为空数组
        }));
        this.loading = false;
        this.refreshing = false;
        this.finished = true; //一次性全部加载，直接完成
      });
    },
    showItem(collectionID, collectionName, collectionDesc, isPublic) {
      this.$router.push({
        path: '/myCollectionItem',
        query: {
          collectionID: collectionID,
          collectionName: collectionName,
          collectionDesc: collectionDesc,
          isPublic: isPublic,
          mainType: this.collections[this.active].mainType, // 这里加入 mainType
          active: this.active  // 👉 把 active 一并传进去
        },
      });
    },
    toChangeCollection(collectionID, collectionName, collectionDesc, isPublic) {
      // console.log(this.collections[this.active].mainType)
      this.$router.push({
        path: '/newCollection',
        query: {
          collectionID: collectionID,
          collectionName: collectionName,
          collectionDesc: collectionDesc,
          isPublic: isPublic,
          isChange: true,
          mainType: this.collections[this.active].mainType, // 这里加入 mainType
          active: this.active  // 👉 把 active 一并传进去
        },
      });
    },
  },
};
</script>

<style scoped>
</style>