'use strict'

const base = '../index.php?r=';

const urls = {
    // 用户相关
    Login: 'user/login',
    Logout: 'user/logout',
    ChangePassword: 'user/ChangePassword',
    // 权限
    getUserSystem: 'rbac/rbac/rolesystem',
    getUserSystemPage: 'rbac/page/RoleSystemPage',

    // resource 资源上传模块
    getResourceList: 'resource/resource/list',
    resourceUpload: 'resource/resource/Upload',
};

for(let key in urls) {
    if (urls.hasOwnProperty(key)){
        urls[key] = base + urls[key];
    }
}

// 跳转至admin后台首页
urls.ToIndex = '../';

export default urls;
