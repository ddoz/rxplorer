var folder_index = 0;
var xplorer_left_pos = 0;
var setting = {};
var editer = [];
var bookmark = [];
var selected_files = [];
var favorite_folders = [];
var curr_tab = null;
var pane1_curr_tab = null
var pane2_curr_tab = null;
var clicked_tab = false;
var poped_menu_tab = null;
var poped_menu_tool = null;
var poped_menu_bkmrk = null;
var poped_menu_xplor_id = null;
var session_open = false;
var session2_open = false;
var maximize = false;
var new_version = "";
var opened = false;

// 1. 左边的不能新标签 √
// 11. 文件夹内双击空白处不能返回上一级 √
// 12. 状态栏高度应该可调整,可变为简洁模式和详细模式. √
// 4. 关闭标签后没有自动选择一个标签 √
// 5. 隐藏文件夹后坐标错误 √
// 2. 过滤器不能用 √
// 27. edit控件的内嵌edit坐标不对 √
// 26. img控件不支持图标 √
// 22. 无多语言 √
// 18. 弹出菜单在点击文件夹时不自动隐藏. √
// 7. 地址栏不能使用 √
// 17. 弹出窗口的高度不能根据项数自动计算. √
// 8. 状态栏信息显示不全 √
// 14. 改变大小后,第二面板的关闭按钮不见了. √
// 19. 无tooltip √
// 15. 点击标签右边的关闭不能关闭标签. √
// 16. 标签过多时,无滚动条或其它方式显示所有标签. √
// 28. 无鼠标手势 √
// 25 过滤器的快速过滤不能用 √
// 3. 驱动器栏要用异步的方式 √
// 13. 常用工具栏多数工具不可用,并且太少. √
// 23. 无undo/redo √
// 6. 第二面板不能隐藏 (基本实现,但跟文件夹隐藏显示一起用时位置会不对,位置不对的也已解决.) √
// 20. 改变窗口宽度时,文件夹窗口大小发生异常,且默认状态下宽度也偏宽. √
// 24 过滤器无滚动条 √
// 29. 视图的查看方试没有 √
// 35. 文件视图无论选择何种显示方式,顶部的列表头都在. √
// 37. 框选文件后,右键菜单不能用. √
// 33. 选择较多文件时,界面响应变慢. √
// 36. 视图的查看方式没有保存,下次再打开时,会变成默认的列表方式. √
// 31. 无注册模块 √
// 32. 无更新模块 √
// 30. 显示过菜单之后,工具栏按钮的图标会发生变化(待改). √
// 32. 显示局域网内其它电脑共享的文件夹时,点击地址栏和下拉菜单均无效(待改).
// 34. 过滤器里的滚动条在移动时,如果鼠标移到了文件视图里,则滚动条不再移动(待改).
// 10. 搜索栏不能用 √
// 39. Tab栏里最后一个Tab宽度改变时,刷新不对. √
// 40. 多选文件时,如果选择的文件很多,程序会卡死.建议选择的文件数超过100,就不把选择的文件信息传到脚本里.√
// 41. edit控件,在输入内容改变后,如果焦点突然变到其它有句柄的窗口,则内容改变不会体现在edit控件里. √
// 43. 地址栏点击一次之后,第二次点击不显示下拉菜单. √
// 44. 按键盘上的字母,找到某个文件后,再按快捷键编辑选中的文件,打开的却不是当前选中的文件. √
// 38. 地地栏里点击下拉菜单进,如果子文件夹较多,下拉菜单里显示不全,此时建议加滚动条. √
// 42. 点击某一未打开文件夹时,如果它打开太慢,在未打开情况下再点击另一文件夹,则会导致显示错乱.()
// 21. 无各类设置窗口.
// 9. 菜单栏不能用

