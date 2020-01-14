<script>
	import Vue from 'vue'
	
	global.globalData={
			windowHeight:0,
			windowWidth:0,
			isNewUser:false,
			
			userInfo:"",
			
			openid:"", // 用户唯一标志
			appid:""  ,// 所用的小程序id
			nickName:"",
			gender:"",
			avatarUrl: "",
			city:"",
			province: "",
			country: "",
			
			unionid:"",
			
			stuRegister:false  /* 在进入页面的时候获取该信息 */
		}
	export default {
		onLaunch: function() { 
			// 生命周期函数 当页面加载时进行调用
			// 初始化云开发环境
			wx.cloud.init({
			env:"wlq-1011"
			}) 
			
			const db = wx.cloud.database().collection("userInfo")
			const stuRegistDatabase = wx.cloud.database().collection("studentRegister")
			// 检查用户信息表中是否有该用户 isNewUser 以便于后期获取用户信息 
			// 调用云函数获取用户 openid 
			wx.cloud.callFunction({
				name:"getopenid",
				success(res){
					console.log("获取用户openid信息成功。。",res)
					global.globalData.openid = res.result.openid,
					global.globalData.appid = res.result.appid
				} 
			})
			
			/* 获取用户信息 */
			wx.getSetting({
			    success: res => {
			        if (res.authSetting['scope.userInfo']) {
			          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						wx.getUserInfo({
							success: res => {
							// 可以将 res 发送给后台解码出 unionId
							global.globalData.userInfo = res.userInfo
							console.log("APP.vue中的获取用户信息", global.globalData.userInfo)
							
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
								}
							}
						})
			        }
			    }
			})
			
			setTimeout(function(){
				stuRegistDatabase.where({
					_openid: global.globalData.openid
				}).get({
					success(res){
						console.log(res.data.length)
						if (res.data.length == 0){
							global.globalData.stuRegister = false
							console.log("是一个新学生用户需要进行注册，目前状态",global.globalData.stuRegister)
						}
						else{
							console.log("数据库中有该学生的用户信息",res)
							global.globalData.stuRegister = true
						}	
					}
				}) 
			},3000) 
			
			setTimeout(function(){
				db.where({
					_openid: global.globalData.openid
				}).get({
					success(res){
						console.log(res.data.length)
						if (res.data.length == 0){
							global.globalData.isNewUser = true
							/* 公共的基础注册信息 */
							console.log("是一个新用户需要进行注册，目前状态",global.globalData.isNewUser)
						}
						else{
							console.log("数据库中有该用户信息",res)
							global.globalData.isNewUser = false
						}	
					}
				})
			},3000) 
			
			try {
				const res = uni.getSystemInfoSync();
				global.globalData.windowHeight = res.windowHeight;
				global.globalData.windowWidth = res.windowWidth;
				console.log(res)
				console.log("onlaunch时得到的手机尺寸数据",global.globalData.windowHeight, global.globalData.windowWidth)
			} catch (e) {  
				console.log("无法获取手机信息")
			}
				 
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			Vue.prototype.ColorList = [{
					title: '嫣红',
					name: 'red',
					color: '#e54d42'
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d'
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08'
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f'
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a'
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4'
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff'
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6'
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0'
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997'
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f'
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3'
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa'
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333'
				},
				{
					title: '雅白',
					name: 'white',
					color: '#ffffff'
				},
			]

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}

	}
</script>

<style>

	/* 顶部导航栏和input框使用到的样式 */
	@import "./common/uni.css";
	/* colorUI中的样式使用 */
	@import "./colorui/main.css";
	@import "./colorui/icon.css";
	/* 商城模板的样式 */
	@import "./common/app.css";



	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
</style>
