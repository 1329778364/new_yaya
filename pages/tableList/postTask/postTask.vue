<template>
	<view>
		<!-- 表单 用于发布消息时 进行的实名认证 可根据情况来选择 相应的表项 来呈现给用户获取 符合特定情境的注册信息 -->
		<form style="margin: 10px">
			<!-- 基本信息 -->
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="请输入真实姓名(我们将完全保密)" id="userName" @input="commonInput"/>
			</view>
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input id="phoneNumber" placeholder="用于及时跟您进行联系" @input="commonInput" />
				<button class="cu-btn bg-green shadow">验证码</button>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view> 
				<input id="validateCode" placeholder="输入之后才能提交信息!"@input="commonInput"  />
			</view>
			<view class="cu-form-group">
				<view class="title">出生日期</view>
				<picker mode="date" :value="date" start="1960" end="2015" @change="changeDate">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			
			<view class="cu-form-group flex">
				<view class="title">情感状态</view>
				<view v-if="single" style="color: #0081FF;margin-left: 150px;">单身</view>
				<view style="color:#ED1C24; right: 30px;margin-left: 150px;" v-else>恭喜</view>
				<switch class='swiper-item' @change="singleSwitch" :class="single?'checked':'notChecked'" :checked="single?true:false"></switch>
				<!-- z组合下面的模态弹框 使用 征求 用户的同意 -->
			</view>
			<view class="cu-modal" :class="showModal?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">授权信息确认！</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>s
					</view>
					<view class="padding-xl">
						确认 人工智能将对您进行全方位进行了解，并为您匹配合适的另一半，你们可以通过平台进行初步了解，在得到双方鉴权确认之前，你们的信息对于双方保持隐藏状态。
						双方如果要进行约会，请进入个人中心发起现场约会申请，平台将会对双方信息进行考核，以保证您的利益不会受到侵害。
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
							<button class="cu-btn bg-green margin-left" :id="conformFormList" @tap="hideModal">确定</button>
						</view>
					</view>
				</view>
			</view>
	
			<!-- 比较不一般的注册信息 -->
			<view class="cu-form-group margin-top">
				<view class="title">目前学历</view>
				<picker :value="index_education" @change="selectEducation" :range="educationPicker">
					<view class="picker">
						{{index_education>-1?educationPicker[index_education]:"请选择..."}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" @click="showSchoolPicker">
				<view class="title">院校信息</view> <!-- 这里将会包括 学校 学院信息 专业-->
					<view class="picker">
						{{provinceSchool}}
					</view>
			</view>
			<schoolPicker themeColor="#000" ref="schoolPicker" @onConfirm="onConfirm"></schoolPicker>
			<view class="cu-form-group">
				<view class="title">学院</view>
				<input id="college" placeholder="建议填写学校官方的学院全称" @input="commonInput" />
			</view>
			<view class="cu-form-group">
				<view class="title">专业方向</view>
				<input id="major" placeholder="将会优先为您匹配合适的人选或任务" @input="commonInput" />
			</view>
			
			
			<view class="cu-form-group">
				<view class="title">时间限制</view>
				<picker mode="time" :value="time" start="00:00" end="23:59" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			
			<view class="cu-form-group">
				<view class="title">授课方式</view>
				<picker :value="index_serviceWay" @change="selectServiceWay" :range="serviceWayPicker">
					<view class="picker">
						{{index_serviceWay>-1?serviceWayPicker[index_serviceWay]:"请选择授课方式..."}}
					</view>
				</picker>
			</view>

			<view class="cu-form-group margin-top">
				<view class="title">科目选择</view>
				<view class="bg-white margin-sm">
					<view class="grid text-center col-4">
						<view @click="clickSubject" class="padding" :class="item.checked?'bg-green':''" v-for="(item,index) in subject" :key="index" :id="index">{{item.value}}</view>
					</view>
				</view>
			</view>
			
			<view class="cu-form-group margin-top">
				<view class="title">长住地址</view>
				<view @click="chooseAddress" >{{address}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">具体地点</view>
				<input placeholder="具体的授课地点" @change="inputPositionDetail"/>
			</view>
				
			<!-- 文本输入区域 -->
			<view class="cu-form-group align-start margin-top" style="clear: both;">
				<view class="title">雇主评价</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="employerEvaluate" @input="textareaBInput" placeholder="以往雇主的评价能让别人更了解你的服务"></textarea>
			</view>
			
			<view class="cu-form-group align-start">
				<view class="title">获奖证书</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="honor" @input="textareaBInput" placeholder="容易获得更多人的关注"></textarea>
			</view>
			
			<view class="cu-form-group align-start">
				<view class="title">特长描述</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="strongPoint" @input="textareaBInput" placeholder="介绍一下自己吧!"></textarea>
			</view>
			
			<view class="cu-form-group align-start">
				<view class="title">学员评价</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="studentEvaluate" @input="textareaBInput" placeholder="以往雇主的评价能让别人更了解你的服务"></textarea>
			</view>
			
			<view class="uni-panel" style="background-color: #FFFFFF;" v-for="(item, index) in all_panel_list" :key="item.id">
			    <view class="uni-panel-h" style="display: flex; justify-content: space-between;" :class="item.open ? 'uni-panel-h-on' : ''" :id="index" @click="triggerCollapse">
			        <text class="title" style="font-size: 30rpx;">{{item.name}}</text>
			        <text class="uni-panel-icon uni-icon" :class="item.open ? 'uni-panel-icon-on' : ''">&#xe581;</text>
			    </view>
			    <view class="uni-panel-c" v-if="item.open">
			        <view class="cu-form-group margin-top">
			        	<view class="title">{{item.name}}</view>
			        	<view class="bg-white margin-sm">
			        		<view class="grid text-center col-4">
			        			<view @click="clickSubject(index,indexs)" class="padding" :class="item2.checked?'bg-green':''" 
								v-for="(item2,indexs) in item.content" :key="indexs" 
								:id="[index,indexs]" >{{item2.value}}</view>
			        		</view>
			        	</view>
			        </view> 	
			    </view>
			</view>
		</form>
		
	</view>
</template>

<script>
	import schoolPicker from '../../../components/schoolPicker/schoolPicker.vue';
	
	export default {
		components:{schoolPicker},
		data() {
			return {
				date: '12', 				/* 日期 */
				time: '00:00',				/* 时间限制 */
				staticData:{},			/* 经纬度坐标 */
				address:"地址用于匹配您最近的任务", /* 居住地点*/
				addressDetail:"具体的授课地点", /* 详细地址*/
				singleState:"", 		/* 情感状态*/
				single:false,   		/* 单身判断*/
				provinceSchool:"", 		/* 学校信息*/
				
				userName:",",           
				phoneNumber:"",
				validateCode:"", 		/* 验证码*/
				college:"", 			/* 学院*/
				major:"", 				/* 专业*/
				
				employerEvaluate:'',	/* 雇主评价 */
				studentEvaluate:'',		/* 学员评价*/
				strongPoint:"",			/* 特长 */
				honor:"",				/* 所获证书 荣誉 */
				allowRecommend:false,		/* 单身情况下是否允许推荐对象*/
				education:"",  			/* 学历 */
				serviceWay:'',			/* 服务方式 */
				
				showModal:false, 		/* 是否展示弹框*/
				index_education:-1,
				index_serviceWay:-1,
				educationPicker:["教授","副教授","博士后","博士","硕士","本科","大专","高中","初中","小学","其他"],
				serviceWayPicker:["上门指导", "在线授课", "学生上门","自定义"],
				// subject:["语文","数学","英语","化学","物理","生物","历史","地理","政治","体育训练"],
				subject: [{
					value: '语文',checked: false }, {
					value: '数学',checked: false}, {
					value: '英语',checked: false}, {
					value: '化学',checked: false}, {
					value: '化学',checked: false}, {
					value: '物理',checked: false}, {
					value: '生物',checked: false}, {
					value: '历史',checked: true }, {
					value: '地理',checked: false}, {
					value: '政治',checked: true },	 ],
				regionOfService:[{
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}, {
					value:"洪山区",checked:false}  ],
				// 所有的需要展开的条目汇总在这里 便于管理
				all_panel_list:[
					{
						id: 'subject',
                        name: '课程',
                        open: false,
                        content:"",
						},
					{
						id:"region",
						name : "授课区域",
						open:false,
						content:""
					}
				]
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.all_panel_list[0].content = this.subject;
			this.all_panel_list[1].content= this.regionOfService;
		},
		methods:{
			selectEducation(res){
				console.log("学历",res)
				this.index_education = res.detail.value
				this.education = this.educationPicker[this.index_education]
			},
			selectServiceWay(res){
				console.log("授课方式",res)
				this.index_serviceWay = res.detail.value
				this.serviceWay = this.serviceWayPicker[this.index_serviceWay]
			},
			TimeChange(res){
				console.log("时间",res)
				this.time = res.detail.value
			},
			changeDate(res){
				console.log("日期",res)
				this.date = res.detail.value
			},
			clickSubject(index, indexs){		
				console.log("选择类型 和 序号",index, indexs)
				if (this.all_panel_list[index].content[indexs].checked == false){
					this.all_panel_list[index].content[indexs].checked = true
				}
				else{
					this.all_panel_list[index].content[indexs].checked = false
				}
				console.log("标签当前状态",this.all_panel_list[index].content[indexs].checked)
			},
			
			chooseAddress(res){
				console.log("选择地址。。。")
				wx.chooseLocation({
					success: this.handleChooseAddressSucc.bind(this)
				})
			},
			handleChooseAddressSucc(res){
				console.log("地址",res)
				this.address = res.address
				Object.assign(this.staticData, { 
				  latitude: res.latitude,
				  longitude: res.longitude
				})
			},
			inputPositionDetail(res){
				this.addressDetail = res.detail.value
				console.log("具体地点",this.addressDetail)
			},
			
			triggerCollapse(e) {
				console.log("点击抽屉", e)
				var id = e.currentTarget.id
				for (var i = 0; i < this.all_panel_list.length; ++i) {
					if (i == id) {
						this.all_panel_list[i].open = !this.all_panel_list[id].open;
					} else {
						this.all_panel_list[i].open = false;
					}
			    }
			},
			singleSwitch(e){
				this.single = e.detail.value
				console.log("单身否？",e)
				if (this.single){
					this.singleState = "单身"
					this.showModal = true
				}
				else{
					this.singleState="不是单身"
					this.showModal = false
				} 
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
			hideModal(e) {
				this.allowRecommend = true /* 同意推荐 */
				console.log("同意推荐",this.allowRecommend)
				this.showModal = false
			},
			textareaBInput(res){
				console.log(res)
				if (res.currentTarget.id == "employerEvaluate"){
					this.employerEvaluate = res.detail.value
					console.log("雇主评价",this.employerEvaluate)
				}else if(res.currentTarget.id == "honor"){
					this.honor = res.detail.value
					console.log("荣誉",this.honor)
				}else if (res.currentTarget.id == "strongPoint"){
					this.strongPoint = res.detail.value
					console.log("特长",this.strongPoint)
				}else if (res.currentTarget.id == "studentEvaluate"){
					this.studentEvaluate = res.detail.value
					console.log("学员评价",this.studentEvaluate)
				}
			},
			commonInput(res){
				if (res.currentTarget.id == "userName"){
					this.userName = res.detail.value
					console.log("姓名",this.userName)
				}else if(res.currentTarget.id == "phoneNumber"){
					this.phoneNumber = res.detail.value
					console.log("电话",this.phoneNumber)
				}else if (res.currentTarget.id == "validateCode"){ /* 注意这里最后提交的时候要进行验证*/
					this.validateCode = res.detail.value
					console.log("验证码",this.validateCode)
				}else if (res.currentTarget.id == "college"){
					this.college = res.detail.value
					console.log("学院",this.college)
				}else if (res.currentTarget.id == "major"){
					this.major = res.detail.value
					console.log("专业",this.major)
				}
			}
		}
		
	} 
</script>

<style lang="scss">
	@import "../../../common/uni-nvue.css";
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	.subjectCheckbox{
		min-width: 60px;
		justify-content: space-between;	
	}
	
</style>

