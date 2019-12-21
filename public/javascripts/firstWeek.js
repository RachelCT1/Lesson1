$.ajax({
    type:"get",
    url:"query",
    data:{
        //select first week
        sql:"select *from data2 where  STR_TO_DATE(Date,'%Y/%m/%d %H:%i') BETWEEN '2019/4/1 0:00' and '2019/4/8 0:00'" +
            "and Dept in ('第一食堂','第二食堂','第三食堂','第四食堂','第五食堂','教师食堂','好利来食品店','红太阳超市')"
    },
    dataType:"json",
    success:function(data){
        console.log(data);

    }
})