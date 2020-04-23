<template>
	<view class="contain" style="background-color:rgb(237,237,237)">
		<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
			<view class="tui-header" :style="{paddingTop:top+'px', opacity:opcity}">
				我的
			</view>
			<!-- #ifndef MP -->
			<view class="tui-header-icon" :style="{marginTop:top+'px'}" @tap="href(1)">
				<view class="tui-icon-box tui-icon-message">
					<tui-icon name="message" :color="opcity>0.02?`rgba(85,85,85,${opcity})`:'#fff'" :size="26"></tui-icon>
					<view class="tui-badge" :class="[opcity>0.05?'tui-badge-red':'tui-badge-white']">1</view>
				</view>
				<view class="tui-icon-box tui-icon-setup" @tap="href(2)">
					<tui-icon name="setup" :color="opcity>0.02?`rgba(85,85,85,${opcity})`:'#fff'" :size="26"></tui-icon>
				</view>
			</view>
			<!-- #endif -->
		</view>
		
		<view class="topSelection">
			<!-- 扫码，编辑个人信息，设置按钮 -->
			<view style="margin-top:30px;margin-left: 5%; z-index: 2; width: 80%; right: 0px;">
				<uni-icons type="scan" color="white" size="28" style="margin-right: 10px;margin-left:10px"></uni-icons>
				<uni-icons type="gear-filled" color="white" size="30" style="margin-right: 10px;margin-left:10px"></uni-icons>
			</view>
		</view>
 
		<view class="personCard">
			<!-- 显示 头像，关键数据，如积分，金额等 -->				
			<!-- class="cu-avatar lg margin-left" style=" background-color: #FFFFFF;"-->
			<view class="userInfoShow">
				<view style="width: 128rpx; height: 128rpx;margin: 0;" @click="tryLoginWithWechat" class="cu-avatar radius margin-left" :style="[{backgroundImage:'url('+avatarUrl+ ')'}]">
					<view class="cu-tag badge" :class="gender==0?'cuIcon-female bg-pink':'cuIcon-male bg-blue'"></view>
				</view>
				<view class="solid-top text-xl text-black text-bold" @click="tryLoginWithWechat">{{nickName}}</view>
				<text class="text-black text-gray text-lg" style="right:20px;" @click="toMySelfPage">个人主页 ></text>
			</view>
		</view>
		
		<view class="middleNav" style="margin-top: 230px;" >
			<view class="cu-list grid col-4 border">
				<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" v-if="index<gridCol*2">
					<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
						<view class="cu-tag badge" v-if="item.badge!=0">
							<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
						</view>
					</view>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 中间短边框 -->
		<view class="cu-bar bg-white solid-bottom " style="margin: 10px 0px;">
			<view class="action">
				<text class="cuIcon-title text-orange"></text> 特殊服务
			</view>
			<view class="action">
				<button class="cu-btn bg-gray shadow" @tap="showModal" data-target="menuModal">进入</button>
			</view>
		</view>
		<!-- 下面是各种功能选项 -->
		<view class="cu-list menu sm-border card-menu">
			<view class="cu-item arrow" >
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">图标 + 标题</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<view class="content">
					<image src="/static/img/logo.png" class="png" mode="aspectFit"></image>
					<text class="text-grey">图片 + 标题</text>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-btn text-olive"></text>
					<text class="text-grey">Open-type 按钮</text>
				</button>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-discoverfill text-orange"></text>
					<text class="text-grey">Navigator 跳转</text>
				</navigator>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-emojiflashfill text-pink"></text>
					<text class="text-grey">头像组</text>
				</view>
				<view class="action">
					<view class="cu-avatar-group">
						<view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
						<view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg);"></view>
						<view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg);"></view>
						<view class="cu-avatar round sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg);"></view>
					</view>
					<text class="text-grey text-sm">4 人</text>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-btn text-green"></text>
					<text class="text-grey">按钮</text>
				</view>
				<view class="action">
					<button class="cu-btn round bg-green shadow">
						<text class="cuIcon-upload"></text> 上传</button>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-tagfill text-red  margin-right-xs"></text>
					<text class="text-grey">标签</text>
				</view>
				<view class="action">
					<view class="cu-tag round bg-orange light">音乐</view>
					<view class="cu-tag round bg-olive light">电影</view>
					<view class="cu-tag round bg-blue light">旅行</view>
				</view>
			</view>
			<view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-warn text-green"></text>
					<text class="text-grey">文本</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">小目标还没有实现！</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-clothesfill text-blue margin-right-xs"></text> 多行Item</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text> 小目标还没有实现！</view>
				</view>
				<view class="action">
					<switch class="switch-sex" @change="SwitchSex" :class="skin?'checked':''" :checked="skin?true:false"></switch>
				</view>
			</view>
		</view>
	</view>
