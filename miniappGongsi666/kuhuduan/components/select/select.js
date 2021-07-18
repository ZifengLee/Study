Component({
 	/**
 	 * 组件的属性列表
 	 */
 	properties: {
 		propArray: {
 			type: Object,
 		}
 	},
 	/**
 	 * 组件的初始数据
 	 */
 	data: {
 		selectShow: false, //初始option不显示
 		
 		xiala: 2, //
 		selected: false, //判断是否有选中的状态
 		nowId: '',
 		color: '', //判断字体颜色
 	},
 	/**
 	 * 组件的方法列表
 	 */
	// onLoad:function(){
	// 	console.log(this.properties.propArray.selectText)
	// 	var that = this;
	// 	if (this.data.selected == true) {
	// 		this.setData({
	// 			color:"#22D09D",
				
	// 		})
	// 	} 
		
	// },
 	methods: {
 		//option的显示与否
 		selectToggle: function() {
			if (this.data.selected == false && this.data.selectShow == false) {
				this.setData({
					xiala:3,
					selectShow:true
				})
			} else if(this.data.selected == false && this.data.selectShow == true){
				this.setData({
					xiala:2,
					selectShow:false,
					
				})
			}else if(this.data.selected == true && this.data.selectShow == false){
				this.setData({
					xiala:1,
					selectShow:true,
					color:"#22D09D",
					
				})
			}else if(this.data.selected == true && this.data.selectShow == true){
				this.setData({
					xiala:0,
					selectShow:false,
					color:"#22D09D",
				})
			}
 		},
 		//设置内容
 		setText: function(e) {
 			var nowData = this.properties.propArray.selectArray; //当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过this.properties
 			var nowIdx = e.target.dataset.index; //当前点击的索引

 			var nowText = nowData[nowIdx].text || nowData[nowIdx].value || nowData[nowIdx]; //当前点击的内容
 			//再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
			if(nowIdx != 0){
				// console.log('11111')
				this.setData({
					selected:true,
					color:"#22D09D",
					xiala:0
				})
			}else{
				this.setData({
					selected:false,
					color:"#000",
					xiala:2
				})
			}

 			this.setData({
 				selectShow: false,
 				selectText: nowText,
 				
 				nowId: nowIdx,

 			})
 			// console.log(this.data.nowId)
 			this.triggerEvent('select', nowData[nowIdx])
 		}
 	}
 })
