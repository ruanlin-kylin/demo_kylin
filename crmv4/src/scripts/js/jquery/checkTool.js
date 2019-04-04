var idcarObj={
    Wi:[ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ],// 加权因子
    ValideCode:[ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],// 身份证验证位值.10代表X
    util:{
        /**
         * 从身份证中提取年月月日校验
         * @param idcar
         * @returns {boolean}
         */
        isValidityBrithBy18IdCard:function(idcar){
            var me = this;
            var year = this.getYear(idcar);
            var month = this.getMonth(idcar);
            var day = this.getDay(idcar);
            var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题
            if(temp_date.getFullYear()!=parseFloat(year)
                ||temp_date.getMonth()!=parseFloat(month)-1
                ||temp_date.getDate()!=parseFloat(day)){
                return false;
            }else{
                return true;
            }
        },
        /**
         *  判断身份证号码为18位时最后的验证位是否正确
         * @param idcarArray
         * @returns {boolean}
         */
        isTrueValidateCodeBy18IdCard:function(idcarArray) {
            var me=this;
            var sum = 0; // 声明加权求和变量
            if(idcarArray && idcarArray.length==18){
                if (idcarArray[17].toLowerCase() == 'x') {
                    idcarArray[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
                }
                for ( var i = 0; i < 17; i++) {
                    sum += idcarObj.Wi[i] * idcarArray[i];// 加权求和
                }
                valCodePosition = sum % 11;// 得到验证码所位置
                if (idcarArray[17] == idcarObj.ValideCode[valCodePosition]) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        },
        getYear:function(idcar){
            return idcar.substring(6,10);
        },getMonth:function(idcar){
            return idcar.substring(10,12);
        },getDay:function(idcar){
            return idcar.substring(12,14);
        },getSex:function(idcar){
            var last = idcar[idcar.length-2];
            if(last%2!=0){
                return "男";
            }else{
                return "女";
            }
        },getAge:function(idcar){
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() -this.getYear(idcar);
            if(age>0){
                if (this.getMonth(idcar) < month || (this.getMonth(idcar) == month && this.getDay(idcar) <= day)) {
                    age++;
                }
            }
            return age;
        },getAgeMonth:function(idcar){
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = month-this.getMonth(idcar);
            if(age>0){
                if(day>=this.getMonth(idcar)){
                    age++;
                }
            }
            return age;
        },getAgeDay:function(idcar){
            var myDate = new Date();
            var day = myDate.getDate();
            return day-this.getMonth(idcar);
        }
    }
};

check={
    tool:{
        /**
         * 校验手机号码
         * @param phone
         * @returns {boolean}
         */
        valiPhone:function(phone){
            if(phone.length == 0)
                return false;
            var myreg = /^(((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8})$/;
            if (!myreg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        valiTel:function(phone){
            if(phone.length == 0)
                return false;
            var myreg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            if (!myreg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        /**
         * 校验身份证
         * @param idcar
         * @returns {boolean}
         */
        valiIdCar:function(idcar){
            idcar = idcar.replace(/ /g, "");
            if (idcar.length == 18) {
                var a_idCard = idcar.split("");// 得到身份证数组
                if(idcarObj.util.isValidityBrithBy18IdCard(idcar) && idcarObj.util.isTrueValidateCodeBy18IdCard(a_idCard)){
                    return true;
                }else {
                    return false;
                }
            } else {
                return false;
            }
        },
        valiAge:function(age){
            if(age){
                if($.trim(age)){
                    age= $.trim(age);
                    if(/^[0-9]+$/.test(age) && (age*1)<=120){
                        return true;
                    }
                }
            }
            return false;
        },validateNumber:function(number){
            if(number){
                if($.trim(number)){
                    number=$.trim(number);
                    if(/^[0-9]+$/.test(age)){
                        return true;
                    }
                }
            }
            return false;
        },validateMoney:function(money){
            if(money && $.trim(money)){
                money= $.trim(money);
                if(/^[0-9]+\.?[0-9]+?$/.test(money)){
                    return true;
                }
            }
            return false;
        }
    }
};


