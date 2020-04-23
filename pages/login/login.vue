<template>
    <view class="page">
        <view class="container">
			<image class="avatar" src="../../static/logo.png" mode="aspectFit"></image>			
            <view class="title">识涯互助</view>
        </view>
        <view class="midleBox">
            <view class="tips">请完成微信授权以继续使用</view>
            <button open-type="getUserInfo" class="button" @getuserinfo="getUserInfo">微信用户一键登录</button>
            <button open-type="getPhoneNumber" class="tips" @getphonenumber="getPhoneNumber">手机号登陆/注册</button>
        </view>
        <view class="protocal">
			<view>登录表代表您已同意</view>
			<view class="protocalDetail" style="color: #d9933d">
				<view @click="userProtocal">YaYa用户协议</view>
				<view style="color: #000000;">、</view>
				<view @click="userSecret">隐私协议</view>
			</view>
        </view>
		<!-- TODO 底部模态框获取用户手机号 -->
		<!-- <view class="cu-modal bottom-modal" :class="!hasGetPhoneNumber?'show':''">
			<view class="cu-dialog">
				<view class="page1">
					<view class="head1">
						<image class="avatar1" mode="aspectFill" src="../../static/logo.png"></image>
						<view class="title1"> YaYa互助 </view>
						<view style="margin: auto 20px; font-size: 20px"> 申请获得 </view>
					</view>
					<view class="midleBox1">
						<view class= "charPhoneNumber1">你的手机号码 </view>
						<view class="phoneNumber1">
							<view>{{phonenumber}}</view>
							<view style="margin-left: 20px; font-size: 18px">微信绑定号码</view>
						</view>
						<view style="color:#607298">使用其他手机号</view>
					</view>
				</view>  
				<view class="choose1">
					<button class="wlq-button1" style="background-color: lavender; color: black;font-weight: bold ">拒绝</button>
					<button class="wlq-button1">允许</button>
				</view>
			</view>
		</view> -->
		<!-- 授权 获取手机号之后 延时返回 我的页面 -->
<!-- 		<view class="cu-load load-modal" v-if="hasUserInfo">
			<view class="cuIcon-emojifill text-orange"></view>
			<image src="/static/logo.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view> -->
    </view>
</template>

<script>
	export default {
		
		data() {
			return {
				phonenumber:"18893345033",
				hasUserInfo:"",
				hasGetPhoneNumber:true  /* 用于显示获取用户微信绑定手机号 */
			}
		},
		methods: {
			getPhoneNumber(e){
				/* 获取微信的手机号 */
				console.log("检查获取的数据是否完全", "1、encryptedData", e.detail.encryptedData,
				"2、iv", e.detail.iv,"3、sessionCode", getApp().globalData.sessionCode)
				// 下面这部分 在获取了openid之后进行测试
				/* if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
					wx.showModal({
						content: '不能获取手机号码',
						showCancel: false
					})
					return;
				}
				wx.showLoading({
					title: '获取手机号中...',
				})
				
				wx.cloud.callFunction({
					name: 'getToken', // 对应云函数名
					data: {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						sessionCode: app.globalData.sessionCode // 这个通过wx.login获取，去了解一下就知道。这不多描述
					},
					success: res => {
						wx.hideLoading()
						// 成功拿到手机号，跳转首页
						wx.switchTab({
							url: '../index/index' // 这里是要跳转的路径
						})
					},
					fail: err => {
						console.error(err);
						wx.showToast({
							title: '获取手hh机号失败',
							icon: 'none'
						})
					}
				}) */
			},
			
			getUserInfo(e){
				getApp().globalData.userInfo = e.detail.userInfo
				getApp().globalData.hasUserInfo= true
				this.setData({
				  hasUserInfo: true
				})
				console.log("GlobalData中的信息", getApp().globalData)
				
				if(getApp().globalData.userInfo){
					wx.showToast({
						title:"登录成功",
						icon:"success",
						duration:1500,
						mask:true,
						success:function(){
							setTimeout(
								function(){
									console.log("登陆成功")
									uni.navigateBack({
										delta:1
									})
								}
							,2000)
						}
					})
				}
			},
			userProtocal(){
				console.log("跳转用户协议页面进行查看")
			},
			userSecret(){
				console.log(getApp())
				console.log("跳转用户隐私页面")
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
			}  
		}
	}
</script>

<style>
    .page{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 600rpx;
    }
    .avatar{
        width: 200rpx;
        height: 200rpx;
        border: 4rpx solid;
        border-color: darkgray;
        border-radius: 40rpx;;
    }
    .title{
        font : normal bold 44rpx sans-serif;
        color: black;
        margin: 10rpx auto;
    }
    .midleBox{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        line-height: 100rpx;
    }
    .tips{
        font-size: 32rpx;
        color: #607298;
    }
    .protocal{
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 150rpx;
		font-size: 30rpx;
    }
    .button{
        font-size: 38rpx;
        width: 80%;
        line-height: 80rpx;
        background-color: #1aac19;
        color: white;
    }
	.protocalDetail{
		display: flex;
		
	}
	
	.page1{
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: start;
	}
	.head1{
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		width: 100%;
		height: 50px;
	}
	.avatar1{
		width: 35px;
		height: 35px;
		border: 2px solid;
		border-color: darkgray;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 15px;
	}
	.title1{
		font : normal bold 22px sans-serif;
		color: black;
	}
	.midleBox1{
		display: flex;
		margin: 30px 0;
		padding:0 20px;
		flex-direction: column;
		justify-content: flex-start;
		align-content: flex-start;
		align-items: flex-start;
		width: 100%;
		line-height: 50px;
	}
	.charPhoneNumber1{
 		border-bottom: 2px solid lavender;
		font: bold 20px SansSerif;
		width: 100%;
		height: 40px;
		left: 50px;
		text-align: start;
	}
	.phoneNumber1{
		display: flex;
		flex-direction: row;
		align-items: center;
		border-bottom: 2px solid lavender;
		font: normal 20px SansSerif;
		height: 40px;
		width: 100%;
		margin-top: 10px;
	}

	.choose1{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 30px;
		padding: 0 30px 0 30px;
	}

	.wlq-button1{
		/*padding: 0 10px;*/
		font-size: 20px;
		width: 30%;
		line-height: 35px;
		background-color: #1aac19;
		color: white;
	}


</style>
