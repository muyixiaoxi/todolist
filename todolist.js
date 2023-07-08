window.onload = function () {
  var btn = document.querySelector(".submit-btn");
  var input = document.getElementsByTagName("input")[0];
  var text = document.getElementsByClassName("empty-todos")[0];
  var hidden = document.getElementsByClassName("hidden")[0];
  load();
  footer();
  playMove();
  player();
  aliMove();
  coludMove();

  // 点击submit按钮
  btn.onmousedown = function () {
    // 点击按钮后阴影消失
    btn.className = btn.className.replace(" submit-btn1", "");

    // 输入框不为空s
    if (input.value.trim()) {
      // 先读取本地存储原来的数据
      var local = getData();
      // 当输入时，先更新数组，再替换本地存储
      local.push({ text: input.value, done: false ,date:getDate()});
      saveData(local);

      // 渲染加载数据
      load();
    }
  };
  // 按钮阴影样式
  btn.onmouseup = function () {
    btn.className += " submit-btn1";
  };

  // 渲染加载数据
  function load() {
    var todolist = document.querySelector(".todo-list");
    var str = "";

    // 读取本地存储
    // 过滤
    var data = fil();
    data.forEach((element, index) => {
      if (element.done) {
        str =
          '<li class="todo-item1"><input type="checkbox" checked class="left-icon"></input><div class="todo-text">' +
          element.text +
          '</div><div class="right-icon" id="' +
          index +
          '"><i class="iconfont del">&#xed1e;</i></div></li>' +
          str;
      } else {
        str =
          '<li class="todo-item"><input type="checkbox" class="left-icon"></input><div class="todo-text">' +
          element.text +
          '</div><div class="right-icon" id="' +
          index +
          '"><ul class="down-box"><li class="s">15s</li><li class="min">1min</li></ul><i class="iconfont time">&#xe600;</i><i class="iconfont del">&#xed1e;</i></div><div class="date">'+element.date+'</div></li>' +
          str;
      }
    });

    input.value = "";

    if (str) {
      text.style.display = "none";
      hidden.style.display = "block";
      todolist.innerHTML = str;
    } else {
      text.style.display = "block";
      hidden.style.display = "none";
    }

    revise();
    del();
    downBox();
    updata();
  }

  //更改状态
  function updata() {
    var left = document.querySelectorAll(".left-icon");
    left.forEach((element) => {
      element.onclick = function () {
        // 获取本地数据
        var data = getData();

        //修改数据
        var index = element.parentNode.children[2].getAttribute("id");
        if (element.checked) {
          data[index].done = true;
        } else {
          data[index].done = false;
        }
        // 保存本地存储
        saveData(data);

        // 下端变化
        footer();
        select();

        // 重新渲染
        load();
      };
    });
  }

  // 删除操作
  function del() {
    var del = document.querySelectorAll(".del");
    del.forEach((element) => {
      element.onclick = function () {
        // 先获取本地存储
        var data = getData();
        // 修改数据
        var index = element.parentNode.getAttribute("id");
        data.splice(index, 1);
        // 保存本地
        saveData(data);
        // 重新渲染
        load();
      };
    });
  }

  // 双击修改
  function revise() {
    let todoTexts = document.querySelectorAll(".todo-item .todo-text");
    todoTexts.forEach((e) => {
      e.ondblclick = function () {
        //获取存储
        let data = getData();

        // 获取点击的id
        let index = e.parentNode.children[2].getAttribute("id");

        // 文本变为可编辑
        e.innerHTML='<input type="text" value="'+data[index].text+'"autofocus>';

        let input=e.childNodes[0];

        // 初始焦点在后边
        input.setSelectionRange(input.value.length,+input.value.length);

        // 失去焦点后  修改数组
        e.childNodes[0].onblur=function(){
          
          data[index].text=input.value;

          // 存入本地存储
          saveData(data);

          e.innerText=data[index].text;
        }


       

        // 修改存储
      };
    });
  }

  // 下拉框
  function downBox() {
    let db = document.querySelectorAll(".time");
    let down=document.querySelectorAll('.down-box');


    down.forEach(e => {
      e.onmouseout=function(){
        e.style.height=0;
      }
    });
   
  
    
    
    db.forEach((element) => {
      element.onclick = function () {
        if (element.parentNode.children[0].style.height) {
          element.parentNode.children[0].style.height = null;
          element.style.color = null;
        } else {
          element.parentNode.children[0].style.height = 50 + "px";
          element.style.color = "gold";
          var li = element.parentNode.children[0].childNodes;
          li[0].onclick = function () {
            element.parentNode.children[0].style.height = null;

            timer(15, element.parentNode.getAttribute("id"));
            setTimeout(function () {
              element.style.color = null;
            }, 15000);
          };
          li[1].onclick = function () {
            element.parentNode.children[0].style.height = null;
            timer(60, element.parentNode.getAttribute("id"));
            setTimeout(function () {
              element.style.color = null;
            }, 60000);
          };
        }      
      };
    });

    // 失去焦点
   down.forEach(e => {
    e.onblur=function(){
      e.style.height=null;
    }
   });
  }

  // 计数器
  function timer(time, index) {
    var data = getData();
    let tip = document.querySelector(".tips");

    setTimeout(function () {
      tip.style.display = "block";
      tip.innerText = data[index].text + "时间到了~";
    }, time * 1000);
  }

  // 读取本地储存的数据
  function getData() {
    var data = localStorage.getItem("todolist");
    if (data) {
      // 本地储存的数据是字符串格式的 我门需要的是对象格式的
      return JSON.parse(data);
    } else {
      return [];
    }
  }
  //保存本地存储
  function saveData(data) {
    localStorage.setItem("todolist", JSON.stringify(data));
  }

  // 表格下端操作
  function footer() {
    // 获取本地存储
    var data = getData();
    // 未完成数目
    var num = 0;
    data.forEach((element) => {
      if (!element.done) {
        num++;
      }
    });
    var footer = document.querySelector(".footer");
    if (num != 0) {
      //存在 完成 未完成
      if (num != data.length) {
        var str =
          '<div class="footer-left">item left</div><div class="up all span">All</div><div class="up active">Active</div><div class="up comp">Completed</div><div class="up clear">Clear Completed</div>';
      } else {
        var str =
          '<div class="footer-left">item left</div><div class="up all span">All</div>';
      }
    } else {
      if (data.length - num > 0) {
        //有完成的任务
        var str =
          '<div class="footer-left">item left</div><div class="up all span">All</div><div class="up clear">Clear completed</div>';
      } else {
        var str =
          '<div class="footer-left">item left</div><div class="up all span">All</div>';
      }
    }
    footer.innerHTML = str;
    // select();

    var itemLeft = document.querySelector(".footer-left");
    itemLeft.innerText = num + " item left";
  }

  // 按钮切换
  function select() {
    var data = getData();
    var num = 0;
    data.forEach((element) => {
      if (!element.done) {
        num++;
      }
    });
    var up = document.querySelectorAll(".up");
    // 切换选中
    up.forEach((element) => {
      element.onclick = function () {
        // 删除选中
        up.forEach((element) => {
          element.className = element.className.replace(" span", "");
        });
        // 添加选中
        element.className += " span";
        //渲染
        load();
      };
    });
  }

  //过滤
  function fil() {
    var data = getData();
    var arr = [];
    // 选中all
    if (document.querySelector(".active.span")) {
      arr = data.filter((item) => item.done == false);
    } else if (document.querySelector(".comp.span")) {
      arr = data.filter((item) => item.done == true);
    } else if (document.querySelector(".clear.span")) {
      clear();
      footer();
      arr = getData();
    } else {
      arr = data;
    }

    return arr;
  }

  // 清除
  function clear() {
    // 获取本地存储
    var data = getData();
    // 删除已完成的
    data = data.filter((item) => item.done == false);
    // 存入本地存储
    saveData(data);
  }

  // 悬浮窗移动
  function playMove() {
    var player = document.querySelector(".player");
    var canMove;
    var change;

    // 鼠标点击时坐标
    var x = 0;
    var y = 0;
    player.onmousedown = function (e) {
      canMove = true;
      x = e.pageX - player.offsetLeft;
      y = e.pageY - player.offsetTop;
    };
    player.onmouseup = function () {
      canMove = false;
      flexing();
    };
    player.onblur = function () {
      canMove = false;
      flexing();
    };
    player.onmousemove = function (e) {
      if (canMove) {
        // 点击时坐标之差与移动时相等
        // x轴：px2-px1=mx2-mx1;
        let left = e.pageX - x;
        let top = e.pageY - y;

        if (left < 0) left = 0;
        if (top < 0) top = 0;
        let maxLeft = innerWidth - player.offsetWidth;
        let maxTop = innerHeight - player.offsetHeight;
        if (left >= maxLeft) left = maxLeft;
        if (top >= maxTop) top = maxTop;

        player.style.left = left + "px";
        player.style.top = top + "px";
      }
    };

    // 伸缩
    function flexing() {
      // 距离右边伸缩距离
      let d = 20;
      if (!canMove && !change) {
        let x = window.innerWidth - d - player.offsetWidth;
        if (player.offsetLeft >= x) {
          player.style.width = 10 + "px";
          player.style.left = innerWidth - 10 + "px";
          change = true;
        }
      }
      // 伸
      player.onmouseover = function () {
        if (change) {
          player.style.width = 200 + "px";
          player.style.left = innerWidth - 210 + "px";
          change = false;
        }
      };
    }
  }

  // 音乐播放
  function player() {
    // 当前播放索引
    var index = 0;

    // 播放状态
    let aired = false;

    let audios = document.querySelectorAll(".player audio");
    let music = document.querySelector(".music");
    let above = document.querySelector(".above");
    let play = document.querySelector(".play");
    let next = document.querySelector(".next");

    above.onclick = function () {
      index--;
      playing(index);
    };

    next.onclick = function () {
      index++;
      console.log(index);
      playing(index);
    };

    play.onclick = function () {
      if (!aired) {
        play.innerHTML = '<i class="iconfont">&#xea81;</i>';
        aired = true;
        playing(index);
      } else {
        play.innerHTML = '<i class="iconfont">&#xe6a4;</i>';
        aired = false;
        stop(index);
      }
    };

    // 播放
    function playing() {
      if (index < 0) {
        index = audios.length - 1;
      }
      if (index > audios.length - 1) {
        index = 0;
      }

      // 格式化所有音频
      audios.forEach((e) => {
        e.load();
      });
      play.innerHTML = '<i class="iconfont">&#xea81;</i>';
      aired = true;
      music.className = "musicing";
      audios[index].play();
      audios[index].addEventListener("ended", function () {
        index++;
        playing(index);
      });
    }

    // 暂停
    function stop(index) {
      audios[index].pause();
      music.className = "music";
    }
  }

  // 清除tips
  function removeTips() {
    let gif = document.querySelector(".gif");
    let tip = document.querySelector(".tips");
    gif.onclick = function () {
      tip.style.display = "none";
    };
  }

  // 阿里移动
  function aliMove() {
    let right = 0;
    let ali = document.querySelector(".gif");
    setInterval(function () {
      right += 2;
      if (right > 1500) right = 0;
      ali.style.right = right + "px";
      
    }, 10);
    removeTips();
  }

  // 当前日期
  function getDate(){
    let date=new Date();

    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let d=date.getDate();
    let hours=date.getHours();
    let min=date.getMinutes();
    let s=year+'/'+month+'/'+d+'/'+ hours+'/'+min;
    return s;
  }

  // 云
  function coludMove(){
    let colud=document.querySelector('.colud div');
    console.log(colud.offsetWidth);
    let left=-1699;

    setInterval(function(){
      left+=0.25;
      if(left==0)left=-1699;
      colud.style.marginLeft=left+'px';
    },10)
  }
};
