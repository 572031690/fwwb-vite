<template>
    <div id="Login" ref="loginview">
        <div class="stars-spot-anima" ref="stars">
            <div class="star-spot-anima" v-for="(item, key) in startList" :key="key" :ref="el => (star[key] = el)" :data-set="'data' + key"></div>
        </div>
        <div id="Login-body" ref="appref">
            <div class="top-backhome">
                <img src="../assets/img/titleImportant.png" style="vertical-align: middle; height: 50px" />
                <span>智能制造协同共享平台</span>
            </div>
            <div class="login-top">
                <img src="../assets/img/center-login.png" class="filImg" />
                <div class="login-center">
                    <transition name="centerboxout">
                        <div class="centerbox" v-show="centerbox">
                            <div class="center-heart">
                                <div class="imgtop">
                                    <img src="../assets/img/login-top.png" />
                                </div>
                                <div class="logintext">登陆</div>
                                <form>
                                    <div class="inputbox">
                                        <span class="userimg"></span>
                                        <input
                                            @keyup.enter="login()"
                                            type="text" 
                                            class="name"
                                            placeholder="username"
                                            ref="logintext"
                                            v-model="logindata.uname"
                                        />
                                        <div class="logintip">
                                            {{ tipsList.tips1 }}
                                        </div>
                                    </div>
                                    <div class="inputbox">
                                        <span class="passimg"></span>
                                        <input
                                            @keyup.enter="login()"
                                            type="password"
                                            class="password"
                                            ref="passeyes"
                                            placeholder="password"
                                            v-model="logindata.pass"
                                        />
                                        <img :src="studyDataPic" class="passeyes" @click="eyeschange()" />
                                        <div class="logintip">
                                            {{ tipsList.tips2 }}
                                        </div>
                                    </div>
                                    <div class="regiserbox">
                                        <span>验证码：</span>
                                        <input type="text" class="regisertext" v-model="logindata.inputVal" @keyup.enter="login()" />
                                        <!-- 验证码组件 -->
                                        <v-validateCode ref="ref_validateCode" @change="changeCode" class="regiserimg"></v-validateCode>
                                    </div>
                                    <div class="logintip">
                                        {{ tipsList.result }}
                                    </div>
                                    <div class="loginbutton">
                                        <button type="button" id="login" @click="login()">登陆</button>
                                        <!-- <button
                                            type="button"
                                            id="regiser"
                                            @click="seeData"
                                            v-if="false"
                                        >
                                            注册
                                        </button> -->
                                    </div>
                                </form>
                            </div>
                        </div>
                    </transition>
                    <!-- 注册表单 -->
                    <!-- <register ref="registertable"></register> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// 调用验证码
