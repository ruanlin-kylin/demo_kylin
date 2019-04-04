        var form_pm_obj = {};
        var form_db = {};
        var sys_db = {};
        var currentHref = window.location.href;
		var meId = urlStr(currentHref,"id");
		var menuId = urlStr(currentHref,"menuId");

        // <c:if test="${form_pm!=null}">form_pm_obj =${form_pm}</c:if>
        // 		<c:if test="${form_db!=null}">form_db =${form_db}</c:if>
        // 				<c:if test="${sys_db!=null}">sys_db =${sys_db}</c:if>
        var open_window_width;
        var open_window_default_width = 900;
        if (form_db.open_window_width && (form_db.open_window_width * 1) > 0) {
        	open_window_width = form_db.open_window_width * 1;
        } else if (form_pm_obj.open_window_width && (form_pm_obj.open_window_width * 1) > 0) {
        	open_window_width = form_pm_obj.open_window_width * 1;
        }

        function openWindow(url, bakFun) {
        	window.openWindowBanFun = bakFun;
        	if (open_window_width && (open_window_width * 1) > 0) {
        		showRightPopGetWidth("config_btn_panel", open_window_width + "px");
        	} else {
        		showRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
        	}

        	$("#config_btn_panel").html('<div class="clearfix head-line"><em class="back-btn" onclick="javascript:cloudOpenWindow();"></em></div><iframe width="100%" height="' + ($(window).height() - 50) + '" scrolling="no" frameborder="0" src="' + url + '"></iframe>');
        	$("#config_btn_panel").show();
        	if (url.indexOf("hideWindow") != -1) {
        		$("#config_btn_panel").hide();
        	}
        }

        function cloudOpenWindow(isSuccess) {
        	if (open_window_width && (open_window_width * 1) > 0) {
        		hideRightPopGetWidth("config_btn_panel", open_window_width + "px");
        	} else {
        		hideRightPopGetWidth("config_btn_panel", open_window_default_width + "px");
        	}
        	if (isSuccess) {
        		if (window.openWindowBanFun) {
        			window.openWindowBanFun();
        		}
        	}
        }


        var schedulerid = 1;
        var schedulerConfig = {
        	// id:"${id}",
        	id: meId,
        	eacthKey: "scheduler_eatchKey_{id}_",
        	current_map_data: {},
        	current_data_db_obj: {},
        	currentDate: function () {
        		// var key = schedulerConfig.eacthKey.replace("{id}",schedulerConfig.id)+"_currentDate";
        		var key = schedulerConfig.eacthKey.replace(meId, schedulerConfig.id) + "_currentDate";
        		var currentDate = localStorage.getItem(key);
        		if (!currentDate) {
        			currentDate = new Date();
        		} else {
        			currentDate = new Date(currentDate);
        			try {
        				if (!(currentDate && currentDate.format("MM月dd日") != "")) {
        					currentDate = new Date();
        				}
        			} catch (e) {
        				currentDate = new Date();
        			}
        		}
        		return currentDate;
        	},
        	currentView: function () {
        		var key = schedulerConfig.eacthKey.replace("{id}", schedulerConfig.id) + "_currentView";
        		var currentView = localStorage.getItem(key);
        		if (!currentView) {
        			currentView = "day";
        		}
        		return currentView;
        	},
        	setCurrentDateOrView: function (type, value) {
        		var key = schedulerConfig.eacthKey.replace("{id}", schedulerConfig.id) + "_" + type;
        		localStorage.setItem(key, value);
        	},
        	timeKeyAM: {
        		"1": "01",
        		"2": "02",
        		"3": "03",
        		"4": "04",
        		"5": "05",
        		"6": "06",
        		"7": "07",
        		"8": "08",
        		"9": "09",
        		"10": "10",
        		"11": "11",
        		"12": "00"
        	},
        	timeKeyPM: {
        		"1": "13",
        		"2": "14",
        		"3": "15",
        		"4": "16",
        		"5": "17",
        		"6": "18",
        		"7": "19",
        		"8": "20",
        		"9": "21",
        		"10": "22",
        		"11": "23",
        		"12": "12"
        	},
        	dayOfWeekNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        	movieData: [{
        		id: 1,
        		text: "His Girl Friday",
        		director: "Howard Hawks",
        		year: 1940,
        		image: "../../../../images/movies/HisGirlFriday.jpg",
        		duration: 92,
        		color: "#cb6bb2"
        	}],
        	getCurrentDateMark: function () {
        		try {
        			var me = this;
        			if (me.currentView() == "day") {
        				return me.currentDate().format("MM月dd日");
        			} else {
        				if (me.currentView() == "week") {
        					var aboutDate = me.getDateAboutDate(me.currentDate(), "MM月dd日");
        					return aboutDate.startWeekDateStr + "~" + aboutDate.endWeekDateStr;
        				} else {
        					var aboutDate = me.getDateAboutDate(me.currentDate(), "MM月dd日");
        					return aboutDate.startMonthDateStr + "~" + aboutDate.endMonthDateStr;
        				}
        			}
        		} catch (e) {
        			console.log("getCurrentDateMark Exception:", e);
        		}
        	},
        	dateCellTemplate: function (cellData, index, container) {
        		var dText = new Date(cellData.date.getTime()).format("MM月dd日");
        		if (schedulerConfig.currentView() == "month") {
        			container.append(
        				$("<div />")
        				.addClass("name")
        				.text(schedulerConfig.dayOfWeekNames[cellData.date.getDay()])
        			);
        		} else {
        			container.append(
        				$("<div />")
        				.addClass("name")
        				.text(schedulerConfig.dayOfWeekNames[cellData.date.getDay()]),
        				$("<div />")
        				.addClass("number")
        				.text(dText)
        			);
        		}
        	},
        	changeAmPm: function (key) {
        		var keys = key.split(" ");
        		if (keys.length == 2) {
        			var tmark = $.trim(keys[0]);
        			var pk = $.trim(keys[1]);
        			if (tmark && pk) {
        				var tmkList = tmark.split(":");
        				if (tmkList.length == 2) {
        					var text = ":" + tmkList[1];
        					if ("AM" == pk) {
        						text = schedulerConfig.timeKeyAM[tmkList[0]] + "" + text;
        					} else {
        						text = schedulerConfig.timeKeyPM[tmkList[0]] + "" + text;
        					}
        					return text;
        				}
        			}
        		}
        		return text;
        	},
        	getDateAboutDate: function (curDate, format) {
        		var now = curDate; //当前日期
        		var nowDayOfWeek = now.getDay() == 0 ? 7 : now.getDay(); //今天本周的第几天
        		var nowDay = now.getDate(); //当前日
        		var nowMonth = now.getMonth(); //当前月
        		var nowYear = now.getFullYear(); //当前年
        		var today = new Date().format("yyyy-MM-dd"); //当前日期
        		var todayDate = new Date(today + " 00:00:00");
        		var beginWeek = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1); //本周第一天
        		var endWeek = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek)); //本周最后一天
        		var beginMonth = new Date(nowYear, nowMonth, 1); //本月第一天
        		var endMonth = new Date(nowYear, nowMonth, schedulerConfig.getMonthDays(nowMonth, nowYear)); //本月最后一天
        		var aboutDate = {
        			"startWeekDate": beginWeek,
        			"endWeekDate": endWeek,
        			"startMonthDate": beginMonth,
        			"endMonthDate": endMonth
        		};
        		if (format) {
        			aboutDate['startWeekDateStr'] = beginWeek.format(format);
        			aboutDate['endWeekDateStr'] = endWeek.format(format);
        			aboutDate['startMonthDateStr'] = beginMonth.format(format);
        			aboutDate['endMonthDateStr'] = endMonth.format(format);
        		}
        		return aboutDate;
        	},
        	getMonthDays: function (myMonth, nowYear) {
        		var monthStartDate = new Date(nowYear, myMonth, 1);
        		var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        		var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        		return days;
        	},
        	load: function () {
        		var me = this;
        		var aboutDate = schedulerConfig.getDateAboutDate(schedulerConfig.currentDate(), "yyyy-MM-dd");
        		var params = {
        			"startDate": aboutDate.startWeekDateStr,
        			"endDate": aboutDate.endWeekDateStr
        		};
        		if ("month" == schedulerConfig.currentView()) {
        			params['startDate'] = aboutDate.startMonthDateStr;
        			params['endDate'] = aboutDate.endMonthDateStr;
        		}
        		var dataMap = {};
        		var loadMsg = layer.msg("正在加载...", {
        			icon: 16,
        			shade: [0.1, '#393D49'],
        			time: 3000
        		});
        		// params={"startDate":"2019-02-25","endDate":"2019-03-03"};
        		// $.ajax({
        		//     type:"get",
        		//     url:ctx+"/cloud/menu_v1/calendar/"+meId,
        		//     //data :params,
        		//     success:function(json){
        		//         console.log("日历信息："+JSON.stringify(json));
        		//         if(json.result=="SUCCESS"){

        		//         }
        		//     }
        		// })

        		$.ajax({
        			type: "get",
        			// url : ctx+"/cloud/calendar/getData/"+me.id,
        			url: ctx + "/cloud/calendar/getData/" + meId,
        			data: params,
        			success: function (json) {
        				console.log("成功", 1)
        				// alert(JSON.stringify(json));
        				if (json.result == "Success" || json.result == "SUCCESS") {
        					dataMap['leanderData'] = json.map.leanderData;
        					dataMap['taskData'] = json.map.taskData;
        					dataMap['taskSetting'] = json.map.taskSetting;
        					dataMap['taskTable'] = json.map.taskTable;
        					if (dataMap.leanderData && dataMap.leanderData.length > 0) {
        						dataMap.leanderData = me.handlerLeaderData(dataMap.leanderData);
        						dataMap.taskData = me.handerTaskDb(dataMap.taskData);
        					}
        					schedulerConfig.current_map_data = dataMap;
        					initScheduler(dataMap, loadMsg);
        				} else {
        					console.log("失败", 2)
        					tipsMsg(json.resultMsg, "FAIL");

        				}
        			}
        		});
        	},
        	handlerLeaderData: function (leanderData) {
        		var leaderObj = {};
        		for (var i = 0; i < leanderData.length; i++) {
        			var db = leanderData[i];
        			if (db.root_id && db.root_name) {
        				var rootDb = {};
        				if (leaderObj[db.root_id]) {
        					rootDb = leaderObj[db.root_id];
        				} else {
        					rootDb['id'] = db.root_id;
        					rootDb['text'] = db.root_name;
        					rootDb['root_id'] = db.root_id;
        					rootDb['root_name'] = db.root_name;
        					rootDb['root_description'] = db.root_description;
        					for (var j in db) {
        						if (!rootDb[j]) {
        							rootDb[j] = db[j];
        						}
        					}
        				}
        				var timeList = [];
        				if (rootDb['timeList']) {
        					timeList = rootDb['timeList'];
        				}
        				timeList.push({
        					"startDate": new Date(db.start_time),
        					"endDate": new Date(db.end_time)
        				})
        				rootDb['timeList'] = timeList;
        				leaderObj[db.root_id] = rootDb;
        			}
        		}
        		var leanderList = [];
        		for (var i in leaderObj) {
        			leanderList.push(leaderObj[i]);
        		}
        		return leanderList;
        	},
        	handerTaskDb: function (taskDb) {
        		var dbList = [];
        		if (taskDb && taskDb.length > 0) {
        			for (var i = 0; i < taskDb.length; i++) {
        				var db = taskDb[i];
        				if (db.root_id && db.start_time && db.end_time && db.primary_id) {
        					db['startDate'] = new Date(db.start_time);
        					db['endDate'] = new Date(db.end_time);
        					db['original_root_id'] = db.root_id;
        					db['movieId'] = 1;
        					dbList.push(db);
        				}
        			}
        		}
        		return dbList;
        	},
        	getLeanderDb: function (leanderData, root_id, startDate, endDate) {
        		for (var i = 0; i < leanderData.length; i++) {
        			var db = leanderData[i];
        			if (db.root_id == root_id) {
        				return dbObj = db;
        			}
        		}
        	},
        	openForm: function (taskSetting, tableObj, type, leanderDb, data, buttonObj) {
        		me = this;
        		if (tableObj && tableObj.buttonList && tableObj.buttonList.length > 0 && (taskSetting.add_btn || taskSetting.update_btn)) {
        			var buttonList = tableObj.buttonList;
        			if (!buttonObj) {
        				if ("ADD" == type) {
        					for (var i = 0; i < buttonList.length; i++) {
        						if (buttonList[i].sid == taskSetting.add_btn && buttonList[i].type == "ADD") {
        							buttonObj = buttonList[i];
        							break;
        						}
        					}
        				}
        			}
        			if (buttonObj) {
        				var startDate = data.startDate;
        				var endDate = data.endDate;
        				var root_id = (data.groups ? data.groups.root_id : data.root_id);
        				var params = {};
        				params['startDate'] = new Date(startDate.getTime()).format("yyyy-MM-dd HH:mm");
        				params['endDate'] = new Date(endDate.getTime()).format("yyyy-MM-dd HH:mm");
        				params['startTime'] = new Date(startDate.getTime()).format("HH:mm");
        				params['endTime'] = new Date(endDate.getTime()).format("HH:mm");
        				params['date'] = new Date(endDate.getTime()).format("yyyy-MM-dd");
        				var leanderDb = me.getLeanderDb(leanderDb, root_id, startDate, endDate);
        				if (data) {
        					for (var i in data) {
        						if (!params[i] && i != "timeList") {
        							params[i] = data[i];
        						}
        					}
        				}
        				if (leanderDb) {
        					for (var i in leanderDb) {
        						if (!params[i] && i != "timeList") {
        							params[i] = leanderDb[i];
        						}
        					}
        				}
        				var pmDb = {
        					form: params,
        					table: data
        				};
        				pmDb['sys'] = {};
        				var btType = buttonObj.type;
        				$($("#template").find("input")[0]).attr("key_id", buttonObj.sid);
        				var buttonConfig = {};
        				var buttonText = buttonObj.name;
        				buttonConfig[buttonObj.sid] = buttonObj;
        				if (btType == "DELETE") {
        					confirmMsg("是否确认" + buttonText, function () {
        						btf.button.clickButton($("#template").find("input")[0], buttonConfig, pmDb, function () {
        							schedulerConfig.load();
        						});
        					});
        				} else {
        					btf.button.clickButton($("#template").find("input")[0], buttonConfig, pmDb, function () {
        						schedulerConfig.load();
        					});
        				}
        			}
        		}
        	},
        	clickButton: function (me) {
        		$(".dx-overlay-wrapper").hide();
        		var buttonId = $(me).attr("key_id");
        		var dataMap = schedulerConfig.current_map_data;
        		if ((dataMap.leanderData && dataMap.leanderData.length > 0)) {
        			var curClickConfig = {};
        			var lastSelectConfig = {};
        			var tableObj = dataMap.taskTable;
        			var taskSetting = dataMap.taskSetting;
        			var buttonList = tableObj.buttonList;
        			for (var i = 0; i < buttonList.length; i++) {
        				if (buttonList[i].sid == buttonId) {
        					var buttonObj = buttonList[i];
        					schedulerConfig.openForm(taskSetting, tableObj, buttonObj.type, dataMap.leanderData, schedulerConfig.current_data_db_obj, buttonObj);
        					return;
        				}
        			}
        		}
        	}
        };

        function testData() {
        	var theatreData = [{
        		text: "Cinema Hall 1",
        		id: 0
        	}, {
        		text: "Cinema Hall 2",
        		id: 1
        	}];
        	var data = [{
        		theatreId: 0,
        		movieId: 3,
        		price: 10,
        		startDate: new Date("2018-11-10 09:10"),
        		endDate: new Date("2018-11-10 09:40")
        	}, {
        		theatreId: 0,
        		movieId: 1,
        		price: 5,
        		startDate: new Date("2018-11-10 10:00"),
        		endDate: new Date("2018-11-10 11:00")
        	}]
        	return {
        		leanderData: theatreData,
        		taskData: data
        	};
        }


        function initScheduler(dataMap, loadMsg) {
        	if (!(dataMap.leanderData && dataMap.leanderData.length > 0)) {
        		    //    tipsMsg("没有数据", "FAIL");
        	}
        	var curClickConfig = {};
        	var lastSelectConfig = {};
        	var tableObj = dataMap.taskTable;
        	var taskSetting = dataMap.taskSetting;
        	$("#schedulerContent").html('<div class="demo-container"><div id="' + schedulerid + '"></div></div>');
        	var scheduler = $("#" + schedulerid).dxScheduler({
        		dataSource: dataMap.taskData,
        		firstDayOfWeek: 1,
        		views: [{
        				type: "day",
        				name: "日",
        				intervalCount: 1,
        				dateCellTemplate: schedulerConfig.dateCellTemplate
        			},
        			{
        				type: "week",
        				name: "周",
        				dateCellTemplate: schedulerConfig.dateCellTemplate
        			},
        			{
        				type: "month",
        				name: "月",
        				dateCellTemplate: schedulerConfig.dateCellTemplate
        			}
        		],
        		currentView: schedulerConfig.currentView(),
        		currentDate: schedulerConfig.currentDate(),
        		startDayHour: 8,
        		endDayHour: 23,
        		showAllDayPanel: false,
        		height: 800,
        		groups: ["root_id"],
        		crossScrollingEnabled: true,
        		cellDuration: 20,
        		editing: {
        			allowAdding: false
        		},
        		resources: [{
        				fieldExpr: "root_id",
        				dataSource: dataMap.leanderData
        			},
        			{
        				fieldExpr: "movieId",
        				dataSource: schedulerConfig.movieData,
        				useColorAsDefault: true
        			}
        		],
        		onOptionChanged: function (data, e) {
        			if (data.name == "currentDate" || data.name == "currentView") {
        				if ("currentDate" == data.name) {
        					schedulerConfig.setCurrentDateOrView("currentDate", new Date(data.value.getTime()).format("yyyy-MM-dd"));
        					schedulerConfig.load();
        				} else {
        					if (data.value == "日" || data.value == "day") {
        						schedulerConfig.setCurrentDateOrView("currentView", "day");
        					} else {
        						if (data.value == "周" || data.value == "week") {
        							schedulerConfig.setCurrentDateOrView("currentView", "week");
        						} else {
        							schedulerConfig.setCurrentDateOrView("currentView", "month");
        						}
        					}
        				}
        			} else if ("selectedCellData" == data.name) {
        				if (data.value && data.value.length > 0) {
        					var sData = data.value[0];
        					var eData = data.value[((data.value.length) - 1)];
        					if (sData.groups && eData.groups && sData.groups.root_id == eData.groups.root_id) {
        						sData.endDate = eData.endDate;
        						lastSelectConfig = {
        							time: new Date().getTime(),
        							data: sData
        						}
        					}
        				} else {
        					lastSelectConfig = null;
        				}
        			} else {
        				lastSelectConfig = null;
        			}
        			return false;
        		},
        		onCellClick: function (e, b) {
        			if (e.cellData.groups && e.cellData.groups.root_id) {
        				var root_id = e.cellData.groups.root_id;
        				var startDate = new Date(e.cellData.startDate.getTime()).format("yyyy-MM-dd HH:mm:ss");
        				var endDate = new Date(e.cellData.endDate.getTime()).format("yyyy-MM-dd HH:mm:ss");
        				var curLong = new Date().getTime();
        				if (curClickConfig && curClickConfig.time && (curLong - curClickConfig.time) <= 300 && root_id == curClickConfig.root_id && startDate == curClickConfig.startDate && endDate == curClickConfig.endDate && validateLeanderIsApp(root_id, e.cellData.startDate, e.cellData.endDate)) {
        					var data = e.cellData;
        					if (lastSelectConfig && lastSelectConfig.data) {
        						if (e.cellData.groups.root_id == lastSelectConfig.data.groups.root_id && validateLeanderIsApp(root_id, lastSelectConfig.data.startDate, lastSelectConfig.data.endDate)) {
        							data = lastSelectConfig.data;
        							lastSelectConfig = null;
        						}
        					}
        					schedulerConfig.openForm(taskSetting, tableObj, "ADD", dataMap.leanderData, data);
        					curClickConfig = {};
        				} else {
        					curClickConfig = {
        						time: curLong,
        						startDate: startDate,
        						endDate: endDate,
        						root_id: root_id
        					};
        				}
        			}
        		},
        		onDisposed: function (a, b, c) {
        			console.log(a, b, c);
        		},
        		onAppointmentDblClick: function (e) {
        			e.cancel = true;
        		},
        		onContentReady: function () {
        			layer.close(loadMsg);
        			$(".dx-scheduler-time-panel").find(".dx-scheduler-cell-sizes-vertical").each(function (i, obj) {
        				obj = $($(obj).find("div")[0]);
        				var key = $.trim(obj.text());
        				if (key) {
        					obj.html(schedulerConfig.changeAmPm(key));
        				}
        			});
        		},
        		resourceCellTemplate: function (data, index, element) { //更改头部标签样式
        			element.append("<span class='search-title'>" + data.text + "（" + schedulerConfig.getCurrentDateMark() + "）</span>");
        		},
        		appointmentTooltipTemplate: function (data) {
        			schedulerConfig.current_data_db_obj = data;
        			var markup = getTooltipTemplate(data, tableObj.buttonList);
        			return markup;
        		},
        		appointmentTemplate: function (data) {
        			return $("<div class='showtime-preview'>" + "<div>" + data.title + "</div>" + "</div>" +
        				"<div>" + new Date(data.startDate.getTime()).format("HH:mm") + " - " + new Date(data.endDate.getTime()).format("HH:mm") + "</div>");
        		},
        		onAppointmentFormCreated: function (data) {

        		},
        		onAppointmentUpdating: function (e, d, b) { //修改前回调
        			if (e.newData.root_id != e.newData.original_root_id) {
        				e.cancel = true;
        				return;
        			}
        			var startDate = e.newData.startDate;
        			var endDate = e.newData.endDate;
        			var root_id = e.newData.root_id;
        			var isOk = validateLeanderIsApp(root_id, startDate, endDate);
        			if (isOk) {
        				var buttonObj = getEditButton()
        				if (buttonObj && e.newData) {
        					schedulerConfig.openForm(taskSetting, tableObj, "EDIT", dataMap.leanderData, e.newData, buttonObj);
        					e.cancel = true;
        				} else {
        					e.cancel = true;
        				}
        			} else {
        				e.cancel = true;
        			}
        		},
        		onAppointmentUpdated: function (e, d, b) { //修改后回调
        			e.cancel = true;
        		},
        		dataCellTemplate: function (cellData, index, container) {
        			if (!cellData.groups) {
        				return;
        			}
        			var root_id = cellData.groups.root_id;
        			var startDate = cellData.startDate;
        			var endDate = cellData.endDate;
        			var isOk = validateLeanderIsApp(root_id, startDate, endDate);
        			var text = "";
        			if (schedulerConfig.currentView() == "month") {
        				text = new Date(startDate.getTime()).format("MM-dd");
        			}
        			if (!isOk) {
        				container.html("<div style='width:100%;height:100%;background-color: seashell'>" + text + "</div>");
        			} else {
        				var now = new Date();
        				if (cellData.startDate <= now || cellData.endDate <= now) {
        					container.html("<div style='width:100%;height:100%;background-color: whitesmoke'>" + text + "</div>");
        				}
        			}
        		}
        	}).dxScheduler("instance");
        	schedulerid++;

        	function validateLeanderIsApp(root_id, startDate, endDate) {
        		for (var i = 0; i < dataMap.leanderData.length; i++) {
        			var db = dataMap.leanderData[i];
        			if (db.root_id == root_id) {
        				dbObj = db;
        				break;
        			}
        		}
        		var isOk;
        		var now = new Date();
        		if (dbObj != null && dbObj.timeList && dbObj.timeList.length > 0) {
        			var timeList = dbObj.timeList;
        			for (var i = 0; i < timeList.length; i++) {
        				var timeObj = timeList[i];
        				if (timeObj.startDate <= startDate && endDate <= timeObj.endDate && startDate >= now && endDate > now) {
        					isOk = true;
        					break;
        				}
        			}
        		}
        		return isOk;
        	}

        	function getEditButton() {
        		if (tableObj.buttonList && tableObj.buttonList.length > 0) {
        			var buttonList = tableObj.buttonList;
        			for (var i = 0; i < buttonList.length > 0; i++) {
        				if (buttonList[i].sid == taskSetting.update_btn) {
        					return buttonList[i];
        				}
        			}
        		}
        	}
        }

        function existString(idList, id) {
        	if (idList && idList.length > 0) {
        		for (var i = 0; i < idList.length; i++) {
        			if (idList[i] == id) {
        				return true;
        			}
        		}
        	}
        }

        function getTooltipTemplate(data, buttonList) {
        	var buttonHtml = '';
        	if (buttonList && buttonList.length > 0) {
        		for (var i = 0; i < buttonList.length; i++) {
        			var btObj = buttonList[i];
        			if (btObj.type == "EDIT" || btObj.type == "DELETE") {
        				if (existString(data.SHOW_BUTTON_IDS, btObj.sid)) {
        					buttonHtml += '<button onclick="javascript:schedulerConfig.clickButton(this);" key_id="' + btObj.sid + '">' + btObj.name + "</button>&nbsp;&nbsp;&nbsp;&nbsp;";
        				}
        			}

        		}
        	}
        	return $("<div style='text-align: left;'>" + data.description + "<br />" + buttonHtml + "</div>");
        }

        $(function () {
        	schedulerConfig.load();
        });

        Date.prototype.format = function (format) {
        	if (!isValidDate(this)) {
        		return '';
        	}
        	var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        	var week_cn = ['日', '一', '二', '三', '四', '五', '六'];
        	var o = {
        		"M+": this.getMonth() + 1, //月份
        		"d+": this.getDate(), //天
        		"H+": this.getHours(), //小时
        		"m+": this.getMinutes(), //分钟
        		"s+": this.getSeconds(), //秒钟
        		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
        		"S": this.getMilliseconds(), //毫秒数
        		"X": "星期" + week_cn[this.getDay()], //星期
        		"Z": "周" + week_cn[this.getDay()], //返回如 周二
        		"F": week[this.getDay()], //英文星期全称，返回如 Saturday
        		"L": week[this.getDay()].slice(0, 3) //三位英文星期，返回如 Sat
        	}
        	if (/(y+)/.test(format))
        		format = format.replace(RegExp.$1, (this.getFullYear() + "")
        			.substr(4 - RegExp.$1.length));
        	for (var k in o)
        		if (new RegExp("(" + k + ")").test(format))
        			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
        				("00" + o[k]).substr(("" + o[k]).length));
        	return format;
        }


        function isValidDate(d) {
        	if (Object.prototype.toString.call(d) !== "[object Date]")
        		return false;
        	return !isNaN(d.getTime());
        }

        //时间戳格式化
        function dateFormat(dateStr) {
        	var time = new Date(dateStr);
        	var y = time.getFullYear(); //年
        	var m = time.getMonth() + 1; //月
        	var d = time.getDate(); //日
        	var h = time.getHours(); //时
        	var mm = time.getMinutes(); //分
        	var s = time.getSeconds(); //秒
        	if (m < 10) {
        		m = "0" + m;
        	}
        	if (d < 10) {
        		d = "0" + d;
        	}
        	if (h < 10) {
        		h = "0" + h;
        	}
        	if (mm < 10) {
        		mm = "0" + mm;
        	}
        	if (s < 10) {
        		s = "0" + s;
        	}

        	var currentDate = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
        	return currentDate;
        }