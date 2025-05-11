<template>
    <v-app-bar app flat height="auto" class="multi-line-bar">
		<v-container>
			<v-row>
				<img 
					src="@/assets/zhihu.png" 
					alt="Custom Icon"
					style="width: 200px; height: 100px; margin-right: 8px"
				>
			</v-row>
			<v-row>
				<v-btn text class="nav-item" to="/forum/recommend" active-class="active-link">
					<v-icon left>mdi-star-box</v-icon>
					<span>推荐</span>
				</v-btn>
				<v-btn text class="nav-item" to="/forum/question" active-class="active-link">
					<v-icon left>mdi-pen</v-icon>
					<span>直答</span>
				</v-btn>
				<!-- <v-btn text class="nav-item" to="/forum/ask" active-class="active-link">
					<v-badge dot color="error">
						<v-icon left>mdi-comment-question</v-icon>
					</v-badge>
					<span>提问</span>
				</v-btn> -->
				<v-btn text class="nav-item" @click="showDialog = true" active-class="active-link">
                    <v-badge dot color="error">
                        <v-icon left>mdi-comment-question</v-icon>
                    </v-badge>
                    <span>提问</span>
                </v-btn>
				<v-btn text class="nav-item" to="/forum/mine" active-class="active-link">
					<v-icon left>mdi-account</v-icon>
					<span>我的</span>
				</v-btn>
			</v-row>
		</v-container>

		<!-- 提问弹窗 -->
        <v-dialog v-model="showDialog" max-width="600px">
            <AskCard @close="showDialog = false" />
        </v-dialog>

    </v-app-bar>
  </template>
  
<script>
import AskCard from '../forum/AskCard.vue';

export default {
	name: 'AppHeader',
	components: { AskCard },
    data() {
        return {
            showDialog: false
        };
    }
}
</script>

<style scoped>
.multi-line-bar {
    height: auto !important;
}
  
.search-field {
    margin: 8px 0;
}
  
.nav-toolbar {
    display: flex;
    justify-content: space-around;
    padding: 0;
}

.nav-item::before {
  opacity: 0;
}

.nav-item {
    flex: 1;
    min-width: 0;
    text-transform: none;
}
  
.nav-item span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.active-link {
  	position: relative;
}

.active-link::after {
	content: '';
	position: absolute;
	left: 16px;  /* 调整与图标对齐 */
	right: 16px;
	bottom: 8px;
	height: 2px;
	background: #1976D2; /* Vuetify主蓝色 */
}

</style>

<!--           
<v-col cols="12">
	<v-text-field
		solo flat hide-details
		prepend-inner-icon="mdi-magnify"
		class="search-field"
	></v-text-field>
</v-col>
 -->