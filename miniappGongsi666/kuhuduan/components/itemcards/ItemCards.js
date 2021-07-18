// components/childpages/storeinformation/itemcards/ItemCards.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		itemData: {
			type: Object
		}
	},
	pageLifetimes: {
		show() {
			// console.log(this.data.itemData);
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		//商品数量
		goodsNumber: 1,
		//遮罩层显示状态
		mask: true,
		//购物车弹窗显示隐藏
		cartBox: true,
		//单规格
		danguige: true,
		//多规格
		duoguige: false,
		specActive:1,

		guigelist: [{
			index:1,
				id: 1,
				guige: '白色'
			},
			{
				index:2,
				id: 2,
				guige: '红色'
			},
			{
				index:3,
				id: 3,
				guige: '黑色'
			}
		],
		guigeId: 0,
		carts: [], // 购物车列表
		hasList: false, // 列表是否有数据
		totalPrice: 0, // 总价，初始为0
		totalOldPrice:0,//原始总价，初始数据为0
		selectAllStatus: true // 全选状态，默认全选
	},

onShow() {
        this.setData({
          hasList: true,        // 既然有数据了，那设为true吧
          carts:[
            {id:1,title:'新鲜芹菜 半斤',image:'/image/s5.png',num:4,price:0.01,selected:true},
            {id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03,selected:true}
          ]
        });
      },

	/**
	 * 组件的方法列表
	 */
	
	methods: {
		// 加入购物车
		joinCart: function(e) {
			this.setData({
				cartBox: !this.data.cartBox, //显示隐藏购物车弹窗
				mask: !this.data.mask, //显示隐藏遮罩层
			})
			
		},
		//点击遮罩层隐藏弹窗
		hideAllBox: function(e) {
			this.setData({
				//遮罩层隐藏
				mask: true,
				//产品参数弹窗隐藏
				paramsBox: true,
				//购物车弹窗隐藏
				cartBox: true,
				//选择规格弹窗隐藏
				choice: true,

			})
		},
		// 点击右上角关闭按钮
		showCart: function(e) {
			this.setData({
				//遮罩层隐藏
				mask: true,
				//产品参数弹窗隐藏
				paramsBox: true,
				//购物车弹窗隐藏
				cartBox: true,
				//选择规格弹窗隐藏
				choice: true,

			})
		},
		// 数量减少
		reduceNumber: function(e) {
			var num = this.data.goodsNumber;
			// 如果大于1时，才可以减  
			if (num > 1) {
				num--;
			}
			// 只有大于一件的时候，才能normal状态，否则disable状态  
			var minusStatus = num <= 1 ? 'disabled' : 'normal';
			// 将数值与状态写回  
			this.setData({
				goodsNumber: num,
				minusStatus: minusStatus
			});
		},
		// 数量增加
		addNumber: function(e) {
			var num = this.data.goodsNumber;
			// 不作过多考虑自增1  
			num++;
			// 只有大于一件的时候，才能normal状态，否则disable状态  
			var minusStatus = num < 1 ? 'disabled' : 'normal';
			// 将数值与状态写回  
			this.setData({
				goodsNumber: num,
				minusStatus: minusStatus
			});
		},
		// 选择规格
		OneSelectSpec: function(e) {
			this.setData({

				specActive: e.currentTarget.dataset.index,
			})
		},
		// 点击确定按钮,加入购物车
		cartBoxClick: function(e) {
			this.setData({
				//遮罩层隐藏
				mask: true,
				//产品参数弹窗隐藏
				paramsBox: true,
				//购物车弹窗隐藏
				cartBox: true,
				//选择规格弹窗隐藏
				choice: true,

			})
		//将购物车数据添加到缓存
			  var that = this
			  //获取缓存中的已添加购物车信息
			  var carts = wx.getStorageSync('carts') || []
			  // console.log(carts)
			  //判断购物车缓存中是否已存在该货品
			  var exist = carts.find(function (ele) {
			    return ele.id === that.data.itemData.id
			  })
			  // console.log(that.data)
			  if (exist) {
			    //如果存在，则增加该货品的购买数量
			    exist.num = parseInt(exist.num) + that.data.goodsNumber
			  } else {
			    //如果不存在，传入该货品信息
			    carts.push({
			      id: that.data.itemData.id,
			      // quantity: that.data.goodsNumber,
				  num: that.data.goodsNumber,
				  image: that.data.itemData.imgUrl,
			      price: that.data.itemData.realTimePrice,
			      title: that.data.itemData.skuName,
				  selected: false,
			      goodsPicsInfo: that.data.guigelist[that.data.specActive - 1].guige
			    })
			  }
			  //加入购物车数据，存入缓存
			  wx.setStorage({
			    key: 'carts',
			    data: carts,
			    success: function (res) {
			      //添加购物车的消息提示框
			      wx.showToast({
			        title: "添加购物车",
			        icon: "success",
			        durantion: 2000
			      })
			    }
			  })
				
				
			
				
		}
	},

})