</template> 

<script>
	import app from "../../../App.vue"
	var db = wx.cloud.database().collection("userInfo")  
	export default {
		data() {
			return {
				avatarUrl:"../../../static/logo.png",
				nickName:"未登录",
				gender:"",
				hasUserInfo: false,
				canIUse: wx.canIUse('button.open-type.getUserInfo'),
				userInfo:{},
				
				height: 64, //header高度
				top: 5, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,

				personInfo :[{
					nickName:"",  // 昵称
					age:"",			
					sex:"",  
					career:"",
					schoolData:'',
					provinceSchool:"",
					longitude:"", /* 用户当前位置*/
					latitude:"",
					location:"", 
				}],
				
				title: 'Hello',
				ColorList: this.ColorList,
				avatar: [
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
				],
				cuIconList: [{
					cuIcon: 'cardboardfill',
					color: 'red',
					badge: 120,
					name: 'VR'
				}, {
					cuIcon: 'recordfill',
					color: 'orange',
					badge: 1,
					name: '录像'
				}, {
					cuIcon: 'picfill',
					color: 'yellow',
					badge: 0,
					name: '图像'
				}, {
					cuIcon: 'noticefill',
					color: 'olive',
					badge: 22,
					name: '通知'
				}, {
					cuIcon: 'upstagefill',
					color: 'cyan',
					badge: 0,
					name: '排行榜'
				}, {
					cuIcon: 'clothesfill',
					color: 'blue',
					badge: 0,
					name: '皮肤'
				}, {
					cuIcon: 'discoverfill',
					color: 'purple',
					badge: 0,
					name: '发现'
				}, {
					cuIcon: 'questionfill',
					color: 'mauve',
					badge: 0,
					name: '帮助'
				}, {
					cuIcon: 'commandfill',
					color: 'purple',
					badge: 0,
					name: '问答'
				}, {
					cuIcon: 'brandfill',
					color: 'mauve',
					badge: 0,
					name: '版权'
				}],
				modalName: null,
				gridCol:4,
				gridBorder: true,
				menuBorder: true,
				menuArrow: true,
				menuCard: true,
				skin: true,
				listTouchStart: 0,
				listTouchDirection: null,
			}
		}, 
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
		},
		
		onLoad(e) {

			// 读取数据库 获取个人信息
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			
			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.scrollH = res.windowWidth
				}
			})
		}, 
		
		onShow() {
			/* 当用用户打开此页面时时获取用户 之前加载的信息 */
			this.setData({
				hasUserInfo:app.globalData.hasUserInfo
			})
			if (app.globalData.hasUserInfo) {
				this.setData({
					nickName: app.globalData.userInfo.nickName,
					gender: app.globalData.userInfo.gender,
					userInfo: app.globalData.userInfo,
					avatarUrl:app.globalData.userInfo.avatarUrl,
					hasUserInfo: true
				})
			}
		},
		
		methods: {
			tryLoginWithWechat(){
				if(this.nickName == "未登录"){
					console.log("没有登录")
					uni.navigateTo({
						url:"../../login/login"
					})
				}
			},
			
			setData:function(obj){
			let that = this;    
			let keys = [];    
			let val,data;    
			Object.keys(obj).forEach(function(key){    
			 keys = key.split('.');    
			 val = obj[key];     
			 data = that.$data;    
			 keys.forEach(function(key2,index){    
			     if(index+1 == keys.length){    
			         that.$set(data,key2,val);    
			     }else{    
			         if(!data[key2]){    
			            that.$set(data,key2,{});    
						}    
					}    
			     data = data[key2];    
					})    
				});    
			},
			
			getUserInfo: function(e) {
				// 只在用户点击button时才会触发这个按钮
			        console.log(e)
			        app.globalData.userInfo = e.detail.userInfo
			        this.setData({
			            userInfo: e.detail.userInfo,
			            hasUserInfo: true
			        })
			    },
							
			toMySelfPage(){
				// 条状个人信息主要
				uni.navigateTo({
					url:"../../MySelfPage/MySelfPage"
				})
			},
			
			/* 用于获取app产生的数据 */
			getAppUserInfo(){  
				console.log("用户openid ",app.globalData.openid)
				db.where({
					_openid:app.globalData.openid
				}).get({
					success: this.handleGetAppUserInfoSucc.bind(this)
				}) 
			},
			handleGetAppUserInfoSucc(res){
				console.log("获取app产生的数据 ",res, res.data[0])
				const te = res.data	
				const personInfo = te.map((value, index)=>{
					return{
						nickName:value.nickName,  // 昵称
						age:value.age,			
						sex:value.sex,  
						career:value.career,
						schoolData:value.schoolData,
						provinceSchool:value.provinceSchool,
						longitude:value.longitude, /* 用户当前位置*/
						latitude:value.latitude,
						location:value.location,
					}
				})
				this.personInfo = personInfo ;
				console.log("tap5 用户信息", this.personInfo)			
			},
			fail(err){
				console.log("tap5 用户信息失败。。。",err)
			}
		}
	}
