<template>
	<!-- 这个页面为学生视角  寻求帮助方 -->
	<view>
		<!-- 表单 用于发布消息时 进行的实名认证 可根据情况来选择 相应的表项 来呈现给用户获取 符合特定情境的注册信息 -->
		<form style="margin: 10px; background-color:rgb(237,237,237);">
			<view class="cu-form-group">
				<view class="title">任务类型</view>
				<picker :value="index_taskType" @change="selectTaskType" :range="taskTypePicker">
					<view class="picker" style="font-size: 15px;">
						{{index_taskType>-1?taskTypePicker[index_taskType]:"请选择任务类型..."}}
					</view>
				</picker>
			</view>
			<!-- 基本信息 -->
			<view class="cu-form-group">
				<view class="title">标题</view>
				<input placeholder="请输入任务标题" id="taskHead" @input="commonInput" style="font-size: 15px;"/>
			</view>
			
			<view class="cu-form-group align-start">
				<view class="title">任务详情</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="taskDetail" @input="textareaBInput" placeholder="请详细描述您的任务"></textarea>
			</view>
			
<!-- 家教培训类目下  显示的内容  补习课程 -->
			<view class="uni-panel" style="background-color: #FFFFFF;" v-for="(item, index) in all_panel_list" :key="item.id" v-if="jiajiaoShow">
				<view class="uni-panel-h" style="display: flex; justify-content: space-between;" :class="item.open ? 'uni-panel-h-on' : ''" :id="index" @click="triggerCollapse">
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
			
			<!-- 学生所在年级  单选 -->
			<view class="cu-form-group" v-if="jiajiaoShow">
				<view class="title">所在年级</view>
				<picker :value="index_grade" @change="selectGrade" :range="gradePicker">
					<view class="picker" style="font-size: 15px;">
						{{index_grade>-1?gradePicker[index_grade]:"请选择您孩子的年级"}}
					</view>
				</picker>
			</view>
			
			<view class="cu-form-group" v-if="jiajiaoShow">
				<view class="title">授课方式</view>
				<picker :value="index_serviceWay" @change="selectServiceWay" :range="serviceWayPicker">
					<view class="picker" style="font-size: 15px;">
						{{index_serviceWay>-1?serviceWayPicker[index_serviceWay]:"请选择授课方式..."}}
					</view>
				</picker>
			</view>
			<!-- 性别要求 -->
			<view class="cu-form-group flex" v-if="sexShow">
				<view class="title">性别要求</view>
				<view v-if="sexSwitch" style="color: #0081FF;margin-left: 150px;">男</view>
				<view style="color:#ED1C24; right: 30px;margin-left: 150px;" v-else>女</view>
				<switch class='switch-sex' @change="sexSwitchChange" :class="sexSwitch?'checked':'notChecked'" :checked="sexSwitch?true:false"></switch>
			</view>
			
			<view class="cu-form-group" v-if="chargePerHourShow">
				<view class="title">时薪</view>
				<input type="number" placeholder="每小时酬金(元)" @change="inputChargePerHour" />
				<view class="cu-capsule radius">
					<view class="cu-tag line-blue">
						/小时
					</view>
				</view>
			</view>
			
			<view class="cu-form-group" v-if="jiajiaoShow">
				<view class="title">授课次数</view>
				<input type="number" placeholder="每周授课次数" @change="inputTimesPerWeek"/>
			</view>
			
			<view class="cu-form-group" v-if="chargeShow">
				<view class="title">总酬金</view>
				<input type="number" placeholder="完成该任务的酬金" @change="inputChargeTotal" />
			</view>
			
			<view class="cu-form-group align-start" style="clear: both;" v-if="jiajiaoShow">
				<view class="title">情况备注</view>
				<textarea style="font-size: 15px;" maxlength="-1" :disabled="false" id="remarkDetail" @input="textareaBInput" placeholder="简要介绍孩子学习情况和其他备注信息有助于为您提供最有针对性的老师"></textarea>
			</view>
			
			<view class="cu-form-group" v-if="addressShow">
				<view class="title">地址</view>
				<view @click="chooseAddress" style="font-size: 15px; font-weight: 500; text-align: left;" >{{commonInfo.address}}</view>
			</view>
			<view class="cu-form-group" v-if="addressShow">
				<view class="title">具体地点</view>
				<input placeholder="地址将被严格保密,只有交易达成双方才可视." @change="inputPositionDetail"/>
			</view>
		
			<view class="cu-form-group margin-top-sm" >
				<button @click="submitAllInformation" form-type="submit" class="cu-btn bg-green" style="margin: 0 auto;" >发起任务请求</button>
			</view>
			
			<!-- 提交错误验证码 或关键信息没有填则进行提示 -->
			<!-- 进行注册提示 -->
			<view class="cu-modal" :class="submitErrModal?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{modalErrTitle}}</view>
						<view class="action" id="cancelModal" @tap="hideSubmitErrModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">{{modalErrContent}}</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" id="cancelModal" @tap="hideSubmitErrModal">取消</button>
							<button class="cu-btn bg-green margin-left" id="confirmModal" @tap="hideSubmitErrModal">确定</button>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-modal" :class="pubSuccess?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">发布成功</view>
						<view class="action" id="cancelModal" @tap="hidePubSuccessModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">恭喜您，任务发布成功，是否继续进行任务发布？取消则返回首页</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" id="cancelModal" @tap="hidePubSuccessModal">取消</button>
							<button class="cu-btn bg-green margin-left" id="confirmModal" @tap="hidePubSuccessModal">确定</button>
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
				modalErrTitle:"",
				modalErrContent:[],
	/* 所有任务共有的信息 */
				commonInfo:{
					taskType:"校园帮",       /* 任务类型*/
					taskHead:"",            /* 任务标题*/
					taskDetail:"",          /* 任务详情*/
					
					/* 共有的地址信息 */
					staticData:{},			/* 经纬度坐标 */
					address:"地址用于为您匹配最近的服务", /* 居住地点*/
					addressDetail:"具体的授课地点", /* 详细地址*/
				},
				
	/* 学生找家教的信息 */
				studentFindTeacherInfo:{	
					grade:"",				/* 所在年级 */
					serviceWay:'',			/* 服务方式 */
					sex:"男",  				/* 要求老师的性别 */
					chargePerHour:"",       /* 可支付的薪水 每小时*/
					TimesPerWeek:"",  		/* 一周上课次数*/
					remarkDetail:"",		/* 备注信息 */	
				},
	/* 同时包含的信息 */
				chargeTotle:"",         /* 总薪酬 与上面的互斥*/
				
				all_panel_list:[{
					id: 'subject',
					name: '补习课程',     /* 老师 学生 多选*/
					open: false,
					content:"",
					}],	
	/* 系统查看 点赞， 评论信息等，初始时都是默认值，后面系统用户发生的行为记录于此 */
				systemProductData :{
					Upvotes:0,
					Comments:0,
					Views:0  
				},
					
				allowRecommend:false,	/* 单身情况下是否允许推荐对象*/
				
				submitSuccess: false,   /* 是否提交数据，用于显示数据是否提交成功*/
				
				showModal:false, 		/* 是否展示弹框*/
				index_education:-1,
				index_serviceWay:-1,
				index_taskType:0,
				index_grade:-1,
				
				/* 控制显示的内容 */
				jiajiaoShow: false, /* 显示教育培训相关的内容 */
				addressShow : false,
				limitTimeShow: false,
				studentShow : false,
				sexShow:false,
				sexSwitch: true,  		/* 默认是男的*/
				chargePerHourShow:false,
				chargeShow:true,
				
				submitErrModal:false,  /* 信息提交错误时显示*/
				pubSuccess: false,
				
				/* 选择组件不提交这些信息 */
				taskTypePicker:["校园帮", "家教培训", "考研学长帮", "就业考试咨询"],
				educationPicker:["教授","副教授","博士后","博士","硕士","本科","大专","高中","初中","小学","其他"],
				serviceWayPicker:["上门指导", "在线授课", "学生上门","自定义"],
				gradePicker:["幼儿园", "小学", "初一", "初二", "初三", "高一", "高二", "高三", "大学", "其他"],
				
				/* 补习课程 */
				subject: [{				
					value: '语文',checked: false }, {
					value: '数学',checked: true  }, {
					value: '英语',checked: false }, {
					value: '化学',checked: false }, {
					value: '物理',checked: false }, {
					value: '生物',checked: false }, {
					value: '历史',checked: false }, {
					value: '地理',checked: false }, {
					value: '政治',checked: false }],	
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.all_panel_list[0].content = this.subject;
			
			/* 默认校园帮 显示的信息 */
			this.limitTimeShow = true
			this.addressShow = true
		},
		
		methods:{			
			hideSubmitErrModal(res){
				if (res.currentTarget.id == "confirmModal" & this.modalErrTitle == "您还没有注册"){
					uni.navigateTo({
						url:"../../tableList/studentRegister/studentRegister?registerType=" +  this.commonInfo.taskType
					})
				}
				console.log(res)
				this.submitErrModal = false
			},
			hidePubSuccessModal(res){
				console.log(res)
				if (res.currentTarget.id == "cancelModal"){
					console.log("点击取消")
					uni.navigateBack({
						delta:10
					})
				} else if (res.currentTarget.id == "confirmModal"){
					this.pubSuccess = false
				}
			},
			
			submitAllInformation(res){
				// TODO 提交所有信息 发送到数据库
				/* 判断是否进行学生认证 */
				if (!global.globalData.stuRegister){  /* 这里的变量使用全局变量 注册之后对变量进行赋值 */
					this.modalErrTitle = "您还没有注册"
					this.modalErrContent = "为确保安全，请您点击确认进行注册"
					this.submitErrModal = true
				}else{
					this.checkCommonInfo()
					/* 在这里对不同业务提交的信息进行检查 */
					// TODO 增加业务并进行检查是否填写完整 信息
					if (this.commonInfo.taskType == "家教培训"){
						this.checkStudentFindTeacherInfo()
					}
					  
					if (!this.submitErrModal){
						/* 提交表单数据到服务器 */
						// TODO 与服务器交互
						if(this.commonInfo.taskType == "校园帮"){ /* 基本的信息 和资金便可*/
							// console.log("点击最后的提交 校园帮 公共数据", this.commonInfo, this.chargeTotle)
							const data = Object.assign({}, this.commonInfo, {"chargeTotle":this.chargeTotle}, this.systemProductData)
							this.postDataToServe("xiaoyuanbang", data)
						} else if(this.commonInfo.taskType == "家教培训"){ /* 学生的具体信息*/
							// console.log("提交 家教培训 具体信息", this.commonInfo, this.studentFindTeacherInfo, this.all_panel_list[0]["content"])
							const data = Object.assign({}, this.commonInfo, this.studentFindTeacherInfo, {"subjectContenmt":this.all_panel_list[0]["content"]}, this.systemProductData)
							this.postDataToServe("jiajiaopeixun", data)
						} else if(this.commonInfo.taskType == "考研学长帮"){
							const data = Object.assign({}, this.commonInfo, {"chargeTotle":this.chargeTotle}, this.systemProductData)
							this.postDataToServe("kaoyanxuezhangbang", data)
						} else if(this.commonInfo.taskType == "就业考试咨询"){
							const data = Object.assign({}, this.commonInfo, {"chargeTotle":this.chargeTotle}, this.systemProductData)
							this.postDataToServe("jiuyekaoshizixun", data)
						}
						this.pubSuccess = true
					}
				}
			},
			
			postDataToServe(databaseNmae, data){
				const DB = wx.cloud.database().collection(databaseNmae)
				DB.add({
				  data:data
				  ,success:this.handleSubmmitSucc.bind(this),
				})
			},
			handleSubmmitSucc(res) {
			  console.log("发送数据成功", res)
			  this.setData({
			    submitSuccess: true
			  })
			  
			},
			
			checkCommonInfo(){
				if (this.commonInfo.taskHead == "" ||
				this.commonInfo.taskDetail == "" || (this.commonInfo.taskType == "校园帮" && this.chargeTotle == "" )){
					this.modalErrTitle = "信息填写不完整"
					this.modalErrContent = "请按要求填写完整信息。"
					this.submitErrModal = true
					return 
				} else {
					this.submitErrModal = false	
				}
			},
			
			checkStudentFindTeacherInfo(){
				var tempInfo = this.studentFindTeacherInfo
				console.log(tempInfo)
				for (var item in tempInfo) {
					console.log(tempInfo[item])
					if (tempInfo[item] == ""){
						this.modalErrTitle = "信息填写不完整"
						this.modalErrContent = "请按要求填写完整信息。"
						this.submitErrModal = true
					}else{
						this.submitErrModal = false
					}
				}
			},
			
			inputTimesPerWeek(res){
				this.studentFindTeacherInfo.TimesPerWeek = res.detail.value
				console.log("授课次数 ",this.studentFindTeacherInfo.TimesPerWeek)
			},
			
			inputChargeTotal(res){
				this.chargeTotle = res.detail.value
				console.log("总酬金 ",this.chargeTotle)
			},
			
			inputChargePerHour(res){
				this.studentFindTeacherInfo.chargePerHour = res.detail.value
				console.log("酬金每小时 ",this.studentFindTeacherInfo.chargePerHour)
			},

/* 性别选择 */
			sexSwitchChange(e) {
				this.sexSwitch = e.detail.value
				console.log("是男是女 ",e)
				if (this.sexSwitch){
					this.studentFindTeacherInfo.sex = "男"
				}
				else{
					this.studentFindTeacherInfo.sex="女"
				} 
			},
			
			selectGrade(res){
				this.index_grade = res.detail.value
				this.studentFindTeacherInfo.grade = this.gradePicker[this.index_grade]
			},
			
			selectTaskType(res){
				this.index_taskType = res.detail.value
				this.commonInfo.taskType = this.taskTypePicker[this.index_taskType];
				if (this.commonInfo.taskType == "家教培训"){
					this.jiajiaoShow = true
					this.addressShow = true
					this.chargePerHourShow = true
					this.sexShow = true
					this.limitTimeShow = false
					this.chargeShow = false
				}
				else if (this.commonInfo.taskType == "校园帮") {
					this.jiajiaoShow = false
					this.addressShow = true
					this.chargePerHourShow = false
					this.sexShow = false
					this.limitTimeShow = true
					this.chargeShow = true
					
				}
				else {
					this.jiajiaoShow = false
					this.addressShow = false
					this.chargePerHourShow = false
					this.sexShow = false
					this.limitTimeShow = false
					this.chargeShow = true
				}
			},

			selectServiceWay(res){
				console.log("授课方式",res)
				this.index_serviceWay = res.detail.value
				this.studentFindTeacherInfo.serviceWay = this.serviceWayPicker[this.index_serviceWay]
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
				this.commonInfo.address = res.address
				Object.assign(this.commonInfo.staticData, { 
				  latitude: res.latitude,
				  longitude: res.longitude
				})
			},
			inputPositionDetail(res){
				this.commonInfo.addressDetail = res.detail.value
				console.log("具体地点",this.commonInfo.addressDetail)
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
				if (res.currentTarget.id == "remarkDetail"){
					this.studentFindTeacherInfo.remarkDetail = res.detail.value
					console.log("remarkDetail",this.remarkDetail)
				} else if (res.currentTarget.id == "taskDetail"){
					this.commonInfo.taskDetail = res.detail.value
				}
			},
			commonInput(res){
				if (res.currentTarget.id == "taskHead"){
					this.commonInfo.taskHead = res.detail.value
					console.log("标题",this.commonInfo.taskHead)
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

