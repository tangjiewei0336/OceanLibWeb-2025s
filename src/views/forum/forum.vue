<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
            <AppHeader @open-ask="showDialog = true" />
        </v-app-bar>

        <!-- 弹窗，受 showDialog 控制 -->
        <v-dialog
            v-model="showDialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            persistent
        >
            <!-- 这里直接用 AskCard -->
            <AskCard @close="showDialog = false" />
        </v-dialog>

        <div style="margin-top: 220px; margin-bottom: 50px">
            <ContentCard
            title="THE WORLD!"
            :paraList="[20, 10, 20, 0, 5]"
            />
        </div>
        
        <v-bottom-navigation 
            app
            shift 
            color="primary" 
            grow 
            fixed
            v-model="navigation"
            class="bottom-nav-on-top"
        >
            <v-btn value="library" to="/index">
            <span>文库</span>
            <v-icon>mdi-text-box-search</v-icon>
            </v-btn>
            <v-btn value="help" to="/wall">
            <span>互助</span>
            <v-icon>mdi-handshake</v-icon>
            </v-btn>
            <v-btn value="mine" to="/mine">
            <span>我的</span>
            <v-icon>mdi-account-circle</v-icon>
            </v-btn>
            <v-btn value="forum" to="/forum/hot">
            <span>知乎</span>
            <v-icon>mdi-forum</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
  </template>
  
<script>
import AppHeader from '../../components/nav/ForumHeadBar.vue'
import ContentCard from '../../components/forum/ContentCard.vue';
import AskCard from '../../components/forum/AskCard.vue'

export default {
    components: { AppHeader, ContentCard, AskCard },
    data() {
        return {
        navigation: null,
        showDialog: false,
        }
    }
}
</script>

<style scoped>
.bottom-nav-on-top {
  z-index: 2000; /* 确保底部导航在弹窗之上 */
}
</style>