DOM = {
    pie : document.getElementById('chartmain_pie'),
}
//获取dom容器
var pie = echarts.init(DOM.pie);
// 获取父容器的宽度和高度
const parentWidth = DOM.pie.parentNode.offsetWidth;
const parentHeight =DOM.pie.parentNode.offsetHeight;

// 计算边距（10%）
const margin = 0.1;
const leftMargin = parentWidth * margin;
const topMargin = parentHeight * margin;
const rightMargin = parentWidth * margin;
const bottomMargin = parentHeight * margin;
option = {
    title: {
        text: '数据情况统计',
        subtext: '',
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
        type: 'scroll',
        orient: 'vertical',
        data: ['正常', '异常'],
        textStyle: {
            color: '#fff',
            fontSize: 12
        }

    },
    grid: {
        // 根据容器大小合理调整
        left: leftMargin,
        right: topMargin,
        top: rightMargin,
        bottom: bottomMargin
    },
    color : [ '#0fff0f','#ff0f0f'],
    series: [
        {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {value: 1548, name: '正常',},
                {value: 535, name: '异常'},
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

