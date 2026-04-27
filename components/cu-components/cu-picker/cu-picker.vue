<template name="cu-picker">
	<view class="cu-picker" :key="createKey" :data-key="createKey">
		<view class="mask" :class="{'visible':visible}" @tap="onCancel" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="cu-picker-cnt" :class="{'visible':visible}">
			<view class="cu-picker-header border-bottom"  @touchmove.stop.prevent catchtouchmove="true">
				<text @tap.stop.prevent="onCancel">取消</text>
				<slot></slot>
				<text :style="{'color':themeColor}" @tap.stop.prevent="pickerConfirm">确定</text>
			</view>
			<date-picker 
				v-if="mode=='date'" 
				class="cu-picker-wrapper"
				:startYear="startYear"
				:endYear="endYear"
				:value="value"
				:fields="fields"
				:item-height="itemHeight"
				:current="current"
				:disabled-after="disabledAfter"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</date-picker>
			
			<range-picker
				v-if="mode=='range'" 
				class="cu-picker-wrapper"
				:startYear="startYear"
				:endYear="endYear"
				:value="value"
				:item-height="itemHeight"
				:current="current"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</range-picker>
			
			<half-picker
				v-if="mode=='half'" 
				class="cu-picker-wrapper"
				:startYear="startYear"
				:endYear="endYear"
				:value="value"
				:item-height="itemHeight"
				:current="current"
				:disabled-after="disabledAfter"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</half-picker>
			
			<shortterm-picker
				v-if="mode=='shortTerm'" 
				class="cu-picker-wrapper"
				:startYear="startYear"
				:endYear="endYear"
				:value="value"
				:item-height="itemHeight"
				:current="current"
				expand="60"
				:disabled-after="disabledAfter"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</shortterm-picker>
			
			<time-picker
				v-if="mode=='time'"
				class="cu-picker-wrapper"
				:value="value"
				:item-height="itemHeight"
				:current="current"
				:disabled-after="disabledAfter"
				:second="second"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</time-picker>
			
			<selector-picker
				v-if="mode=='selector'"
				class="cu-picker-wrapper"
				:value="value"
				:item-height="itemHeight"
				:options="options"
				:default-type="defaultType"
				:default-props="defaultProps"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</selector-picker>
			
			<region-picker
				v-if="mode=='region'"
				class="cu-picker-wrapper"
				:value="value"
				:hide-area="hideArea"
				:default-type="defaultType"
				:item-height="itemHeight"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</region-picker>
			
			<region-picker2
				v-if="mode=='region2'"
				class="cu-picker-wrapper"
				:value="value"
				:hide-area="hideArea"
				:default-type="defaultType"
				:item-height="itemHeight"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</region-picker2>
			
			<linkage-picker
				v-if="mode=='linkage'"
				class="cu-picker-wrapper"
				:value="value"
				:options="options"
				:level="level"
				:default-type="defaultType"
				:default-props="defaultProps"
				:item-height="itemHeight"
				@change="handlerChange"
				@touchstart="touchStart" 
				@touchend="touchEnd">
			</linkage-picker>
		</view>
	</view>
</template>

