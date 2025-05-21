<style scoped lang="less">
@import '~@/vant-variables.less';
.ForumHeadBar {
	display: flex;
	flex-direction: column;
	background-color: white;
	padding: 0px 0px;

	&__logo {
		width: 120px;
	}

	&__searchBox {
		margin: 5px 0px;
		padding: 0px 20px;
	}

	&__title {
		padding: 0px 20px;
	}

	&__multi-line-bar {
		height: auto !important;
	}

	&__search-row {
		background-color: white;
		padding: 0 20px;
	}
	  
	&__nav-toolbar {
		display: flex;
		justify-content: space-around;
		padding: 0;
	}
	
	&__nav-item::before {
	  opacity: 0;
	}
	
	&__nav-item {
		flex: 1;
		min-width: 0;
		text-transform: none;
	}
	  
	&__nav-item span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	&__active-link {
		position: relative;
	}
	
	&__active-link::after {
		content: '';
		position: absolute;
		left: 16px;  /* 调整与图标对齐 */
		right: 16px;
		bottom: 8px;
		height: 3px;
		background: #1976D2; /* Vuetify主蓝色 */
	}
}

  

</style>
<template>
	<div class="ForumHeadBar">
		<div class="text-h5 ForumHeadBar__title" style="margin:20px 0px">
			<span class="text-h5">校园知乎</span>
		</div>
		<div class="ForumHeadBar__searchBox" @click="toSearch">
			<v-text-field outlined readonly dense hide-details="auto" prepend-inner-icon="mdi-magnify">
			<template v-slot:label>
				<div class="text-body-2 text--secondary">请输入你想搜索的问题</div>
			</template>
			</v-text-field>
		</div>
		<v-app-bar flat height="auto" color="white" class="ForumHeadBar__multi-line-bar">			
			<div>
				<v-container>
					<v-row>
						<!-- <v-btn text class="nav-item" to="/forum/recommend" active-class="active-link">
							<v-icon left>mdi-star-box</v-icon>
							<span>推荐</span>
						</v-btn> -->
						<v-btn text class="ForumHeadBar__nav-item" to="/forum/hot" active-class="ForumHeadBar__active-link">
							<v-icon left>mdi-fire</v-icon>
							<span>热榜</span>
						</v-btn>
						<v-btn text class="ForumHeadBar__nav-item" to="/forum/question" active-class="ForumHeadBar__active-link">
							<v-icon left>mdi-pen</v-icon>
							<span>直答</span>
						</v-btn>
						<v-btn text class="ForumHeadBar__nav-item" @click="showDialog = true" active-class="ForumHeadBar__active-link">
							<v-icon left>mdi-comment-question</v-icon>
							<span>提问</span>
						</v-btn>
						
					</v-row>
				</v-container>
			</div>
			<v-dialog
				v-model="showDialog"
				fullscreen
				hide-overlay
				transition="dialog-bottom-transition"
				persistent
			>
				<AskCard @close="showDialog = false" />
			</v-dialog>

		</v-app-bar>
	</div>
</template>

  
<script>
import AskCard from '@/components/forum/AskCard.vue'

export default {
  name: 'AppHeader',
  components: { AskCard },
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
	toSearch() {
      this.$router.push({
        path: 'questionSearch',
      });
    },
  }
}
</script>