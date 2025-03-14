DOM = {
    pie : document.getElementById('chartmain_pie'),
}
//获取dom容器
var pie = echarts.init(DOM.pie);

option = {
    title: {
        text: '数据情况统计',
        subtext: '',
        left: 'right',
        textStyle: {
            color: '#fff',
            fontSize: 12
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        // orient: 'vertical',
        // top: 'middle',
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 40,
        bottom: 20,
        left: 'right',
        data: ['西凉', '益州', '兖州', '荆州', '幽州'],
        textStyle: {
            color: '#fff',
            fontSize: 12
        }

    },
    grid:{
        x:'-10%',
        y:40,
        x2:20,
        y2:20,
    },
    color : [ '#09d0fb', '#f88cfb', '#95f8fe', '#f9f390',  '#ecfeb7' ],
    series: [
        {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {value: 1548, name: '幽州',

        },
                {value: 535, name: '荆州'},
                {value: 510, name: '兖州'},
                {value: 634, name: '益州'},
                {value: 735, name: '西凉'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
// 使用刚指定的配置项和数据显示图表。
pie.setOption(option);

