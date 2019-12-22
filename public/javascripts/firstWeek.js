//定义dataMajor是各个专业的人数；dataConsum是一个时间段内每个专业的消费次数；
var dataConsum = [];
var dataMajor = [];
//存储按小时处理后的数据
var new_data_24 = new Array();
var new_data_3 = new Array();
// comProportion是每个专业一段时间内消费比例，dataConsum/dataMajor。每个人都去吃饭了，就是1；没有人吃饭就是0
//对应一周有21个时间段，每天3段，分别为早中晚
var comProportion = new Array();
var comProportionAll = new Array();
select_major();
if(dataMajor.length==0||dataConsum.length==0){
    select_time_major();
}
console.log("所有的消费比例：",comProportionAll);
// com_div();
function select_time_major(){
    //data1和data2联合查询，根据时间划分，统计各专业的消费次数2019/4/8 0:00
    $.ajax({
        type:"get",
        url:"query",
        async:false,
        data:{
            sql:"select * from data2 d2 inner join data1 d1 on d1.CardNo=d2.CardNo "+
                " where  STR_TO_DATE(Date,'%Y/%m/%d %H:%i') BETWEEN '2019/4/1 0:00' and '2019/4/8 0:00'" +
                "and Dept in ('第一食堂','第二食堂','第三食堂','第四食堂','第五食堂','教师食堂','好利来食品店','红太阳超市')"+
                "order by d2.Date asc"
        },
        dataType:"json",
        success:function(data){
            // getDataConsum(data);
            //将时间按整小时处理或按三段划分
            // day_div_24(data);
            day_div_3(data);
        }
    });
}
function select_major(){
//统计各专业的人数
    $.ajax({
        type:"get",
        url:"/query",
        async:false,
        data:{
            sql:"select d1.Major ,count(*) as countMajor from data1 d1 group by d1.Major order by countMajor desc"
        },
        dataType:"json",
        success:function(data){
            getdataMajor(data);
        }
    });
}
//获取各专业的人数
function getdataMajor(data){
    //这里数组不能直接赋值过去的
    data.forEach(e=>{
        dataMajor.push(e);
    })
    console.log("各专业人数：",dataMajor);
}

//获取各专业消费次数
function getDataConsum(data) {
    console.log("传入的数据：",data);
    var nestDataConsum = d3.nest()
        .key(function(d) { return d.Date; })
        .key(function(d) { return d.Major; })
        .entries(data);
    for(var i=0;i<nestDataConsum.length;i++){
        comProportionAll[i] =  com_div(nestDataConsum[i].values);
    }


    console.log("nest数据：",nestDataConsum);
    //每一时间段各专业消费的人次
    console.log("nest[0]数据：",nestDataConsum[0].values);
}

//获取消费比例
function com_div(data_comsum){
    // console.log("各专业人数：",dataMajor);
    var k = 0;
    data_comsum.forEach(ele1=>{
        dataMajor.forEach(ele2=>{
            // console.log(ele2);
            comProportion[k] = {};
            if(ele1.key == ele2.Major){
                // console.log(hello);
                comProportion[k].Major = ele1.key;
                comProportion[k].proportion = (ele1.values.length / ele2.countMajor).toFixed(2);
                k++;
            }
        })
    });
    // console.log("消费比例：",comProportion);
    return comProportion;
}

//按小时为单位划分时间
function day_div_24(data){
    // console.log(data);
    var d;
    data.forEach(e=>{
        d = new Date(e.Date.replace(/-/g,"/"));
        d.setMinutes(0);
        d.setHours(d.getHours()+1);
        // console.log(d);
        e.Date = d.getFullYear()+'/'+ String(d.getMonth()+1)+ '/'+d.getDay()+ ' '+
                    String(d.getHours()).padStart(2,0)+":"+String(d.getMinutes()).padStart(2,0);

    });
    new_data_24 = data;
    // console.log(new_data);
    getDataConsum(new_data_24);
}

// 获取每天三段的时间 "2019/4/1 5:00","2019/4/1 10:00"
function day_div_3(data,date_begin,date_end) {
    // console.log(data);
    var d;
    data.forEach(e=>{
        d = new Date(e.Date.replace(/-/g,"/"));
        d.setMinutes(0);
        if(d.getHours()>0&&d.getHours()<=10){
            d.setHours(10);
        }else if(d.getHours()>10&&d.getHours()<=15){
            d.setHours(15);
        }else {
            d.setHours(0);
        }
        // console.log(d);
        e.Date = d.getFullYear()+'/'+ String(d.getMonth()+1)+ '/'+d.getDay()+ ' '+
            String(d.getHours()).padStart(2,0)+":"+String(d.getMinutes()).padStart(2,0);
    });
    new_data_3 = data;
    console.log(new_data_3);
    getDataConsum(new_data_3);
}

//***************************绘图部分***********************************
function drawMajor(){
    var myChart = echarts.init(document.getElementById('Date-Dept'));
    var time = []
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '第一周消费情况'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['第一食堂','第二食堂','第三食堂','第四食堂','第五食堂','教师食堂','好利来食品店','红太阳超市']
        },
        xAxis:  [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series: [{
            name:'邮件营销',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[120, 132, 101, 134, 90, 230, 210]
        },
            {
                name:'搜索引擎',
                type:'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data:[820, 932, 901, 934, 1290, 1330, 1320]
            }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}