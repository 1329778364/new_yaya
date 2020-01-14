<template>
	<!-- 这个页面为老师视角  提供服务方  -->
	<view style="background-color:rgb(237,237,237)">
		<!-- 表单 用于发布消息时 进行的实名认证 可根据情况来选择 相应的表项 来呈现给用户获取 符合特定情境的注册信息 -->
		<form style="margin: 10px">
			<view class="cu-form-group">
				<view class="title">服务类型</view>
				<picker :value="index_taskType" @change="selectTaskType" :range="taskTypePicker">
					<view class="picker">
						{{index_taskType>-1?taskTypePicker[index_taskType]:"请选择服务类型..."}}
					</view>
				</picker>
			</view>
			<!-- 基本信息 -->
			<view class="cu-form-group" v-if="!educationShow">
				<view class="title">标题</view>
				<input placeholder="请输入任务标题" id="taskHead" @input="commonInput"/>
			</view>
			
			<view class="cu-form-group align-start" v-if="!educationShow">
				<view class="title">服务详情</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="taskDetail" @input="textareaBInput" placeholder="请详细描述您的任务"></textarea>
			</view>
			
			<!-- 老师的信息  比较不一般的注册信息 -->
			<view class="cu-form-group" v-if="educationShow">
				<view class="title">目前学历</view>
				<picker :value="index_education" @change="selectEducation" :range="educationPicker">
					<view class="picker">
						{{index_education>-1?educationPicker[index_education]:"请选择..."}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" @click="showSchoolPicker"  v-if="educationShow">
				<view class="title">院校信息</view> <!-- 这里将会包括 学校 学院信息 专业-->
					<view class="picker">
						{{provinceSchool}}
					</view>
			</view>
			<schoolPicker themeColor="#000" ref="schoolPicker" @onConfirm="onConfirm"></schoolPicker>
			
			<view class="cu-form-group" v-if="educationShow">
				<view class="title">学院</view>
				<input id="college" placeholder="建议填写学校官方的学院全称" @input="commonInput" />
			</view>
			<view class="cu-form-group" v-if="educationShow">
				<view class="title">专业方向</view>
				<input id="major" placeholder="将会优先为您匹配合适的人选或任务" @input="commonInput" />
			</view>
			
			<!-- 图片 -->
			<view class="cu-bar bg-white margin-top-xs" v-if="educationShow">
				<view class="action">
					身份认证(身份证与学生证/教师证正反面)
				</view>
				<view class="action">
					{{imgList.length}}/4
				</view>
			</view>
			<view class="cu-form-group" v-if="educationShow">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			
			<!-- 其他实时任务的时间限制 -->
			<view class="cu-form-group" v-if="limitTimeShow">
				<view class="title">时间限制</view>
				<picker mode="time" :value="time" start="00:00" end="23:59" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			
			<!-- 老师学生共有 -->
			<view class="cu-form-group" v-if="educationShow">
				<view class="title">授课方式</view>
				<picker :value="index_serviceWay" @change="selectServiceWay" :range="serviceWayPicker">
					<view class="picker">
						{{index_serviceWay>-1?serviceWayPicker[index_serviceWay]:"请选择授课方式..."}}
					</view>
				</picker>
			</view>
			
			<!-- 老师能够教授的科目多选 -->
			<view class="cu-form-group " v-if="addressShow">
				<view class="title" >地址</view>
				<view @click="chooseAddress" style="font-size: 14px;">{{address}}</view>
			</view>
			<view class="cu-form-group" v-if="addressShow">
				<view class="title">详细地址</view>
				<input placeholder="详细任务地址只有双方达成交易才可视." @change="inputPositionDetail"/>
			</view>
			
			<!--老师 文本输入区域 -->
			<view class="cu-form-group align-start " style="clear: both;" v-if="educationShow">
				<view class="title">雇主评价</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="employerEvaluate" @input="textareaBInput" placeholder="以往雇主的评价能让别人更了解你的服务"></textarea>
			</view>
			
			<view class="cu-form-group align-start" v-if="educationShow">
				<view class="title">获奖证书</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="honor" @input="textareaBInput" placeholder="良好的履历更容易获得家长的青睐."></textarea>
			</view>
			
			<view class="cu-form-group align-start" v-if="educationShow">
				<view class="title">特长描述</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="strongPoint" @input="textareaBInput" placeholder="展现自己的亮点!"></textarea>
			</view>
			
			<view class="cu-form-group align-start" v-if="educationShow">
				<view class="title">学员变化</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="studentEvaluate" @input="textareaBInput" placeholder="描述学院在你的指导下发生了哪些变.比如,成绩,排名,性格,心态,价值观等方面"></textarea>
			</view>
			
			<view class="uni-panel" style="background-color: #FFFFFF;" v-for="(item, index) in all_panel_list" :key="item.id" v-if="educationShow">
			    <view class="uni-panel-h" style="display: flex; justify-content: space-between; margin-top-sm ;" :class="item.open ? 'uni-panel-h-on' : ''" :id="index" @click="triggerCollapse">
			        <text class="title" style="font-size: 30rpx;">{{item.name}}</text>
			        <text class="uni-panel-icon uni-icon" :class="item.open ? 'uni-panel-icon-on' : ''">&#xe581;</text>
			    </view>
			    <view class="uni-panel-c" v-if="item.open">
			        <view class="cu-form-group">
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
			<!-- 进行手机号绑定 -->
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input type="number" id="phoneNumber" placeholder="用于及时跟您进行联系" @input="commonInput" />
				<button class="cu-btn bg-green shadow" @click="sendValCode">验证码</button>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view> 
				<input type="number" id="validateCode" placeholder="输入之后才能提交信息!"@input="commonInput"  />
			</view>
			<view class="cu-form-group margin-top-sm">
				<button class="cu-btn bg-green" style="margin: 0 auto;" @click="submitAllInformation">提交信息</button>
			</view>
			
			<!-- 提交错误验证码 或关键信息没有填则进行提示 -->
			<view class="cu-modal" :class="submitErrModal?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">信息错误</view>
						<view class="action" @tap="hideSubmitErrModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{errMessage}}  <!-- 自定义错误信息-->
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
				taskDetail:"",
				
				date: '12', 				/* 日期 */
				time: '00:00',				/* 时间限制 */
				staticData:{},			/* 经纬度坐标 */
				address:"地址用于为您匹配最近的任务", /* 居住地点*/
				addressDetail:"具体的授课地点", /* 详细地址*/
				singleState:"", 		/* 情感状态*/
				single:false,   		/* 单身判断*/
				provinceSchool:"", 		/* 学校信息 */
				
				userName:",",           
				phoneNumber:"",         /* 电话号码*/
				// todo 验证码的校验
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
				taskType:"",            /* 任务类型*/
				grade:"",				/* 学生年级 */
				imgList: [],
				
				showModal:false, 		/* 是否展示弹框*/
				index_education:-1,
				index_serviceWay:-1,
				index_taskType:0,
				index_grade:-1,
				
				/* 控制显示的内容 */
				educationShow: false, /* 显示教育培训相关的内容 */
				addressShow : true,
				limitTimeShow: false,
				submitErrModal:false,  /* 信息提交错误时显示*/
				errMessage:"根据判断进行报错提示",   
				
				educationPicker:["教授","副教授","博士后","博士","硕士","本科","大专","高中","初中","小学","其他"],
				serviceWayPicker:["上门指导", "在线授课", "学生上门","自定义"],
				taskTypePicker:["校园帮", "家教培训", "考研学长帮", "就业考试咨询"],
				gradePicker:["幼儿园", "小学", "初一", "初二", "初三", "高一", "高二", "高三", "大学", "其他"],
				// subject:["语文","数学","英语","化学","物理","生物","历史","地理","政治","体育训练"],
				subject: [{
					value: '语文',checked: false }, {
					value: '数学',checked: false}, {
					value: '英语',checked: false}, {
					value: '化学',checked: false}, {
					value: '物理',checked: false}, {
					value: '生物',checked: false}, {
					value: '历史',checked: true }, {
					value: '地理',checked: false}, {
					value: '政治',checked: true }],
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
				gradeForTeacher:[{
					value:"幼儿园",checked:false}, {
					value:"小学",checked:false}, {
					value:"初一",checked:false}, {
					value:"初二",checked:false}, {
					value:"初三",checked:false}, {
					value:"高一",checked:false}, {
					value:"高二",checked:false}, {
					value:"高三",checked:false}, {
					value:"大学",checked:false},{
					value:"其他",checked:false}], 
				// 所有的需要展开的条目汇总在这里 便于管理
				all_panel_list:[
					{
						id: 'subject',
                        name: '可授课程',     /* 老师 学生 多选*/
                        open: false,
                        content:"",
						},
					{
						id:"region",
						name : "授课区域", /* 老师多选*/
						open:false,
						content:""
					},
					{
						id:"gradeForTeacher",
						name : "可授年级",/* 老师多选 */
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
			this.all_panel_list[2].content= this.gradeForTeacher;
			
		},
		methods:{
			submitAllInformation(res){
				// todo 提交所有信息
				console.log("点击最后的提交")
				/* 首先对验证码进行验证，利用模态框 提示用户如果数据错误的话， 正确就直接提交数据 并展示数据提交成功的页面 */
				/* 模态框验证数据 错误 则给其为true 并给errmessage赋值提示 */
				this.submitErrModal = true
			},
			sendValCode(res){
				/* 实现手机号的验证发送手机验证码 */
				// todo  实现手机号的验证发送手机验证码 
				console.log("发送手机验证码的请求")
			},
			hideSubmitErrModal(res){
				this.submitErrModal = false
			},
			ViewImage(res) {
				uni.previewImage({
					urls: this.imgList,
					current: res.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '删除', 
					// content: '确认删除',
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			
			selectGrade(res){
				/* 学生选择自己所在的年级 */
				this.index_grade = res.detail.value
				this.grade = this.gradePicker[this.index_grade]
			},
			
			selectTaskType(res){
				this.index_taskType = res.detail.value
				this.taskType = this.taskTypePicker[this.index_taskType];
				if (this.taskType == "家教培训"){
					this.educationShow = true
				}
				else if (this.taskType == "附近人帮忙") {
					/* 对于比较及时的任务 */
					this.limitTimeShow = true
				}
				else {
					this.educationShow = false
					this.limitTimeShow = false
					
					
				} 
			},
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
				}else if (res.currentTarget.id == "taskDetail"){
					this.taskDetail = res.detail.value
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
	@import "../../../uni-app/common/uni-nvue.css";
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
	.subjectCheckbox{
		min-width: 60px;
		justify-content: space-between;	
	}
	
</style>