$(function(){
	print("version: " + ver.version + "\n");
	
	sys.search.scan();

	sys.search.handler({
		scan:function(operate, drive) {
			if(drive == 0 || drive == "0")
				searcher.status.text = operate;
			else
				searcher.status.text = operate + " " + String.fromCharCode(drive) + ":";
		},
		reload:function(operate) {
			searcher.status.text = "updating: " + operate;
		},
		search:function(count, completed) {
			if(Number(completed)) {
				searcher.btn.enable(true);
				searcher.status.text = count + " objects";
			} else {
				searcher.status.text = "searching";
			}
		},
	});
	
	sys.updater.handler({
		on_check:function(version, details) {
			if(version == "") {
				print("当前版本已是最新版本\n");
				about.update.text = "当前版本已是最新版本";
			} else {
				print("有新的版本: " + version + "\n");
				new_version = version;
				about.update.text = "有新的版本: " + version;
				sys.updater.download();
			}
		},
		on_download:function(path, readsize, filesize, index, count) {
			var percent = parseInt(100 / count * (index - 1) + readsize / filesize * (100 / 3));
			about.update.text = "有新的版本: " + new_version + ", 正在下载: " + percent + "%";
			print(path + " -> readsize: " + readsize + ", filesize: " + filesize + " " + index + " " + count + "\n");
			if(percent == 100)
				about.update.text = "新版本" + new_version + "已下载完,重启完成更新.";
		},
		on_update:function() {
		},
	});
	
	sys.explorer.handler({
		open:function(path, display_name, view_id) {
			var view = eval(view_id);
			var tab = eval(view.tabobj);

			tab.text = display_name;
			tab.path = path;
			tab.set_icon(path);
			
			if(curr_tab == tab) {
				tab.check(true);
				if(path.substr(0, 2) == "::" || path == "desktop")
					addr.path = display_name;
				else
					addr.path = path;
			}
			
			////curr_tab.text = display_name;
			////curr_tab.check(true);
			////curr_tab.path = path;
			////curr_tab.set_icon(path);
			////if(path.substr(0, 2) == "::" || path == "desktop")
			////	addr.path = display_name;
			////else
			////	addr.path = path;
			
			//print("tab: " + curr_tab + " type: " + typeof(curr_tab) + "\n");
			print("open: " + path + " " + display_name + " " + view_id + "\n");
		},
		active:function(path, display_name, view_id) {
			if(setting.treeview.sync)
				sys.explorer.treeview_sync(path);
			
			if(path.substr(0, 2) == "::" || path == "desktop")
				addr.path = display_name;
			else
				addr.path = path;

			var view = eval(view_id);
			var tab = eval(view.tabobj);
						
			if(clicked_tab) {
				tab.text = display_name;
				tab.path = path;
				clicked_tab = false;
				filefilter.clear();
			} else {
				curr_tab = tab;
			}
			
			curr_tab = tab;

			print("path: " +  path + "\n");
			if(view_id.split(".", 1) == "xplorer") {
				pane1_curr_tab = curr_tab;
			}
			else if(view_id.split(".", 1) == "xplorer2") {
				pane2_curr_tab = curr_tab;
			}
			
			sys.explorer.get_file_types();
			addrbar.addrbar.sysfolder.set_icon(path);

			session_open = true;
			if(!session2_open) {
				session2_open = true;
				load_session("xplorer2", "session2.json");
			} else {
				if(!setting.explorer.dual)
					show_dual_pane(false);
				
				if(!opened) {
					opened = true;
					//var reg = sys.register.is_registered();
					//if(!sys.register.is_registered("debug"))
					//	register.show();
				}
			}
		},
		selected:function(files, count) {
			selected_files = files;
			if(files.length == 0) {
				if(setting.statusbar.show) {
					statusbar.filename.text = curr_tab.text;
				} else {
					detailbar.info.clear();
					detailbar.info.insert({"text": curr_tab.text});
				}
			} else if(files.length == 1) {
				var pth = new jpath(files[0]);
				
				var filesize = "";
				if(pth.filesize() > 0) {
					filesize += lang.get("size") + ": ";
					filesize += format_disk_size(pth.filesize());
				}
				
				if(setting.statusbar.show) { // 显示简单状态栏里的信息
					var fileinfo = pth.display_name();
					fileinfo += "    (" + pth.filetype() + ")";
					fileinfo += "    " + filesize;
					fileinfo += "    " + lang.get("create_time") + ": " + pth.modify_time();
					fileinfo += "    " + lang.get("modify_time") + ": " + pth.create_time();
					statusbar.filename.text = fileinfo;
				} else { // 显示详细状态栏里的信息
					detailbar.info.clear();
					detailbar.info.insert({"text": pth.display_name()});
					detailbar.info.insert({"text": filesize});
					detailbar.info.insert({"text": pth.filetype(), "color": "#5A6779"});
					detailbar.info.insert({"text": " "});
					detailbar.info.insert({"text": lang.get("create_time") + ": " + pth.modify_time()});
					detailbar.info.insert({"text": lang.get("modify_time") + ": " + pth.create_time()});
				}
			} else {
				if(setting.statusbar.show) {
					statusbar.filename.text = "选择了 " + count + " 个文件";
				} else {
					detailbar.info.clear();
					detailbar.info.insert({"text": "选择了 " + count + " 个文件"});
				}
			}
		},
		selected_count:function(count) {
			if(setting.statusbar.show) {
				if(count > 0)
					statusbar.filename.text = "选择了 " + count + " 个文件";
				else
					statusbar.filename.text = "";
			} else {
				detailbar.info.clear();
				if(count > 0)
					detailbar.info.insert({"text": "选择了 " + count + " 个文件"});
			}
		},
		filetypes:function(types) {
			filefilter.clear();
			if(types.length > 0) {
				var filters = sys.explorer.get_filters();				
				filefilter.set_redraw(false);
				for(var i = 0; i < types.length; ++i) {
					var check = filters[types[i]];
					if(types[i] == "#1folder")
						filefilter.insert({"text":"显示文件夹", "icon":"icons.folder", "ext": types[i], "id": ".filterfolder", "check":typeof(check) == "undefined" ? true : check});
					else if(types[i] == "#2hidden")
						filefilter.insert({"text":"显示隐藏文件", "icon":"icons.hiddenfile", "ext": types[i], "id": ".filterhidden", "check":typeof(check) == "undefined" ? true : check});
					else if(types[i] == "#3file")
						filefilter.insert({"text":"显示所有文件", "icon":"icons.allfile", "ext": types[i], "id": ".filterfile", "check":typeof(check) == "undefined" ? true : check});
					else
						filefilter.insert({"text":types[i], "icon":types[i], "ext": types[i], "id": ".filter" + sys.hash(types[i]), "check":check});
				}
				filefilter.set_redraw(true);
				filefilter.redraw();
			}
			
			fastfilter.text = sys.explorer.get_search_filter();
		},
		drives:function(drives) {
			drivebar.clear();
			insert_drives(drives, true);
		},
		dbclk:function() {
			up();
		},
		gesture:function(gesture, view_id) {
			var view = eval(view_id);
			var xplr_id = view_id.split(".", 1);
			var xplr = eval(String(xplr_id));
			if(gesture == "DR") 	 	// 下右 --> 关闭
				close_tab(xplr, curr_tab);
			else if(gesture == "LU") 	// 左上 --> 恢复关闭的标签
				;
			else if(gesture == "DU")	// 下上 --> 复制当前路径到剪贴板
				copy_curr_path();
			else if(gesture == "RD")	// 右下 --> 新建标签
				new_tab_view(get_curr_xplorer());
			else if(gesture == "U") 	// 上 --> 向上
				up();
			else if(gesture == "L") 	// 左 --> 后退
				backward();
			else if(gesture == "R") 	// 右 --> 前进
				forward();
			else if(gesture == "RDR")	// 右下右 --> 下一个标签
				;
			else if(gesture == "LDL")	// 左下左 --> 上一个标签
				;
			else if(gesture == "LDR")	// 左下右 --> 用windows的管理器打开
				open_curr_folder();
			else if(gesture == "UDU")	// 上下下(N) --> 新建文件夹
				new_folder();
				
			print("手势: " + gesture + "\n");
		},
	});

	var drives = sys.explorer.drives();
	
	// 计算drivebar实际所需宽度
	var width = 7 + drives.length * 29 + drives.length + 5;
	
	// 移动工具栏
	var offset = drivebar.width - width;
	drivebar.move(drivebar.x, drivebar.y, drivebar.width - offset, drivebar.height);
	addrbar.move(addrbar.x - offset, addrbar.y, addrbar.width + offset, addrbar.height);
	insert_drives(drives, true);

	sys.explorer.treeview_new("treeview.tree.view", treeview.tree.view.rect());
	
	load_setting();
	
	load_session("xplorer", "session.json");
	
	if(setting.statusbar.show)
		show_statusbar(true);

	if(!setting.treeview.show)
		show_treeview(false);
	
	if(setting.explorer.max)
		explorer.max();
	
	editer = json_from_file("editer.json", []);
	for(var i = 0; i < editer.length; ++i) {
		editer[i].editer = editer[i].editer.replace(/%Sys/gi, sys.path.system);
		editer[i].editer = editer[i].editer.replace(/%App/gi, sys.path.app);
	}
	
	show_editors();
	
	sys.shell_execute(sys.path.app + "/search.exe",  "-app -mutex search_helper_mutex -Module Modules/MSearch.dll", "on_scan_completed");
});

