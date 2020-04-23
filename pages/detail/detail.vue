<template>
	<view v-if="!success">
	  <view class="row_wlq">
	    <label class="title_wlq">我的地址</label>
	    <view class="addresinfo_wlq" >{{address}}</view>
	  </view>
	  <view class="row_wlq">
	    <label class="title_wlq">类型</label>
	    <view class="info_wlq">
	      {{type=="service" ? "寻找服务":"发布任务"}}
	    </view>
	  </view>
	  <view class="row_wlq">
	    <label class="title_wlq">说明</label>
	    <view class="info_wlq">
	      {{message}}
	    </view>
	  </view>
	  <view class="row_wlq">
	    <label class="title_wlq">联系方式</label>
	    <view class="info_wlq">
	      {{contact}} 
	    </view>
	  </view>

	  <view class="success_page_wlq" :v-if="success">
	    <button class="backButton_wlq" type="primary" @tap="backToFirstPage" >返回首页</button> 
	  </view>
	  
	</view>
</template>

<script>
	const DB = wx.cloud.database().collection("users")
	
	export default {
		data() {
			return {
				  address:"",
				  type:"",
				  message:"",
				  contact:""
			};
		},
		
		onLoad(options) {
		  console.log("跳转页面之后获取到的信息", options.id)
		  this.getDetailInfo(options.id)
		},
		
		onShareAppMessage() {
		  return {
		    title: "发布你的信息",
		    path: "/pages/tabbar-1/tabbar-1"
		  }
		},
		
		methods:{
			getDetailInfo(id){
			  DB.where({
			    _id:id
			  }).get({
			    success: this.getDetailInfoSucc.bind(this)
			  })
			},
			// 由于获取的是单个的用户信息 返回的 字典构成的list 0 号元素就是我们要的元素
			getDetailInfoSucc(res){
				const result = res.data[0]; // 由于获取的是单个的用户信息 返回的 字典构成的list 0 号元素就是我们要的元素
				console.log("获取到用户的基本信息。。。",result);
			    console.log(result)
				this.address = result.address,
				this.type =result.type,
				this.message = result.message,
				this.contact = result.contact
			},
			backToFirstPage(){
				console.log("打算返回首页")
				uni.navigateBack({
					delta:1
				})
			} 
		}
	};
	  
</script>

<style lang="scss">
.page_wlq{
  background: #eee;
}
.row_wlq{
  line-height: 45px;
  border-bottom: 1px solid #ccc; 
  overflow: hidden;
  background: #fff;
  color: #777;
  font-size: 35upx;
  
}

.submit-button_wlq{
  margin: 10px 8px 0px 8px;
  background-color: #ff9700;
  height: 40px;
  border-radius: 6px;
  text-align: center;
  color: #fff
}

.title_wlq{
  width: 90px;
  float: left;
  padding-left: 10px
}

.input_text_wlq{
  height: 45px;
}

.success_page_wlq{
  background: #fff
}
.congratulation_wlq{
  text-align: center;
  line-height: 100px;
  font-size: 16px;
}

.icon_style_wlq{
  position: relative;
  top: 4px;
  margin-right: 10px; 
}

.backButton_wlq{  
  margin: 20px 20px 20px 20px;
  background: green;
  color: red;
}

.addresinfo_wlq{
  margin-left: 80px;
  line-height: 24px;
}

</style>
