$.ajax({
    type:"get",
    url:"/query",
    data:{
        sql:"select *from data2 where  STR_TO_DATE(Date,'%Y/%m/%d %H:%i') BETWEEN '2019/4/1 6:00' and '2019/4/1 7:00'"
    },
    dataType:"json",
    success:function(data){
        // console.log(data);
        return data;
    }
})
