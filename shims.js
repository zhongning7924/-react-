'use strict'

module.exports = {
    arrayToKeyValue: function (array, key, value) {
        let result = {};
        array.forEach(function(obj){
            result[ obj[key] ] = value ? obj[value] : obj;
        });
        return result;
    },
    keyValueToArray: function (obj, key1, key2) {
        let result = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let item = {};
                item[key1] = key; 
                item[key2] = obj[key];
                result.push(item);
            }
        }
        return result;
    },
    datetimeFormat: function (datetime, formatStr) {
        var obj = null;
        if (({}).toString.call(datetime) === '[object Date]') {
            obj = datetime;
        } else {
            datetime = +datetime || 0;
            datetime = datetime < +new Date() / 100 ? datetime * 1000 : datetime;
            obj = new Date(datetime);
        }
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, obj.getFullYear());
        str = str.replace(/yy|YY/, (obj.getYear() % 100) > 9 ? (obj.getYear() % 100).toString() : '0' + (obj.getYear() % 100));
        var month = obj.getMonth() + 1;
        str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
        str = str.replace(/M/g, month);

        str = str.replace(/w|W/g, Week[obj.getDay()]);

        str = str.replace(/dd|DD/, obj.getDate() > 9 ? obj.getDate().toString() : '0' + obj.getDate());
        str = str.replace(/d|D/g, obj.getDate());

        str = str.replace(/hh|HH/, obj.getHours() > 9 ? obj.getHours().toString() : '0' + obj.getHours());
        str = str.replace(/h|H/g, obj.getHours());
        str = str.replace(/mm/, obj.getMinutes() > 9 ? obj.getMinutes().toString() : '0' + obj.getMinutes());
        str = str.replace(/m/g, obj.getMinutes());

        str = str.replace(/ss|SS/, obj.getSeconds() > 9 ? obj.getSeconds().toString() : '0' + obj.getSeconds());
        str = str.replace(/s|S/g, obj.getSeconds());
        return str;
    }
};