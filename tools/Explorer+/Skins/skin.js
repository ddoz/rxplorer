var folder_index = 0;

$(function(){
	print("load succeeded\n");
	
	sys.explorer.handler({
		open_item:function(path, hwnd, oldwnd) {
		}
	});
});

function move_menu(menu_btn, menu_pane) {
    if (menu_btn.popuped)
        return;

    var rc_menu_btn = menu_btn.screen_rect();
    var rc_main_menu = menu_pane.rect();
    var top = rc_menu_btn.top + rc_menu_btn.height - 1;
    menu_pane.move(rc_menu_btn.left, top, rc_main_menu.width, rc_main_menu.height);
}

function move_main_menu() {
    move_menu(menu_file_btn, menu_file);
    move_menu(menu_bookmark_btn, menu_bookmark);
    move_menu(menu_plugin_btn, menu_plugin);
    move_menu(menu_tools_btn, menu_tools);
    move_menu(menu_windows_btn, menu_windows);
    move_menu(menu_help_btn, menu_help);
}

function load_favorite_tools() {
    var file = new jfile;
    var app_path = sys.get_path(sys.app_path);
    if (!file.open(app_path + "\\Skins\\bookmark.json", "r"))
		return;
		
	var data = file.read();
	var bm = eval("(" + data + ")");
	var sys_path = sys.get_path(sys.sys_path);
	for (var i = 0; i < bm.bookmark.length; ++i) {
		var path = bm.bookmark[i].path;

		path = path.replace(/%Sys/gi, sys_path);
		path = path.replace(/%App/gi, app_path);

		var id = sys.hash(path);
		fav_toolbar.insert("<item id='btn" + id + "' icon='" + path + "' />", -1, 0);
	}

    file = null;
}

function show_treeview() {
	if(treeview.visible()) {
		treeview.hide();
		
		var rc_treeview = treeview.rect();
		var rect = xplorer.rect();
		
		print("width: " + xplorer.width);

		rect.left = rc_treeview.left;
		xplorer.move(rect.left, rect.top, 630 + 240 + 3, rect.height);
		//xplorer.move(treeview.x, xplorer.y, xplorer.width + xplorer.left - treeview.left, xplorer.height);
		print("width: " + xplorer.width);
	} else {
		treeview.show();
		
		var rc_treeview = treeview.rect();
		var rect = xplorer.rect();
		
		rect.left = 247;
		xplorer.move(rect.left, rect.top, 630, rect.height);
	}
}

function add_folder() {
	++folder_index;

	// 增加一个视图
	var view_id = "view" + folder_index;
	xplorer.views.insert("<item id='." + view_id + "' />");
	
    var view = eval("xplorer.views." + view_id);
	var hid = sys.explorer.new(view.handler(), "c:\\windows", view.rect());
   	view.attach(hid);

	// 增加一个tab按钮
	 var tab_id = "tab" + folder_index;
	 xplorer.tabs.insert("<item id='." + tab_id + "' tab='" + view_id + "' text='Download' icon='C:\\Windows\\explorer.exe' />");
}