import ValidateCode from '../components/login/ValidateCode.vue'
// import register from '../components/login/Register.vue' // 注册页面
import { onMounted, ref, toRefs, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import eye from '../assets/img/eye.png'
import closeeye from '../assets/img/closeeye.png'
import { LoginTs } from '../assets/data/type'
import { ElMessage } from 'element-plus'
import $Api from '../service/api'
import { ElNotification } from 'element-plus'
export default {
    name: 'Login',
    isRouter: true, // 自定义属性用于路由匹配
    components: {
        'v-validateCode': ValidateCode,
        // register
    },
    setup() {
        // enum Days {Sun=3, Mon, Tue, Wed, Thu, Fri, Sat=<any>'SS'};
        // // console.log(Days[3],'sss');
        // function createArray<T>(length: number, value: T): Array<T> {
        //     let result = [];
        //     for (let i = 0; i < length; i++) {
        //         result[i] = value;
        //     }
        //     return result;
        // }
        // // console.log(createArray(3, 'x')); // ['x', 'x', 'x']
        // function swap<T, U>(tuple: [T, U]): [U, T] {
        //     return [tuple[1], tuple[0]];
        // }
        
        // // console.log(swap([7, 'seven']));// ['seven', 7]
        // interface ArrNum {
        //     length: number
        // }
        // const getArray = <T extends ArrNum>(arg: T):T => {
        //     console.log(arg.length);
        //     return arg
        // }
        // console.log(getArray([8]))

        document.body.removeAttribute('style')
        const data: LoginTs = reactive({
            centerbox: false,
            checkCode: '',
            eyesflag: false,
            startList: [...new Array(800).keys()],
            tipsList: reactive({ tips1: '', result: '', tips2: '' }),
            logindata: reactive({ uname: '', pass: '', inputVal: '' }),
            star: reactive([]),
        })
        const reactData = toRefs(data)
        let router = useRouter()
        const star: any[] = reactive([])
        const ref_validateCode = ref()
        const passeyes = ref()
        let studyDataPic = ref(closeeye)
        onMounted(() => {
            setTimeout(() => {
                data.centerbox = true
            }, 100)
            getStar()
        })
        onBeforeUnmount(() => {
            let bodyHtml = <HTMLBodyElement | null>document.querySelector('body')
            if (bodyHtml) bodyHtml.setAttribute('style', 'background:#f4f4f4;')
        })
        const getStar = () => {
            data.startList.forEach((item: any, key: number) => {
                var s = 0.2 + Math.random() * 1
                var curR = 800 + Math.random() * 300
                if (star[key]) {
                    star[key].style.transformOrigin = '0 0 ' + curR + 'px'
                    star[key].style.transform =
                        ' translate3d(0,0,-' +
                        curR +
                        'px) rotateY(' +
                        Math.random() * 360 +
                        'deg) rotateX(' +
                        Math.random() * -50 +
                        'deg) scale(' +
                        s +
                        ',' +
                        s +
                        ')'
                }
            })
        }
        /**
         * @desc 缓存数据到浏览器内
         */
        const getCache = (user:{realname:string,roleId:string,userid:string}, sessionId:string, permission:any, permissionName:any) => {
            window.sessionStorage.setItem('storeData', user.realname) // 将数据存储到浏览器内嵌的数据库内
            window.sessionStorage.setItem('sessionId', sessionId) // 将数据存储到浏览器内嵌的数据库内
            window.sessionStorage.setItem('userData', JSON.stringify(user)) // 将数据存储到浏览器内嵌的数据库内
            window.sessionStorage.setItem('sData', user.roleId) // 将数据存储到浏览器内嵌的数据库内
            window.sessionStorage.setItem('userid', user.userid) // 用户ID
            permissionName.push(0)
            window.sessionStorage.setItem('permissionName', JSON.stringify(permissionName)) // 权限Name
            window.sessionStorage.setItem('permission', JSON.stringify(permission)) // 权限Id
        }
        const login = () => {
            if (!data.logindata.uname) {
                data.tipsList.tips1 = '账号不能为空'
            } else if (!data.logindata.pass) {
                data.tipsList.tips2 = '密码不能为空'
                data.tipsList.tips1 = ''
            } else if (data.logindata.pass.length < 5) {
                data.tipsList.tips2 = '密码长度不能少于5位'
                data.tipsList.tips1 = ''
                // 验证验证码是否正确，如果正确就往下一个界面跳
            } else if (data.logindata.inputVal.toUpperCase() === data.checkCode) {
                data.tipsList.tips2 = ''
                data.tipsList.tips1 = ''
                data.logindata.inputVal = ''
                router.push({
                            path: '/home/homewel',
                            query: { routerIndex: 1 },
                        })
                // goLogin()
                
            } else {
                data.tipsList.result = '验证码输入错误'
                // 验证码input内的值
                data.logindata.inputVal = ''
                data.tipsList.tips2 = ''
                data.tipsList.tips1 = ''
                ref_validateCode.value.draw()
            }
        }
        /**
         * @desc 登陆
         */
        const goLogin = async () => {
            const url = 'login/login'
            const params = {
                username: data.logindata.uname,
                password: data.logindata.pass,
            }
            await $Api(url,params)
                .then((res:any) => {
                    const { code, user, sessionId, permission, permissionName } = res
                    if (parseInt(code) === 101) {
                        getCache(user, sessionId, permission, permissionName)
                        data.logindata.uname = ''
                        data.logindata.pass = ''
                        router.push({
                            path: '/home/homewel',
                            query: { routerIndex: 1 },
                        })
                        ElNotification({
                            // element登陆成功提示框右上边
                            title: '登陆成功',
                            message: '欢迎管理员！',
                            type: 'success'
                        })
                    } else if (parseInt(code) === 102) {
                        ElMessage.error('账号或密码错误') // element失败提示框上部
                        data.tipsList.tips2 = '账号或密码错误'
                        // 验证码提示框
                        data.tipsList.result = ''
                    } else {
                        ElMessage.error(res.error)
                    }
                })
                .catch(() => {})
        }
        const changeCode = (value: number) => {
            data.checkCode = value
        }
        const eyeschange = () => {
            data.eyesflag = !data.eyesflag
            if (data.eyesflag) {
                studyDataPic.value = eye
                passeyes.value.type = 'text'
            } else {
                studyDataPic.value = closeeye
                passeyes.value.type = 'password'
            }
        }

        return {
            ...reactData,
            studyDataPic,
            passeyes,
            eyeschange,
            ref_validateCode,
            changeCode,
            login,
            star,
            getStar,
        }
    },
}
</script>
<style>
body {
    background: radial-gradient(220% 105% at top center, #000 10%, #000035 40%, #0b2570 65%, #0070aa);
    background-attachment: fixed;
    overflow: hidden;
}
@keyframes rotatestar {
    0% {
        transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
    }

    100% {
        transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
    }
}

.stars-spot-anima {
    transform: perspective(500px);
    transform-style: preserve-3d;
    position: absolute;
    bottom: 0;
    perspective-origin: 50% 100%;
    left: 50%;
    animation: rotatestar 90s infinite linear;
}

.star-spot-anima {
    width: 2px;
    height: 2px;
    background: #f7f7b6;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0 -300px;
    transform: translate3d(0, 0, -300px);
    backface-visibility: hidden; /* 旋转元素背面不可见*/
    animation: none;
    opacity: 1;
}
</style>
<style lang="less" scoped>
/*无法选中图片文字方法*/
span,
div,
img {
    user-select: none;
}
#Login {
    height: 100%;
    #Login-body {
        height: 100%;
    }
}
.topline {
    height: 0.1px;
    width: 100%;
    border-top: 0.5px solid #eee;
}
.top-backhome {
    font-size: 30px;
    line-height: 30px;
    padding: 20px 0 0 15px;
    span {
        margin-left: 15px;
        color: white;
        text-decoration: none;
        transition: all 0.2s;
        &:hover {
            color: #409eff;
        }
    }
}
.login-top {
    position: relative;
    display: flex;
    align-content: space-between;
    justify-content: center;
    margin-top: 180px;
    height: 380px;
    background: rgba(64, 158, 255, 0.5);
    .filImg {
        width: 100%;
        height: 100%;
    }
}
.login-center {
    border-radius: 5px;
    position: absolute;
    bottom: 20px;
    height: 390px;
    width: 390px;
    border: none;
    background: #409eff;
    box-shadow: 0 0 12px #f3f3f3;
    /*阴影 */
}
/* .centerboxout-enter-active {
  transition: all 0.8s;
}
.centerboxout-enter {
  opacity: 0;
} */
.centerbox {
    margin-top: 10px;
    background-color: white;
    height: 380px;
    border-radius: 5px;
    border: none;
}
.center-heart {
    margin-left: 25px;
    margin-top: 25px;
    /* background: yellow; */
    height: 360px;
    width: 340px;
    display: flex;
    /* align-content: space-between; */
    /* justify-content: space-between; */
    flex-direction: column;
    /* display: table-cell;
text-align: center; */
}
.imtop {
    display: flex;
    align-content: space-between;
    justify-content: space-between;
    margin-top: 5px;
}
.imgtop {
    img {
        margin-left: 120px;
    }
}
.logintip {
    align-items: center;
    height: 15px;
    font-size: 14px;
    line-height: 14px;
    color: red;
}
.logintext {
    margin: 5px 0;
    font-size: 26px;
    color: #409eff;
    text-align: center;
}
input {
    &::-webkit-input-placeholder {
        color: #ecedee;
    }
}
.inputbox {
    position: relative;
}
.name {
    /* background-image: url(../assets/img/登陆.png); 设置小图标 */
    /* background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: 5px 6px; */
    box-sizing: content-box;
    height: 38px;
    border: 2px solid #ddd;
    padding: 0 15px 0 42px;
    width: 281px;
    font-size: 22px;
    border-radius: 5px;
    margin: 15px 0 0 0;
    outline: none;
}
.password {
    box-sizing: content-box;
    height: 38px;
    border: 2px solid #ddd;
    padding: 0 41px 0 42px;
    width: 255px;
    font-size: 22px;
    border-radius: 5px;
    outline: none;
}
.userimg {
    &::after {
        content: '';
        background: url(../assets/img/登陆.png);
        background-size: 30px 30px;
        background-repeat: no-repeat;
        top: 23px;
        left: 5px;
        height: 38px;
        width: 38px;
        position: absolute;
    }
}
.passimg {
    &::after {
        content: '';
        background: url(../assets/img/密码.png);
        background-size: 32px 32px;
        background-repeat: no-repeat;
        top: 5px;
        left: 3px;
        height: 38px;
        width: 38px;
        position: absolute;
    }
}
.passeyes {
    height: 22px;
    width: 24px;
    position: absolute;
    right: 10px;
    top: 12px;
    cursor: pointer;
}
.regiserbox {
    display: flex;
    margin-top: 5px;
    span {
        margin-top: 9px;
        font-size: 22px;
        line-height: 22px;
    }
    .regisertext {
        height: 35px;
        width: 75px;
        font-size: 21px;
        padding: 0 6px;
        outline: none;
    }
    .regiserimg {
        margin-left: 13px;
    }
}
.loginbutton {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 12px;
    button {
        width: 70%;
        color: white;
        font-size: 18px;
        background-color: #409eff;
        height: 38px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.5s;
        /*缓慢hover显示 */
        &:hover {
            background-color: #73b8fe;
            box-shadow: 0 0 12px#73b8fe;
        }
        &:active {
            position: relative;
            top: 0.5px;
            left: 0.5px;
        }
    }
}
#regiser {
    margin-left: 15px;
}
#login {
    margin-left: 7px;
}
/*css设置不可点击时置灰*/
/* .el-button.disabled-style {
  background-color: #eeeeee;
  color: #cccccc;
} */
</style>