function get_drive_icon(type) {
	if(type == "fixed")
		return "icons.fixed";
		
	if(type == "cdrom")
		return "icons.cdrom";
		
	return "icons.removable";
}

function insert_drives(drives, preload) {
	drivebar.set_redraw(false);
	for(var i = 0; i < drives.length; ++i) {
		var drv = drives[i];
		var percent = drv.total == 0 ? 0 : parseInt((drv.total - drv.free) / drv.total * 10);
		
		var item = {};
		item.id = "drive" + i;
		item.drive = drv.drive;
		item.text = drv.drive;
		item.path = drv.drive + ":\\";
		item.pos = percent;
		item.icon = (preload && drv.total == 0) ? get_drive_icon(drv.type) : (drv.drive + ":\\");
		item.down = (percent >= 9 ? "progress_hover_red.png" : "progress_hover.png");
		item.label = drv.label;
		item.free = drv.free;
		item.total = drv.total;
		drivebar.insert(item);
	}
	drivebar.set_redraw(true);
	drivebar.redraw();
}

function format_disk_size(size) {
	var filesize = "";
	if(size < 1024)
		filesize += size + " " + lang.get("byte");
	else if(size < 1024 * 1024)
		filesize += (size / 1024).toFixed(2) + " KB";
	else if(size < 1024 * 1024 * 1024)
		filesize += (size / 1024 / 1024).toFixed(2) + " MB";
	else
		filesize += (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
	
	return filesize;
}

function on_close() {
	save_session(xplorer, "session.json");
	save_session(xplorer2, "session2.json");

	save2file(setting, "setting.json");
}

function json_from_file(path, def) {
	var file = new jfile;
    if (!file.open(sys.path.app + "\\" + path, "r"))
		return def;

	var data = file.read();
	file.close();
	if(data.length == 0)
		return def;

	return eval("(" + data + ")");
}

function save2file(data, path) {
	var file = new jfile;
    if (!file.open(sys.path.app + "\\" + path, "w"))
		return;

	file.write(data.toJSON());
	file.close();
	file = null;
}

function resize_favorite_folder_panel() {
	if(favorite_folders.length > 0) {
		var rc = favfolders_pane.rect();
		var height = 23 + 1 + 3 + 1 + favorite_folders.length * 23 + favorite_folders.length - 1 + 4;
		favfolders_pane.move(rc.x, rc.y, rc.width, height);
	}
}

function load_favorite_tools() {
	bookmark = json_from_file("bookmark.json", []);
	
	for (var i = 0; i < bookmark.length; ++i) {
		var bkmrk = bookmark[i];
		var path = bkmrk.path;

		path = path.replace(/%Sys/gi, sys.path.system);
		path = path.replace(/%App/gi, sys.path.app);

		var accl = "";
		if(typeof(bkmrk.key) != "undefined" && bkmrk.key.length > 0) {
			if(typeof(bkmrk.vkey) != "undefined" && bkmrk.vkey.length > 0)
				accl = bkmrk.vkey + "+" + bkmrk.key;
			else
				accl = bkmrk.key;
		}
		
		var id = sys.hash(bkmrk.name + path + param);
		var param = (typeof(bkmrk.param) == "undefined") ? "" : bkmrk.param;
		favtools.insert({"id":"btn" + id, "path":path, "icon":path + "|0|24", "param": param, "tooltip": bkmrk.name, "accel": accl});
			
		if(typeof(bkmrk.key) != "undefined" && bkmrk.key.length > 0) {
			path = bkmrk.path.replace(/\\/gi, "\\\\").replace(/"/gi, "\\\"");
			param = bkmrk.param.replace(/\\/gi, "\\\\").replace(/"/gi, "\\\"");
			accel.add(bkmrk.vkey, bkmrk.key, "open_tool(\"" + path + "\", \"" + param + "\")");
		}
	}
}

function load_favorite_folders() {
	favorite_folders = json_from_file("folders.json", []);
	
	for (var i = 0; i < favorite_folders.length; ++i) {
		var path = favorite_folders[i].path;
		var name = favorite_folders[i].name;
		
		path = path.replace(/%Sys/gi, sys.path.system);
		path = path.replace(/%App/gi, sys.path.app);

		var id = sys.hash(path);
		favfolders.insert({"id":"folder" + id, "name":name, "path":path, "icon":path, "action":"open_folder(this.path)"});
	}
	
	resize_favorite_folder_panel();
}

function save_session(xplor, filename) {
	var sess = [];
	var children = xplor.tabs.children;
	for(var i = 0; i < children; ++i) {
		var tab = xplor.tabs.child(i);
		sess.push({"name": tab.text, "path": tab.path, "mode": tab.mode});
	}
	
	save2file(sess, filename);
}

function load_session(xplor_id, filename, sess_open) {
	var sess = json_from_file(filename, []);	
	if(sess.length > 0) {
		new_tab_view(xplor_id, sess[0].path, sess[0].name, sess[0].mode);
		for(var i = 1; i < sess.length; ++i) {
			new_tab(xplor_id, sess[i].path, sess[i].name, sess[i].mode);
		}
	} else {
		new_tab_view(xplor_id);
	}
}

function load_setting() {
	setting = json_from_file("setting.json", {});
	
	if(typeof(setting.treeview) == "undefined") {
		setting.treeview = {};
		setting.treeview.sync = false;
		setting.treeview.show = true;
	}
	
	if(typeof(setting.explorer) == "undefined") {
		setting.explorer = {};
		setting.explorer.max = false;
		setting.explorer.dual = true;
	} else {
		if(typeof(setting.explorer.lang) != "undefined")
			change_language(setting.explorer.lang);
	}
	
	if(typeof(setting.statusbar) == "undefined") {
		setting.statusbar = {};
		setting.statusbar.show = false;
	}
	
	if(setting.treeview.sync)
		sync.check(true);
}

function show_treeview(show) {
	var rc = xplr.rect();
	var width = treeview.width + 2;
	if(show) {
		xplr.move(245, rc.y, rc.width - width, rc.height);
		xplrfrm.move(245, xplrfrm.y, xplrfrm.width - width, xplrfrm.height);
		treeview.show();
		treeview.redraw(true);
		xplr.redraw(true);
		setting.treeview.show = true;
	} else {
		treeview.hide();
		xplr.move(3, rc.y, rc.width + width, rc.height);
		xplrfrm.move(3, xplrfrm.y, xplrfrm.width + width, xplrfrm.height);
		xplr.redraw(true);
		setting.treeview.show = false;
	}

	explorer.redraw(true);
}

function new_tab(xplor_id, path, name, mode) {
	++folder_index;
	
	// 增加一个tab按钮
	var tab_id = "tab" + folder_index;
	var tab_obj = xplor_id + ".tabs." + tab_id;
	var view_id = "explorer.xplr." + xplor_id + ".views.view" + folder_index;
	var view_obj = xplor_id + ".views.view" + folder_index;

	var xplor = eval(xplor_id);
	xplor.tabs.insert({"id":"." + tab_id, "tab":view_id, "view": view_obj, "text":name, "icon":path});
	
	var tab = eval(tab_obj);
	tab.path = path;
	tab.mode = mode;
	tab.obj = tab_obj;
	tab.index = folder_index;
	tab.uninit = true;
}

function new_tab_view(xplor_id, path, name, mode) {
	++folder_index;

	print("new tab view: " + xplor_id + " " + path + "\n");
	
	if(typeof(path) == "undefined")
		path = "Computer";
	
	var xplor = eval(xplor_id);
	
	var view_id = "view" + folder_index;
	var view_obj = xplor_id + ".views." + view_id;
	
	var tab_id = "tab" + folder_index;
	var tab_obj = xplor_id + ".tabs." + tab_id;
	
	// 增加一个视图
	xplor.views.insert({"id":"." + view_id, "tabobj": tab_obj});
    var view = eval(view_obj);
	view.tabobj = tab_obj;

	// 增加一个tab按钮
	xplor.tabs.insert({"id":"." + tab_id, "tab":view.id, "view": view_obj, "text":name, "icon":path});	
	curr_tab = eval(tab_obj);
	curr_tab.path = path;
	curr_tab.mode = mode;
	curr_tab.obj = tab_obj;
	curr_tab.index = folder_index;
	curr_tab.click();
	
	var hid = sys.explorer.new(view.handler(), path, view.rect(), view_obj, mode);
}

function open_folder(path) {
	addr.path = path;
	sys.explorer.open(0, path);
}

function click_tab(xplor_id, tab) {
	curr_tab = tab;
	print(tab.id + "\n");

	if(tab.uninit) {
		tab.uninit = false;
		
		var xplor = eval(xplor_id);
		
		// 增加一个视图
		var view_id = "view" + tab.index;
		var view_obj = xplor_id + ".views." + view_id;
		xplor.views.insert({"id":"." + view_id});
		var view = eval(view_obj);
		view.tabobj = tab.obj;
		var hid = sys.explorer.new(view.handler(), tab.path, view.rect(), view_obj);
	} else {
		clicked_tab = true;
	}
}

function close_tab(xplor, tab) {
	if(xplor.tabs.children == 0)
		return;
	
	var index = xplor.tabs.get_index(tab.id);
	sys.explorer.remove(tab.view);
	xplor.tabs.remove(tab.id);
	xplor.views.remove(tab.tab);
	if(xplor.tabs.children == 0)
		return;

	if(--index <= 0)
		index = 0;
		
	var btn = xplor.tabs.child(index);
	btn.click();
}

function up() {
	sys.explorer.up();
}

function pop_tab_menu(xplor_id, tab, id) {
	print(tab + " " + id + " " + tab.tab + " " + tab.view + "\n");
	poped_menu_tab = tab;
	poped_menu_xplor_id = xplor_id;
	window.popmenu(tabmenu_pane.id);
}

function duplicate_tab(xplor_id) {
	new_tab_view(xplor_id, poped_menu_tab.path);
}

function add_favorite_folder(path) {
	for(var i = 0; i < favorite_folders.length; ++i) {
		if(path == favorite_folders[i].path)
			return;
	}
	
	var jpth = new jpath();
	jpth.open(path);
	var name = jpth.filename();
	if(name.length == 0)
		name = jpth.root_path();
	
	if(name.length == 0)
		return;

	var item = {};
	item.name = name;
	item.path = path;
	favorite_folders.push(item);

	item = {};
	item.name = name;
	item.path = path;
	var id = sys.hash(path);
	item.id = "folder" + id;
	item.icon = path;
	item.action = "open_folder(this.path)";
	favfolders.insert(item);
	
	save2file(favorite_folders, "folders.json");
	
	resize_favorite_folder_panel();
}

function remove_favorite_folder(path, folder_id) {
	for(var i = 0; i < favorite_folders.length; ++i) {
		if(path == favorite_folders[i].path) {
			favorite_folders.splice(i, 1);
			save2file(favorite_folders, "folders.json");
			resize_favorite_folder_panel();
			
			var ids = folder_id.split(".");
			ids.splice(ids.length - 1, 1);
			folder_id = ids.join(".");
			favfolders.remove(folder_id);
			break;
		}
	}
}

function pop_tool_menu(tool) {
	poped_menu_tool = tool;
	window.popmenu(toolmenu_pane.id);
}

function remove_favorite_tool(tool) {
	for(var i = 0; i < bookmark.length; ++i) {
		if(bookmark[i].path == tool.path) {
			bookmark.splice(i, 1);
			save2file(bookmark, "bookmark.json");
			break;
		}
   } 

   favtools.remove(tool.id);
}

function add_favorite_tools(files) {
	if(files.length == 0)
		return;
		
	for(var i = 0; i < files.length; ++i) {
		var path = files[i];
		var jpth = new jpath();
		jpth.open(path);
		var name = jpth.filename();
		var id = sys.hash(path);
		favtools.insert({"id":"btn" + id, "path":path, "icon":path + "|0|24"});
		
		var item = {};
		item.name = name;
		item.path = path;
		bookmark.push(item);
	}
	
	save2file(bookmark, "bookmark.json");
}

function on_dropfiles(files) {
	if(files.length == 0)
		return;
		
	var rc = favtools.screen_rect();
	var pt = sys.cursor_pos();
	if(rc.pt_in_rect(pt.x, pt.y)) {
		add_favorite_tools(files);
	}
}

function sync_treeview() {
	setting.treeview.sync = !setting.treeview.sync;
	if(setting.treeview.sync) {
		sys.explorer.treeview_sync(curr_tab.path);
	}
}

function locate_tool(path) {
	var pth = new jpath(path);
	sys.shell_execute(pth.remove_filename());
}

function open_tool(path, param) {
	if(param.length > 0) {
		if(selected_files.length > 0) {
			var file = param;
			param = "";
			for(var i = 0; i < selected_files.length; ++i) {
				var fl = file;
				var jpth = new jpath(selected_files[i]);
				fl = fl.replace(/%FullPath/gi, selected_files[i]);
				fl = fl.replace(/%Path/gi, jpth.remove_filename());
				
				param = param + fl + " ";
			}
		} else {
			param = param.replace(/%Path/gi, addr.path).replace(/%FullPath/gi, "");
		}
	}
	
	param = param.replace(/'/gi, "\"");
	if(param == "\"\"")
		param = "";	
	
	print(path + " " + param + "\n");
	
	sys.shell_execute(path, param);
}

function tool_setting(tool) {
	toolsetting.tooltip.text = tool.tooltip;
	toolsetting.accel.text = tool.accel;
	toolsetting.cmd.text = tool.path;
	toolsetting.param.text = tool.param;
	
	poped_menu_bkmrk = null;
	for (var i = 0; i < bookmark.length; ++i) {
		var bkmrk = bookmark[i];

		var path = bkmrk.path;
		path = path.replace(/%Sys/gi, sys.path.system);
		path = path.replace(/%App/gi, sys.path.app);

		if(path == tool.path) {
			if(typeof(bkmrk.param) == "undefined")
				poped_menu_bkmrk = bkmrk;
			else if(bkmrk.param == tool.param)
				poped_menu_bkmrk = bkmrk;
			else
				continue;
			
			break;
		}
	}
	
	toolsetting.show();
}

function set_tool_info() {
	if(poped_menu_bkmrk == null || poped_menu_tool == null)
		return;
	
	poped_menu_tool.tooltip = toolsetting.tooltip.text;
	poped_menu_tool.accel = toolsetting.accel.text;
	poped_menu_tool.path = toolsetting.cmd.text;
	poped_menu_tool.param = toolsetting.param.text;
	
	poped_menu_bkmrk.name = toolsetting.tooltip.text;
	poped_menu_bkmrk.path = toolsetting.cmd.text;
	poped_menu_bkmrk.param = toolsetting.param.text;
	
	save2file(bookmark, "bookmark.json");
}

function copy_file() {
	if(selected_files.length == 0 || pane1_curr_tab == null || pane2_curr_tab == null)
		return;
	
	if(!pane1_curr_tab.visible() || !pane2_curr_tab.visible())
		return;
	
	if(pane1_curr_tab == curr_tab) {
		print("select files: " + selected_files[0] + " other: " + pane2_curr_tab.path + "\n");
		sys.explorer.copyfile(selected_files, pane2_curr_tab.path);
	} else if(pane2_curr_tab == curr_tab) {
		print("select files: " + selected_files[0] + " other: " + pane1_curr_tab.path + "\n");
		sys.explorer.copyfile(selected_files, pane1_curr_tab.path);
	}
}

function move_file() {
	if(selected_files.length == 0 || pane1_curr_tab == null || pane2_curr_tab == null)
		return;
	
	if(!pane1_curr_tab.visible() || !pane2_curr_tab.visible())
		return;
	
	if(pane1_curr_tab == curr_tab) {
		print("select files: " + selected_files[0] + " other: " + pane2_curr_tab.path + "\n");
		sys.explorer.movefile(selected_files, pane2_curr_tab.path);
	} else if(pane2_curr_tab == curr_tab) {
		print("select files: " + selected_files[0] + " other: " + pane1_curr_tab.path + "\n");
		sys.explorer.movefile(selected_files, pane1_curr_tab.path);
	}
}

function new_folder() {
	sys.explorer.newfolder("");
}

function on_accel(accel) {
	print(accel + "\n");
}

function find_editer(ext) {
	print("ext " + ext + "\n");
	for(var i = 0; i < editer.length; ++i) {
		if(editer[i].ext.toLowerCase() == ext)
			return editer[i].editer;
	}
	
	return editer.length == 0 ? null : editer[0].editer;
}

function edit_file() {
	for(var i = 0; i < selected_files.length; ++i) {
		var path = new jpath(selected_files[i]);
		var edtr = find_editer(path.ext().toLowerCase());
		if(edtr == null)
			continue;
		
		sys.shell_execute(edtr, "\"" + selected_files[i] + "\"");
	}
}

function open_curr_folder() {
	if(curr_tab == null)
		return;
	
	sys.shell_execute(curr_tab.path);
}

function filter_files() {
	var children = filefilter.children;
	if(children == 0)
		return;
	
	var filters = {};
	for(var i = 0; i < children; ++i) {
		var flt = filefilter.child(i);
		filters[flt.ext] = flt.checked;
	}
	
	sys.explorer.set_filters(filters);
}

function clear_filters() {
	sys.explorer.set_filters();
	sys.explorer.set_search_filter("");
	fastfilter.text = "";
	sys.explorer.get_file_types();
}

function show_statusbar(show, init) {
	setting.statusbar.show = show;
	var height = detailbar.height - statusbar.height;
	if(show) {
		detailbar.hide();
		statusbar.show();
		statusbar.redraw();
		
		var rc = treeview.rect();
		treeview.move(rc.x, rc.y, rc.width, rc.height + height);
		treeview.redraw(true);
		
		rc = xplr.rect();
		xplr.move(rc.x, rc.y, rc.width, rc.height + height);
		xplr.redraw(true);
	} else {
		statusbar.hide();
		detailbar.show();
		detailbar.redraw();
		
		var rc = treeview.rect();
		treeview.move(rc.x, rc.y, rc.width, rc.height - height);
		treeview.redraw(true);
		
		rc = xplr.rect();
		xplr.move(rc.x, rc.y, rc.width, rc.height - height);
		xplr.redraw(true);
	}
}

function get_curr_xplorer() {
	if(typeof(curr_tab) == "undefined" || curr_tab == null)
		return "xplorer";
	
	if(pane2_curr_tab == curr_tab)
		return "xplorer2";
	
	return "xplorer";
}

function copy_curr_path() {
	sys.clipboard(addr.path);
}

function copy_file_path() {
	if(selected_files.length > 0)
		sys.clipboard(selected_files[0]);
}

function show_tooltip(ctrl, info, accl) {
	var text = info;
	if(typeof(accl) != "undefined" && accl.length > 0)
		text += "    " + accl;
	
	var rc = ctrl.screen_rect();
	var size = tooltip.tip.get_text_size(text);
	var width = size.width + 8;
	tooltip.move(rc.x, rc.y + rc.height + 1, size.width + 6, tooltip.height);
	
	tooltip.tip.text = text;
	tooltip.show();
}

function show_drive_tooltip(drive) {
	var text = "";
	if(drive.label.length > 0)
		text = drive.label + " (" + drive.drive + ":)";
	else
		text = drive.drive + ":";
	
	var rc = drive.screen_rect();
	var size = drivetip.tip.get_text_size(text);
	drivetip.move(rc.x, rc.y + rc.height + 1, drivetip.width, drivetip.height);

	var free = Number(drive.free) * 1024 * 1024;
	var total = Number(drive.total) * 1024 * 1024;
	drivetip.tip.text = text;
	drivetip.spaceinfo.text = format_disk_size(free) + " 可用, 共" + format_disk_size(total);
	drivetip.icon.set_icon(drive.path + "|0|48");
	
	var percent = (total - free) / total * 100;
	if(percent > 90)
		drivetip.space.state = 1;
	else
		drivetip.space.state = 0;
	
	if(total == 0)
		drivetip.space.pos = 0;
	else
		drivetip.space.pos = percent;
	
	drivetip.show();
}

function show_folder_list(xplor, xplor_id) {
	var children = xplor.tabs.children;
	if(children == 0) {
		return;
	}
	
	folderlist.clear();
	for(var i = 0; i < children; ++i) {
		var tab = xplor.tabs.child(i);
		folderlist.insert({"name": tab.text, "icon": tab.path, "action": xplor_id + ".tabs.active('" + tab.id+ "')"});
	}
	
	var height = children * 23 + children - 1 + 4;
	folderlist_pane.move(folderlist_pane.x, folderlist_pane.y, folderlist_pane.width, height);
	folderlist_pane.redraw();
}

function show_dual_pane(show) {
	if(show) {
		var rc = xplorer2.rect();
		var width = (xplrfrm.width - 2) / 2;
		xplorer.move(xplorer.x, xplorer.y, width, xplorer.height);
		xplorer2.move(xplorer.x + width + 2, xplorer.y, width, xplorer.height);
		xplorer2.show();
		xplr.redraw();
		setting.explorer.dual = true;
		detailbar.tools.show();
		statusbar.tools.show();
	} else {
		xplorer2.hide();
		var rc = xplorer2.rect();
		xplorer.move(xplorer.x, xplorer.y, xplrfrm.width, xplorer.height);
		xplorer.redraw();
		setting.explorer.dual = false;
		detailbar.tools.hide();
		statusbar.tools.hide();
	}
}

function load_historys() {
	historys.clear();
	
	var curr = sys.explorer.curr_history();
	var hstrs = sys.explorer.historys();
	for(var i = hstrs.length - 1; i >= 0; --i) {
		var hstr = hstrs[i];
		var jpth = new jpath(hstr);
		historys.insert({"name": jpth.display_name(), "icon": hstr , "check": curr == i});
	}
	
	var height = hstrs.length * 23 + hstrs.length - 1 + 4;
	historys_pane.move(historys_pane.x, historys_pane.y, historys_pane.width, height);
}

function forward() {
	sys.explorer.forward();
}

function backward() {
	sys.explorer.backward();
}

function draw_gesture(cnvs, size, gesture) {
	var color = "#000000";
	if(gesture == "U") {
		cnvs.draw_line({"x":8, "y":13}, {"x":8, "y":2}, 2, color);
		cnvs.draw_line({"x":4, "y":6}, {"x":11, "y":6}, 1, color);
		cnvs.draw_line({"x":4, "y":7}, {"x":8, "y":3}, 2, color);
		cnvs.draw_line({"x":11, "y":7}, {"x":7, "y":3}, 2, color);
	}
}

function resize_panel(pnl, item_count, item_height, margin) {
	var height = 2 + item_height * item_count + margin * (item_count - 1) + 2;
	pnl.move(pnl.x, pnl.y, pnl.width, height);
}

function check_for_update() {
	new_version = "";
	sys.updater.check(sys.path.app + '/Skins/Explorer/skin.xml');
	about.show()
}

function on_check_for_update(version, detail) {
}

function set_view_mode() {
	var modes = [7, 6, 1, 3, 4];
	if(sys.os.version >= 6.0)
		modes = [18, 17, 1, 2, 3, 4, 6];
		
	var mode = sys.explorer.view_mode();
	print(mode);
	
	var index = modes.length - 1;
	for(var i in modes) {
		if(modes[i] == mode) {
			index = Number(i);
			break;
		}
	}
	
	set_curr_view_mode(modes[(index + 1) % modes.length]);
}

function set_curr_view_mode(mode) {
	curr_tab.mode = mode;
	sys.explorer.view_mode(mode);
}

function show_search_wnd(text, path) {
	if(searcher.list.files.handler() == 0)
		searcher.list.files.attach(sys.search.create_result_wnd(searcher.handler(), searcher.list.files.rect()));
	
	searcher.show();
	if(text != null && text != "" && searchtxt.value.text != path + "\\" + text) {
		search();
		searchtxt.value.text = path + "\\" + text;
	}
}

function search() {
	var text = searchtxt.value.text;
	if(text == null || text.length <= 0)
		return;
	
	searcher.btn.enable(false);
	sys.search.search(text);
}

function on_scan_completed(exit_code) {
	if(exit_code == 1)
		sys.search.reload();
}

function on_register() {
	if(register.mail.text == "") {
		register.alert("Email can not be null", "Error");
		return;
	}
	
	if(register.code.text == "") {
		register.alert("Licnese code can not be null", "Error");
		return;
	}
}

function change_language(language) {
	var langg = eval(language);
	lang.change(langg.id);
	
	setting.explorer.lang = language;
}

function show_editors() {
	edit_view_options.editor.list.clear();
	for(var i = 0; i < editer.length; ++i) {
		edit_view_options.editor.list.insert({"ext": "." + editer[i].ext, "desc": "", "editor": editer[i].editer});
	}
}