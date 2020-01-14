<template>
    <view>
        <button type="primary" @click="showSchoolPicker">只选择学校</button>
        <view style="margin-top: 1rem;text-align: center;">{{schoolData}}</view>
        <!-- 学校选择组件-->
        <schoolPicker themeColor="#000" ref="schoolPicker" @onConfirm="onConfirm"></schoolPicker>
    </view>
</template>
<script>
	//高校学校列表组件		
	import schoolPicker from '../../../components/schoolPicker/schoolPicker.vue';

	export default {
		components: {
			schoolPicker
		},
		data() {
			return {
				schoolData: ''
			}
		},
		methods: {
			/**
			 * 打开学校选择器
			 */
			showSchoolPicker: function() {
				this.$refs.schoolPicker.show()
			},
			/**
			 * 打开 省/市/学校 选择器
			 */
			showSchoolPicker2: function() {
				this.$refs.schoolPicker2.show()
			},
			/**
			 * 确认学校选择
			 */
			onConfirm(e) {
				const school = e.label.split("-")[2];
				console.log(`源数据:${JSON.stringify(e)}`);
				if (school === '暂未收录') {
					return;
				} else {
					this.schoolData = school;
					console.log(`学校:${school}`);
				}
			},
			/**
			 * 确认 省/市/学校 选择
			 */
			onConfirm2(e) {
				this.schoolData = e.label.split("-").reverse().find(v => v != '所有');
			}
		}
	}

</script>

<style lang="scss">

</style>
