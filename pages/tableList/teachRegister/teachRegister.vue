<template>
	<!-- 老师注册页面 -->
	<!-- 根据跳转过来携带的信息 定制注注册页面
		校园帮
		家教培训
		考研学长帮
		就业考试咨询
	 -->
	<view>
		<form style="margin: 10px">
			<view class="cu-form-group">
				<view class="title">目前学历</view>
				<picker :value="index_education" @change="selectEducation" :range="educationPicker">
					<view class="picker">
						{{index_education>-1?educationPicker[index_education]:"请选择..."}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group" @click="showSchoolPicker">
				<view class="title">院校信息</view> <!-- 这里将会包括 学校 学院信息 专业-->
				<view class="picker">{{provinceSchool}}</view>
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
			
			<!-- 图片 -->
			<view class="cu-bar bg-white margin-top-xs">
				<view class="action">
					身份认证(身份证与学生证/教师证正反面)
				</view>
				<view class="action">
					{{imgList.length}}/4
				</view>
			</view> 
			<view class="cu-form-group">
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
				provinceSchool:"", 		/* 学校信息 */
				userName:",",           
				phoneNumber:"",         /* 电话号码*/
				// todo 验证码的校验
				validateCode:"", 		/* 验证码*/  
				
				college:"", 			/* 学院*/
				major:"", 				/* 专业*/
				
				imgList: [],
				
				showModal:false, 		/* 是否展示弹框*/
				index_education:-1,
				
				/* 控制显示的内容 */
				submitErrModal:false,  /* 信息提交错误时显示*/
				errMessage:"根据判断进行报错提示",   
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

			selectEducation(res){
				console.log("学历",res)
				this.index_education = res.detail.value
				this.education = this.educationPicker[this.index_education]
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
					this.provinceSchool = e.label
					this.schoolData = school;
					console.log(`学校:${school}`);
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

