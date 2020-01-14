<template>
	<!-- 学生注册页面 -->
	<!-- 根据跳转过来携带的信息 定制注注册页面
		校园帮
		家教培训
		考研学长帮
		就业考试咨询
	 -->
	<view style="background-color:rgb(237,237,237);">
		<form style="margin: 10px;">
			
			<!-- 用于昵称 -->
			<view class="cu-form-group">
				<view class="title">姓名</view>
				<input placeholder="请输入您的名字" id="userName" @input="commonInput"/>
			</view>
			<view class="cu-form-group">
				<view class="title">身份证号</view>
				<input type="idcard" placeholder="请输入您的身份证号" id="idCard" @input="commonInput"></input>
			</view>
			<!-- 图片 -->
			<view class="cu-bar bg-white">
				<view class="action">
					{{registerType == "校园帮" ? "请上传学生证/身份证正反面" : "请上传身份证正反面"}}
				</view>
				<view class="action">
					{{commonRegisterInfo.imgList.length}}/ {{registerType == "校园帮" ? 4 : 2}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in commonRegisterInfo.imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="commonRegisterInfo.imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="commonRegisterInfo.imgList.length< imgNum">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view> 
			
			<!-- 校园帮中的学生注册 信息 -->
			<view class="cu-form-group" v-if="schoolShow">
				<view class="title">目前学历</view>
				<picker :value="index_education" @change="selectEducation" :range="educationPicker">
					<view class="picker">
						{{index_education>-1?educationPicker[index_education]:"请选择..."}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" @click="showSchoolPicker" v-if="schoolShow">
				<view class="title">院校信息</view> <!-- 这里将会包括 学校 学院信息 专业-->
					<view class="picker">
						{{studentRegisterInfo.provinceSchool}}
					</view>
			</view>
			<schoolPicker themeColor="#000" ref="schoolPicker" @onConfirm="onConfirm"></schoolPicker>
			<view class="cu-form-group" v-if="schoolShow">
				<view class="title">学院</view>
				<input id="college" placeholder="建议填写学校官方的学院全称" @input="commonInput" />
			</view>
			<view class="cu-form-group" v-if="schoolShow">
				<view class="title">专业方向</view>
				<input id="major" placeholder="将会优先为您匹配合适的人选或任务" @input="commonInput" />
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
						<view class="content">{{modalTitle}}</view>
						<view class="action" @tap="hideSubmitErrModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{modalContent}}  <!-- 自定义错误信息 -->
					</view>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import schoolPicker from '../../../components/schoolPicker/schoolPicker.vue';
	const registerDB = wx.cloud.database().collection("registerInfo") 
	export default {
		components:{schoolPicker},
		data() {
			return {
				registerType:"",       
				
				/* 公共的注册信息 */
				commonRegisterInfo:{
					userName:",",           /* 姓名*/
					idCard:"", 				/* 身份证 */
					imgList: [],
					phoneNumber:"",         /* 电话号码*/
					// todo 验证码的校验
					validateCode:"", 		/* 验证码*/
				},
				
				/* 校园帮的注册信息 */
				studentRegisterInfo:{
					provinceSchool:"", 		/* 学校信息 */
					schoolData: "",
					education:"",  			/* 学历 */
					college:"", 			/* 学院*/
					major:"", 				/* 专业*/
				},
				
				modalTitle:"",
				modalContent:"",
				hasBlank : false,
				
				allowRecommend:false,	/* 单身情况下是否允许推荐对象*/

				imgNum : 4,
				showModal:false, 		/* 是否展示弹框*/
				index_education:-1,
				
				/* 控制显示的内容 */
				submitErrModal:false,  /* 信息提交错误时显示*/
				schoolShow :"",        /* 是否显示学生的院校相关注册信息*/
				errMessage:"根据判断进行报错提示",   
				educationPicker:["教授","副教授","博士后","博士","硕士","本科","大专","高中","初中","小学","其他"],
			};
		},
		onLoad(options) {
			console.log("跳转页面之后获取到的信息", options.registerType)
			this.registerType = options.registerType
		},
		onShow() {
			if (this.registerType == "校园帮"){
					this.imgNum = 4
					/* 需要进行学校 学院信息 h专业信息的填写 */
					this.schoolShow = true
			}
			
			// this.all_panel_list[0].content = this.subject;
			// this.all_panel_list[1].content= this.regionOfService;
			// this.all_panel_list[2].content= this.gradeForTeacher;
			
		},
		methods:{
			newUserRegister(){
				
			},
			submitAllInformation(res){
				// todo 提交所有信息
				console.log("点击最后的提交")
				/* 首先对验证码进行验证，利用模态框 提示用户如果数据错误的话， 正确就直接提交数据 并展示数据提交成功的页面 */
				/* 模态框验证数据 错误 则给其为true 并给errmessage赋值提示 */
				this.checkFormData()
			},
			checkFormData(){
				this.hasBlank = false
				for (var item in this.commonRegisterInfo) {
					if (this.commonRegisterInfo[item] == ""){
						this.modalTitle = "信息缺失"
						this.modalContent = "请填写完整信息"
						this.submitErrModal = true
						this.hasBlank = true
						break
					}
				}
				if (!this.hasBlank){
					// 提交注册信息到服务器
					this.newUserRegister()
					
					this.modalTitle = "注册成功"
					this.modalContent = "返回继续进行任务填写"
					this.submitErrModal = true
					
					// 注册成功之后 及时将注册信息 标志 true 以表示成功注册
					global.globalData.stuRegister = true
					console.log(this.commonRegisterInfo, this.studentRegisterInfo)
					
				}
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
					urls: this.commonRegisterInfo.imgList,
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
							this.commonRegisterInfo.imgList.splice(e.currentTarget.dataset.index, 1)
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
						if (this.commonRegisterInfo.imgList.length != 0) {
							this.commonRegisterInfo.imgList = this.commonRegisterInfo.imgList.concat(res.tempFilePaths)
						} else {
							this.commonRegisterInfo.imgList = res.tempFilePaths
						}
					}
				});
			},

			selectEducation(res){
				console.log("学历",res)
				this.index_education = res.detail.value
				this.studentRegisterInfo.education = this.educationPicker[this.index_education]
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
					this.studentRegisterInfo.provinceSchool = e.label
					this.studentRegisterInfo.schoolData = school;
					console.log(`学校:${school}`);
				}
			},

			commonInput(res){
				if (res.currentTarget.id == "userName"){
					this.commonRegisterInfo.userName = res.detail.value
					console.log("姓名",this.commonRegisterInfo.userName) 
				}else if(res.currentTarget.id == "phoneNumber"){
					this.commonRegisterInfo.phoneNumber = res.detail.value
					console.log("电话",this.commonRegisterInfo.phoneNumber)
				}else if (res.currentTarget.id == "validateCode"){ /* 注意这里最后提交的时候要进行验证*/
					this.commonRegisterInfo.validateCode = res.detail.value
					console.log("验证码",this.commonRegisterInfo.validateCode)
				}else if (res.currentTarget.id == "idCard"){
					this.commonRegisterInfo.idCard = res.detail.value
					console.log("身份证号",this.commonRegisterInfo.idCard)
				}else if (res.currentTarget.id == "college"){
					this.studentRegisterInfo.college = res.detail.value
					console.log("学院",this.studentRegisterInfo.college)
				}else if (res.currentTarget.id == "major"){
					this.studentRegisterInfo.major = res.detail.value
					console.log("专业",this.studentRegisterInfo.major)
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

