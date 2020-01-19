<template>
	<view class="container_wlq">
		<view class='nav'> 
			<!-- 导航栏agents导航栏标题 -->
			<navTab class="navTab" ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab"></navTab>
		</view>
		<!-- map -->
		<view class="map-container" v-if="currentTab ==0 ">
			<map class="map" id="mymap" show-location="true" :markers="markers" 
			@markertap="handleMarkerTap" @controltap="controlTap" 
			:longitude="longitude" :latitude="latitude" scale="14" :controls="controls"></map>
		</view>
		
		<view style="margin-top: 40px;" v-if="currentTab == 2"> <!-- 暂时不显示这部分-->
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,key) in markers" :key="key">
				<view class="cu-card dynamic" @click="clickList" :id="item.id">
					<view style="margin: 1px 10px; padding-bottom: 5px; border-radius: 12px;"  class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view style="height: 120rpx;" class="cu-item">
								<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
								<view class="content flex-sub">
									<view>凯尔</view>
									<view class="text-gray text-sm flex justify-between">
										2019年12月3日
									</view>
								</view>
							</view>
						</view>
						<view style="max-height:100px; margin-bottom: 0px;" class="text-content " >
							折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！折磨生出苦难，苦难又会加剧折磨，凡间这无穷的循环，将有我来终结！
						</view>
						<view class="text-gray text-sm text-right" style="padding:10rpx 30px;">
							<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
							<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
							<text class="cuIcon-messagefill margin-lr-xs"></text> 30
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 模态弹框用于用户选择职业类型 和 用户昵称 -->
		<view class="cu-modal" :class="modalName=='open'?'show':''">
		<!-- <view class="cu-modal" :class="app.globalData.isNewUser?'show':''"> -->
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">了解你才能让你找到最合适的</view>
					<view class="action" @tap="hideModal" id="notWriteForm">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view> 
				<view class="padding-lg">
					<form>
						<view class="cu-form-group  padding-lg">
							<view class="title">昵称</view>
							<input class="uni-input" placeholder="起个令人印象深刻的名字吧" name="input" @input="nikeNameInput"></input>
						</view>
						<view class="cu-form-group flex">
							<view class="title">性别</view>
							<view v-if="sexSwitch" style="color: #0081FF;margin-left: 150px;">男</view>
							<view style="color:#ED1C24; right: 30px;margin-left: 150px;" v-else>女</view>
							<switch class='switch-sex' @change="sexSwitchChange" :class="sexSwitch?'checked':'notChecked'" :checked="sexSwitch?true:false"></switch>
						</view>
						<view class="cu-form-group">
							<view class="title">年龄</view>
							<input placeholder="不要乱填哦!" name="input" @input="ageInput"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">职业</view>
							<picker @change="PickerChange" :value="index" :range="picker">
								<view class="picker">
									{{index>-1?picker[index]:'共同职业的人有更大的相遇机会哦！'}}
								</view>
							</picker>
						</view>
						<!-- 天涯人 -->
						<view class="cu-form-group" v-if="index == 2">
							<view class="title">哪一类？</view>
							<picker mode="multiSelector" @change="MultiChange" @columnchange="MultiColumnChange" :value="multiIndex" :range="multiArray">
								<view class="picker">
									{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}
								</view>
							</picker>
						</view>
						<!-- 学生或高校从业者 进行进一步选择 -->
						<view class="cu-form-group" v-if="index == 0" @click="showSchoolPicker">
							<view class="title">还有谁？</view>
								<view class="picker">
									{{provinceSchool}}
								</view>
						</view>
						<schoolPicker themeColor="#000" ref="schoolPicker" @onConfirm="onConfirm"></schoolPicker>
						
					</form>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal" id="cancelFormList">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="hideModal" id="conformFormList">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const util = require('../../../util/util.js');
	import refresh from '../../../components/refresh.vue';
	import navTab from '../../../components/navTab.vue';
	import tabBar4 from '../../../components/tabBar4.vue';
	import schoolPicker from '../../../components/schoolPicker/schoolPicker.vue';
	
	import app from "../../../App.vue"

	const DB = wx.cloud.database().collection("users");
	const db = wx.cloud.database().collection("userInfo")