</script>

<style lang="scss">
	
	.contain{		
		.topSelection{
			position: absolute;
			top: 0px;
			height: 160px;
			width: 100%;
			background-color: #8bb8fc;
			// border-bottom-left-radius: 0.5;
			border-bottom-right-radius: 60upx;
			border-bottom-left-radius: 60upx;
			z-index: 1;
		}
		// 用户具体信息展示
		.personCard{
			position: absolute;
			display: flex;
			flex-direction: row;
			width: 90%;
			height: 150px;
			border-radius: 12px;
			margin: 0 5%;
			top: 70px;
			z-index: 9;
			background-color: #FFFFFF;
			
			.namePage{
				position: relative;
				margin: 10px 20px;
				margin-top: 20px;
				width: 80%;
				height: 40px;
				display: flex;
				justify-content: space-between;
				align-items: center;
 			} 
		}
	}

		.tui-header-box {
			width: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 9998;
		}
	
		.tui-header {
			width: 100%;
			font-size: 18px;
			line-height: 18px;
			font-weight: 500;
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 15px;
		}
	
		/* #ifndef MP */
		.tui-header-icon {
			position: fixed;
			top: 0;
			right: 15px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 32px;
			transform: translateZ(0);
			z-index: 99999;
		}
	
		/* #endif */
		/* #ifdef MP */
		.tui-set-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	
		/* #endif */
		.tui-icon-box {
			position: relative;
		}
	
		.tui-icon-setup {
			margin-left: 8rpx;
		}
	
		.tui-badge {
			position: absolute;
			font-size: 24rpx;
			height: 32rpx;
			min-width: 20rpx;
			padding: 0 6rpx;
			border-radius: 40rpx;
			right: 10rpx;
			top: -5rpx;
			transform: scale(0.8) translateX(60%);
			transform-origin: center center;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
		}
	
		.tui-badge-red {
			background: #F74D54;
			color: #fff;
		}
	
		.tui-badge-white {
			background: #fff;
			color: #F74D54;
		}
	
		.tui-badge-dot {
			position: absolute;
			height: 12rpx;
			width: 12rpx;
			border-radius: 50%;
			right: -12rpx;
			top: 0;
			background: #F74D54;
		}
	
		.tui-mybg-box {
			width: 100%;
			position: relative;
		}
	
		.tui-my-bg {
			width: 100%;
			display: block;
		}
	
		.tui-header-center {
			position: absolute;
			width: 100%;
			height: 128rpx;
			left: 0;
			top: 120rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
		}
	
		.tui-avatar {
			flex-shrink: 0;
			width: 128rpx;
			height: 128rpx;
			display: block;
		}
	
		.tui-info {
			width: 60%;
			padding-left: 30rpx;
	
		}
	
		.tui-nickname {
			font-size: 30rpx;
			font-weight: 500;
			color: #fff;
			display: flex;
			align-items: center;
		}
	
		.tui-img-vip {
			width: 56rpx;
			height: 24rpx;
			margin-left: 18rpx;
		}
	
		.tui-explain {
			width: 80%;
			font-size: 24rpx;
			font-weight: 400;
			color: #fff;
			opacity: 0.75;
			padding-top: 8rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	
		.tui-btn-edit {
			flex-shrink: 0;
			padding-right: 22rpx;
		}
	
		.tui-header-btm {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			position: absolute;
			left: 0;
			top: 280rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #fff;
		}
	
		.tui-btm-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	
		.tui-btm-num {
			font-size: 32rpx;
			font-weight: 600;
			position: relative;
		}
	
		.tui-btm-text {
			font-size: 24rpx;
			opacity: 0.85;
			padding-top: 4rpx;
		}
	
		.tui-content-box {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			position: relative;
			top: -72rpx;
			z-index: 10;
		}
	
		.tui-box {
			width: 100%;
			background: #fff;
			box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
			border-radius: 10rpx;
			overflow: hidden;
		}
	
		.tui-order-box {
			height: 208rpx;
		}
	
		.tui-cell-header {
			width: 100%;
			height: 74rpx;
			padding: 0 26rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	
		.tui-cell-title {
			font-size: 30rpx;
			line-height: 30rpx;
			font-weight: 600;
			color: #333;
		}
	
		.tui-cell-sub {
			font-size: 26rpx;
			font-weight: 400;
			color: #999;
			padding-right: 28rpx;
		}
	
		.tui-order-list {
			width: 100%;
			height: 134rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
	
		}
	
		.tui-order-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	
		.tui-order-text,
		.tui-tool-text {
			font-size: 26rpx;
			font-weight: 400;
			color: #666;
			padding-top: 4rpx;
		}
	
		.tui-tool-text {
			font-size: 24rpx;
		}
	
		.tui-order-icon {
			width: 56rpx;
			height: 56rpx;
			display: block;
		}
	
		.tui-assets-box {
			height: 178rpx;
			margin-top: 20rpx;
		}
	
		.tui-assets-list {
			height: 84rpx;
		}
	
		.tui-assets-num {
			font-size: 32rpx;
			font-weight: 500;
			color: #333;
			position: relative;
		}
	
		.tui-assets-text {
			font-size: 24rpx;
			font-weight: 400;
			color: #666;
			padding-top: 6rpx;
		}
	
		.tui-tool-box {
			margin-top: 20rpx;
		}
	
		.tui-flex-wrap {
			flex-wrap: wrap;
			height: auto;
			padding-bottom: 30rpx;
		}
	
		.tui-tool-item {
			width: 25%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding-top: 30rpx;
		}
	
		.tui-tool-icon {
			width: 64rpx;
			height: 64rpx;
			display: block;
		}
	
		.tui-badge-icon {
			width: 66rpx;
			height: 30rpx;
			position: absolute;
			right: 0;
			transform: translateX(88%);
			top: -15rpx;
		}
	
		/*为你推荐*/
		.tui-product-list {
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			flex-wrap: wrap;
			box-sizing: border-box;
		}
	
		.tui-product-container {
			flex: 1;
			margin-right: 2%;
		}
	
		.tui-product-container:last-child {
			margin-right: 0;
		}
	
		.tui-pro-item {
			width: 100%;
			margin-bottom: 4%;
			background: #fff;
			box-sizing: border-box;
			border-radius: 12rpx;
			overflow: hidden;
		}
	
		.tui-pro-img {
			width: 100%;
			display: block;
		}
	
		.tui-pro-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 20rpx;
		}
	
		.tui-pro-tit {
			color: #2e2e2e;
			font-size: 26rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	
		.tui-pro-price {
			padding-top: 18rpx;
		}
	
		.tui-sale-price {
			font-size: 34rpx;
			font-weight: 500;
			color: #e41f19;
		}
	
		.tui-factory-price {
			font-size: 24rpx;
			color: #a0a0a0;
			text-decoration: line-through;
			padding-left: 12rpx;
		}
	
		.tui-pro-pay {
			padding-top: 10rpx;
			font-size: 24rpx;
			color: #656565;
		}
		.userInfoShow{
			margin: 20rpx 0 0 20rpx;
			display: flex;
			flex-direction: row;
			width: 90%;
			justify-content: space-between;
			align-items: center;
			height: 128rpx;
		}
	
</style>