<script>
	import datePicker from "./date-picker.vue"
	import rangePicker from "./range-picker.vue"
	import halfPicker from "./half-picker.vue"
	import shorttermPicker from "./shortterm-picker.vue"
	import timePicker from "./time-picker.vue"
	import selectorPicker from "./selector-picker.vue"
	import regionPicker from "./region-picker.vue"
	import linkagePicker from "./linkage-picker.vue"
	import regionPicker2 from "./region-picker2.vue"
	
	export default {
		name:"cu-picker",
		components:{
			datePicker,
			rangePicker,
			halfPicker,
			timePicker,
			selectorPicker,
			shorttermPicker,
			regionPicker,
			linkagePicker,
			regionPicker2
		},
		props:{
			mode:{
				type:String,
				default:"date"
			},
			value:{//默认值
				type:[String,Array,Number],
				default:""
			},
			current:{//是否默认显示当前时间，如果是，传的默认值将失效
				type:Boolean,
				default:false
			},
			themeColor:{//确认按钮主题颜色
				type:String,
				default:"#2F385F"
			},
			fields:{//日期颗粒度:year、month、day、hour、minute、second
				type:String,
				default:"date"
			},
			disabledAfter:{//是否禁用当前之后的日期
				type:Boolean,
				default:false
			},
			second:{//time-picker是否显示秒
				type:Boolean,
				default:true
			},
			options:{//selector,region数据源
				type:[Array,Object],
				default(){
					return []
				}
			},
			defaultProps:{//selector,linkagle字段转换配置
				type:Object,
				default(){
					return{
						label:"label",
						value:"value",
						children:"children"
					}
				}
			},
			defaultType:{
				type:String,
				default:"label"
			},
			hideArea:{//mode=region时，是否隐藏区县列
				type:Boolean,
				default:false
			},
			level:{
				//多级联动层级，表示几级联动,区间2-4;
				type:[Number,String],
				default:2
			},
			timeout:{//是否开启点击延迟,当快速滚动 还没有滚动完毕点击关闭时得到的值是不准确的
				type:Boolean,
				default:false
			},
			expand:{//mode=shortterm 默认往后拓展天数
				type:[Number,String],
				default:30
			},
			startYear:{
				type:[String,Number],
				default:1970
			},
			endYear:{
				type:[String,Number],
				default:new Date().getFullYear()
			},
			visible:{
				type:Boolean,
				default:false
			}
		},
		created() {
			this.createKey=Math.random()*1000;
		},
		data() {
			return {
				itemHeight:`height: ${uni.upx2px(88)}px;`,
				result:{},
				confirmFlag:true
			};
		},
		methods:{
			touchStart(){
				if(this.timeout){
					this.confirmFlag=false;
				}
			},
			touchEnd(){
				if(this.timeout){
					setTimeout(()=>{
						this.confirmFlag=true;
					},500)
				}
			},
			handlerChange(res){
				let _this=this;
				this.result={...res};
			},
			show(){
				this.$emit("update:visible",true);
			},
			hide(){
				this.$emit("update:visible",false);
			},
			onCancel(res){
				this.$emit("update:visible",false);
				this.$emit("cancel");
			},
			pickerConfirm(){
				if(!this.confirmFlag){
					return;
				};
				this.$emit("confirm",this.result);
				this.$emit("update:visible",false);
			}
		}
	}
</script>

<style lang="scss">
	.cu-picker-item {
	  text-align: center;
	  width: 100%;
	  // height: 88rpx;
	  line-height: 88rpx;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  font-size: 30rpx;
	}
	.cu-picker{
		z-index: 888;
		.mask {
		  position: fixed;
		  z-index: 1000;
		  top: 0;
		  right: 0;
		  left: 0;
		  bottom: 0;
		  background: rgba(0, 0, 0, 0.6);
		  visibility: hidden;
		  opacity: 0;
		  transition: all 0.3s ease;
		}
		.mask.visible{
			visibility: visible;
			opacity: 1;
		}
		.cu-picker-cnt {
		  position: fixed;
		  bottom: 0;
		  left: 0;
		  width: 100%;
		  transition: all 0.3s ease;
		  transform: translateY(100%);
		  z-index: 3000;
		  background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
			overflow: hidden;
		}
		.cu-picker-cnt.visible {
		  transform: translateY(0);
		}
		.cu-picker-header{
		  display: flex;
		  align-items: center;
		  padding: 0 30rpx;
		  height: 88rpx;
		  background-color: #fff;
		  position: relative;
		  text-align: center;
		  font-size: 32rpx;
		  justify-content: space-between;
		  // border-bottom: solid 1px #eee;
		  .cu-picker-btn{
		  	font-size: 30rpx;
		  }
		}
		
		.cu-picker-hd:after {
		  content: ' ';
		  position: absolute;
		  left: 0;
		  bottom: 0;
		  right: 0;
		  height: 1px;
		  border-bottom: 1px solid #e5e5e5;
		  color: #e5e5e5;
		  transform-origin: 0 100%;
		  transform: scaleY(0.5);
		}
	}
</style>