export default {
	components: {refresh,navTab,tabBar4,schoolPicker},
	
	data(){
		return {
			hasUserInfo: false,
			canIUse: wx.canIUse('button.open-type.getUserInfo'),
			userInfo:{},
			// showGetInfo: false,
			// 弹框
			modalName: "close",
			
			// 表单返回的数据
			isDo:"",
			nickName:"",  // 昵称
			age:"",			
			sex:"男",  
			career:"",
			schoolData: '',
			provinceSchool:"",
			longitude:"", /* 用户当前位置*/
			latitude:"",
			location:"",
		
			sexSwitch: true,   // 这时为男的  数据
			
			index: -1,
			picker: ['学生或高校从业者', '社会精英', '天涯人'],
	
			multiIndex: [0, 0, 0],
			multiArray: [
				['无脊柱动物', '脊柱动物'],
				['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
				['猪肉绦虫', '吸血虫']
			],

			controls:[{
			  id:1,
			  iconPath:'/static/img/map/map_position.png',
			  position:{
			    left:(app.globalData.windowWidth/2)-30, 
			    top: ((app.globalData.windowHeight-40) / 2)-30 ,
			    width:60, // 20
			    height:60 // 25
			  },
			  clickable: false
			}, {
			    id: 2,
			    iconPath: '/static/img/map/map_recover.png',
			    position: {
			      left: 300, 
			      top: app.globalData.windowHeight-60,
			      width: 40, // 20
			      height: 40 ,// 25
			    },
			    clickable: true
			  }],
			  markers: [{
			    // 红色图标代表 有需求要找人解决的 紧急需要解决 表示 发布任务 状态的人 
			    // 绿色图标 提供服务 的人  查看之后直接找他进行服务便可 
			    // 拓展功能 以自己多少米范围来提供数据
			    iconPath: "",
			    id: 0,
			    latitude: "",
			    longitude: "",
			    width: 20,
			    height: 25
			  }], 

			currentPage:'index',
			tabTitle:['附近','列表'], //导航栏格式 --导航栏组件
			currentTab: 0, //sweiper所在页

		};
	},
	onLoad(e) {
		/* 当用用户打开时获取用户 之前加载的信息 */
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	
	onHide() {},
	
	onReady(){ // 生命周期函数当 页面加载完毕时执行
		this.mapCtx = wx.createMapContext("mymap"); // 管理地图的剩下文 当点击时
	},
	
	onShow(){
		if (app.globalData.isNewUser){
			this.modalName = "open" 
			console.log("没有注册 打开弹框 获取信息")
		}
		
		console.log("打开首页页面获取定位信息");
		this.getLocation()
		this.getMessage()   
		},
	  
	methods: {
	
		// 分享页面
		onShareAppMessage(){
		  return { 
		    title:"每个人都是可以让信息产生收益",
		    path:"/pages/index/index"
		  }
		},
		clickList(res){
			console.log("点击list,中的一个卡片跳转个人页面",res, res.myId)
			wx.navigateTo({
			    url: '/pages/detail/detail?id=' + res.currentTarget.id,
			  })
		},
		search(res){
			console.log("输入结束，开始从数据库检索需要的关键词 并存储在marker中",res.target.value)
			this.getSelectInfo(res.target.value)
		},
		
		getSelectInfo(message){
		   DB.where({
		     message:message
		   }).get({
		     success: this.handlegetMessageSucc.bind(this)
		   })
		},
 
		controlTap(){
		  // console.log(e)
		  // 将点移动到原点
		  this.mapCtx.moveToLocation();
		},
		
		handleMarkerTap(e){
		console.log("点击图标跳转详情页面",e,e.markerId)
		wx.navigateTo({
		    url: '/pages/detail/detail?id=' + e.markerId,
		  })
		},
		
		getMessage(){
			DB.get({
			  success: this.handlegetMessageSucc.bind(this),
			})
		  }, 
		handlegetMessageSucc(res){
			console.log("查询数据成功。。。",res.data)
			const data = res.data
			// 请求数据成功之后 进行数据的展示
			const markers = data.map((value, index)=>{
				return {
					iconPath: "/static/img/map/"+ value.type + ".png",
					id: value._id,
					latitude: value.latitude,
					longitude: value.longitude,
					width: 50,
					height: 50,
					message:value.message,
					contact:value.contact,
					type:value.type,
				}
		})
		this.markers = markers
		console.log("获取到全部数据", this.markers)
		},
		  
		getLocation(){
			uni.getLocation({
				type:'gcj02',  
				success: this.handleGetLocaltionSucc.bind(this) // 改变作用域
			})
		},
		
		handleGetLocaltionSucc(res){
			console.log("获得定位数据",res)
			this.longitude = res.longitude,
			this.latitude = res.latitude,
			this.location = [res.longitude, res.latitude]
			
		},
		
		changeTab(index){
			this.currentTab = index,
			console.log(index)
			if (this.currentTab==1){
				uni.navigateTo({
					url:"/pages/taskList/taskList"
				})
			}
		},
		
		// 关闭弹出时触发的事件 
		// 如果该用户的微信id使用过这个软件 则永久不弹出对话框
		// 当用户打开app 是检查信息 是否是历史用户
		hideModal(e) {
			console.log("点击确认之后",e)
			if (e.currentTarget.id == "conformFormList"){ /* 点击最后的确认按钮*/
				/* 对所填数据进行检查确认 */
				if (this.nickName ==""){
					this.showwarning("请填写昵称")
					return;
					}
				if (this.age == ""){
					this.showwarning("请填写年龄")
					return;
					}
				if (this.sex == ""){
					this.showwarning("请选择性别")
					return;
					}
				if (this.career == ""){
					this.showwarning("请填写职业")
					return;
					}
				if ((this.career == "学生或高校从业者" ) && (this.schoolData=="")){
					this.showwarning("请选择学校")
					return;
				}
				this.isDo = true
				
				this.modalName = "close" 
				
				const data = Object.assign({}, {
					age: this.age,nickName:this.nickName,sex:this.sex,career:this.career,schoolData:this.schoolData,
					provinceSchool:this.provinceSchool, isDo:this.isDo,location:this.location
				  })
				db.add({
				  data:data
				  ,success(res){
					  console.log("新用户注册 提交数据成功",res)
					  app.globalData.isNewUser = false
				  }
				})
				console.log(this.age, this.nickName,this.sex,this.schoolData,this.career)
			}
		},
		showwarning(title){
		wx.showToast({
		  title: title,
		  icon:"loading",
		  duration: 2000
		})
		},
		
		sexSwitchChange(e) {
			this.sexSwitch = e.detail.value
			console.log("是男是女",e)
			if (this.sexSwitch){
				this.sex = "男"
			}
			else{
				this.sex="女"
			} 
		},
		MultiChange(e) {
			this.multiIndex = e.detail.value
		},
		// 选择职业
		PickerChange(e) {
			this.index = e.detail.value
			this.career = this.picker[this.index]
		},
			// 多列选择获得具体信息
		MultiColumnChange(e) {
			let data = {
				multiArray: this.multiArray,
				multiIndex: this.multiIndex
			};
			data.multiIndex[e.detail.column] = e.detail.value;
			switch (e.detail.column) {
				case 0:
					switch (data.multiIndex[0]) {
						case 0:
							data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
							data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
							break;
						case 1:
							data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
							data.multiArray[2] = ['鲫鱼', '带鱼'];
							break;
					}
					data.multiIndex[1] = 0;
					data.multiIndex[2] = 0;
					break;
				case 1:
					switch (data.multiIndex[0]) {
						case 0:
							switch (data.multiIndex[1]) {
								case 0:
									data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
									break;
								case 1:
									data.multiArray[2] = ['蛔虫'];
									break;
								case 2:
									data.multiArray[2] = ['蚂蚁', '蚂蟥'];
									break;
								case 3:
									data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
									break;
								case 4:
									data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
									break;
							}
							break;
						case 1:
							switch (data.multiIndex[1]) {
								case 0:
									data.multiArray[2] = ['鲫鱼', '带鱼'];
									break;
								case 1:
									data.multiArray[2] = ['青蛙', '娃娃鱼'];
									break;
								case 2:
									data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
									break;
							}
							break;
					}
					data.multiIndex[2] = 0;
					break;
			}
			this.multiArray = data.multiArray;
			this.multiIndex = data.multiIndex;
		},
		
		// 这里是学生的城市 学校选择区
		showSchoolPicker: function() {
			this.$refs.schoolPicker.show()
		},
		onConfirm(e) {
			console.log("选择的结果label",e.label)
			const school = e.label.split("-")[2];
			console.log(`源数据:${JSON.stringify(e)}`);
			if (school === '暂未收录') {
				return;
			} else {
				this.provinceSchool = e.label
				this.schoolData = school;
				console.log(`学校:${school}`);
			}
		},
		nikeNameInput(e){
			console.log("输入",e,e.detail,e.detail.value)
			this.nickName = e.detail.value
		},
		ageInput(e){
			console.log("输入年龄",e,e.detail,e.detail.value)
			this.age = e.detail.value
		}
	}
};
</script>

<style lang="scss">	
.container_wlq {
	  width: 100%;
	  height: 100%;
	  position: absolute;

	.nav {
		display: flex;
		color: #808080;
		width: 80%;
		height: 37px;
		margin: 0px auto;
		flex-direction: column;
		align-items: center;
		font-size: 24upx;
		margin-left: 10%;
		position:fixed;
		z-index: 996;
		
		.searchInput999 {
			position: absolute;
			display: flex;
			height: 80%;
			width: 40%;
			margin: 5px auto;
			align-items: center;		
			border-radius: 30upx;
			font-size: 32upx;
					
			.searchBox999 {
				width: 56upx;
				height:80%;
				display: flex;
				justify-content: center;
				align-items: center;
				
				.search999 {
					width: 32upx;
					height: 32upx;
					}
				}
			
			.input999 {
				color: #999999;
				width: 80%;
				}
			}
		}
	
	.map-container{
		position: absolute;
		width: 100%;
		top: 0px;
		bottom: 0px;
		left: 0;
		z-index: 2;
		// background: rgb(172, 201, 128) 
	}
	
	.map{
	  width: 100%;
	  height: 100%
	}

	.content {
		width: 100%;
	}
	
	.card {
		width: 90%;
		height: 368upx;
		background-color: white;
		margin: 0 auto 42upx auto;
		background: #FFFFFF;
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.10);
		border-radius: 5px;
		position: relative;
	}
	
	.noCard {
		width: 90%;
		height: 200upx;
		margin: auto;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
		box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.10);
		border-radius: 10upx;
	}
	
}
</style>
