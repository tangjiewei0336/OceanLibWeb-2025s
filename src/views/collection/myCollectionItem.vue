<style scoped lang="less">
@import '~@/vant-variables.less';
.collection {
  background-color: white;
  padding: 20px;
  &__title {
    font-size: 20px;
    margin: 0;
    width: 100%;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  &__desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="收藏详情" left-text="返回" left-arrow @click-left="back" fixed placeholder @click-right="toChangeCollection">
      <template #right>
        <a>修改</a>
      </template>
    </van-nav-bar>
    <div class="collection full">
      <p class="collection__title">{{$route.query.collectionName}}</p>
      <p class="collection__desc" v-if="$route.query.collectionDesc!=null">{{$route.query.collectionDesc}}</p>

      <van-pull-refresh v-model="refreshing" @refresh="getCollectionFileList()" class="full">
        <van-list v-model="loading" :finished="finished" @load="getCollectionFileList()">
          <div v-for="(fileInfo,index) in fileList" :key="fileInfo.fileID || fileInfo.bindId || fileInfo.id">
            <van-swipe-cell>
              <!-- 文档类型 -->
              <v-fileBox v-if="$route.query.mainType === 'DOCUMENT'" 
                :fileID="fileInfo.fileID" 
                :abstractContent="fileInfo.abstractContent" 
                :title="fileInfo.title" 
                :fileType="fileInfo.fileType"
                :previewPictureObjectName="fileInfo.previewPictureObjectName" 
                :readNum="fileInfo.fileExtraEntity?.readNum || 0" 
                :score="fileInfo.fileExtraEntity?.score || 0"
                :ratersNum="fileInfo.fileExtraEntity?.ratersNum || 0" 
                :paymentMethod="fileInfo.paymentMethod" 
                :paymentAmount="fileInfo.paymentAmount"
                :isVipIncome="fileInfo.fileExtraEntity?.isVipIncome || 0" 
                :fileTagList="fileInfo.tagNames || []" 
                class="preview__folder__filebox"></v-fileBox>
              
              <!-- 问题类型 -->
              <v-questionBox v-else-if="$route.query.mainType === 'QUESTION'" 
                :bindId="fileInfo.bindId"
                :title="fileInfo.title || ''"
                :content="fileInfo.content || ''"
                :userId="fileInfo.userId"
                :createTime="fileInfo.createTime"
                :updateTime="fileInfo.updateTime"
                :isDeleted="fileInfo.isDeleted"
                :isPosted="fileInfo.isPosted"
                :isHidden="fileInfo.isHidden"
                :rewardPoints="fileInfo.rewardPoints || 0"
                :answerCount="fileInfo.answerCount || 0"
                :viewCount="fileInfo.viewCount || 0"
                :likeCount="fileInfo.likeCount || 0"
                :isLiked="fileInfo.isLiked || false"
                :tagIds="fileInfo.tagIds || []"
                :attachmentIds="fileInfo.attachmentIds || []"
                class="preview__folder__filebox"></v-questionBox>
              
              <!-- 回答类型 -->
              <v-QandABox v-else-if="$route.query.mainType === 'ANSWER'" 
                :answer=fileInfo
                class="preview__folder__filebox">
              </v-QandABox>
              
              <template #right>
                <van-button square text="删除" type="danger" style="height: 100%" @click="deleteCollectionItem(index, fileInfo.fileID || fileInfo.bindId || fileInfo.id)" />
              </template>
            </van-swipe-cell>
          </div>
          <template #finished>
            <!--若无收藏夹则显示空提示-->
            <van-empty description="本收藏夹下还没有收藏文档" v-if="fileList.length==0">
              <template slot="image">
                <img src="@/images/empty-picture/no_data.svg" />
              </template>
            </van-empty>
            <div v-else class="notice-nomore__text">没有更多文档了</div>
          </template>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import fileBox from '../../components/fileBox';
import questionBox from '../../components/questionBox';
import QandABox from '../../components/QandABox';

export default {
  components: {
    'v-fileBox': fileBox,
    'v-questionBox': questionBox,
    'v-QandABox': QandABox,
  },
  data() {
    return {
      fileList: [],
      refreshing: false,
      loading: false,
      finished: false,
    };
  },
  mounted() {
    this.getCollectionFileList();
  },
  methods: {
    back() {
      // this.$router.go(-1); //返回上一层
      console.log(this.$route.query.active)
      this.$router.replace({
        path: '/myCollectionList',
        query: { active: this.$route.query.active }
      });
    },
    async getCollectionFileList() {
      this.loading = true;
      try {
        const response = await this.$Axios({
          method: 'get',
          url: '/collectionService/getCollectionItemList',
          params: {
            collectionID: this.$route.query.collectionID,
            mainType: this.$route.query.mainType,
          },
        });
        
        console.log('原始收藏列表:', response.data.msg);
        const itemList = response.data.msg || [];
        
        // 根据 mainType 获取详细信息
        if (this.$route.query.mainType === 'QUESTION') {
          // 获取问题详情
          const detailedQuestions = await Promise.all(
            itemList.map(async (item) => {
              try {
                const detailResponse = await this.$Axios({
                  method: 'get',
                  url: '/qaService/question/details',
                  params: {
                    questionId: item.fileID || item.bindId || item.id,
                  },
                });
                return detailResponse.data.msg;
              } catch (error) {
                console.error('获取问题详情失败:', error);
                return null;
              }
            })
          );
          this.fileList = detailedQuestions.filter(item => item !== null);
        } else if (this.$route.query.mainType === 'ANSWER') {
          // console.log("aaaaaa")
          console.log(itemList)
          // 使用 batch API 获取回答详情
          try {
            const answersResponse = await this.$Axios({
              method: 'post',
              url: '/qaService/answer/batch',
              data: {
                itemList: itemList, // 直接传递 itemList 给 batch API
              },
            });
            
            console.log('batch API 返回结果:', answersResponse.data.msg);
            this.fileList = answersResponse.data.msg.content || [];
          } catch (error) {
            console.error('batch API 调用失败:', error);
            // 如果API调用失败，直接使用原始数据
            this.fileList = itemList;
          }
        } else {
          // DOCUMENT 类型直接使用原数据
          this.fileList = itemList;
        }
        
        // console.log('处理后的详细列表:', this.fileList);
        
      } catch (error) {
        console.error('获取收藏列表失败:', error);
        this.fileList = [];
      } finally {
        this.loading = false;
        this.refreshing = false;
        this.finished = true; //一次性全部加载，直接完成
      }
    },
    deleteCollectionItem(index, itemID) {
      this.$Axios({
        method: 'get',
        url: '/collectionService/deleteCollectionItem',
        params: {
          collectionID: this.$route.query.collectionID,
          itemID: itemID, // 这里保持fileID参数名，后端可能需要统一处理
          mainType: this.$route.query.mainType,
        },
      }).then((response) => {
        if (response.data.state == "SUCCESS") {
          this.fileList.splice(index, 1);
        }
      });
    },
    toChangeCollection() {
      console.log(this.$route.query.mainType)
      this.$router.push({
        path: '/newCollection',
        query: {
          collectionID: this.$route.query.collectionID,
          collectionName: this.$route.query.collectionName,
          collectionDesc: this.$route.query.collectionDesc,
          isPublic: this.$route.query.isPublic,
          isChange: true,
          mainType: this.$route.query.mainType,
          active: this.$route.query.active
        },
      });
    },
  },
};
</script>

<style scoped>
</style>