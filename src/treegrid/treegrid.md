一般使用的方式

    <yt-tree-grid
        :items='[
            {
                "id": 101,"displayName": "综合集成与管控系统", "url": "", "icon": "el-icon-date",
                "children": [
                    { "id": 2, "displayName": "首页", "url": "/manage", "index": "manage", "icon": "iconfont icon-all" },
                    { "id": 12,"displayName": "结构监测系统", "url": "", "icon": "el-icon-document", "url": "/integratedControlSystem/structureMonitor" },
                    { "displayName": "数据管理3", "url": "", "icon": "el-icon-document",
                        "children":[
                            { "id": 15,"displayName": "用户登录记录","index": "test", "url": "/loginList" },
                            { "id": 16,"displayName": "用户列表","index": "test", "url": "/userList" }
                        ]
                    }
                ]
            }]'
        :columns='[{title: "菜单名称",key: "displayName",treeField: true,width: 250},{title: "URL",key: "url",width: 250}]'
        ref="treeGrid"></yt-tree-grid>