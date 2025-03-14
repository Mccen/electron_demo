{
    // 获取 DOM 容器
    const DOM = {
        histogram: document.getElementById('chartmain_histogram')
    };
    // 初始化 ECharts 实例
    const histogram = echarts.init(DOM.histogram);
    // 获取父容器的宽度和高度
    const parentWidth = DOM.histogram.parentNode.offsetWidth;
    const parentHeight = DOM.histogram.parentNode.offsetHeight;

    // 计算边距（10%）
    const margin = 0.1;
    const leftMargin = parentWidth * margin;
    const topMargin = parentHeight * margin;
    const rightMargin = parentWidth * margin;
    const bottomMargin = parentHeight * margin;
    // 指定图表的配置项和数据
    const dataAxis = ['1日', '2日', '3日', '4日', '5日', '6日', '7日'];
    const data = [220, 182, 191, 234, 290, 330, 310];

    const option = {
        grid: {
            // 根据容器大小合理调整
            left: leftMargin,
            top: topMargin,
            right: rightMargin,
            bottom: bottomMargin
        },
        xAxis: {
            data: dataAxis,
            axisLine: {
                show: true,
                symbol: ['none', 'arrow'],
                symbolOffset: 12,
                lineStyle: {
                    color: '#fff'
                }
            },
        },
        yAxis: {
            type: 'value',
            name: '单位：元',
        },
        legend: {
            data: ['temp', 'water'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: 'temp',
                type: 'bar',
                data: data,
                itemStyle: {
                    color: '#fff'
                }
            },
            {
                name: 'water',
                type: 'bar',
                data: data,
                itemStyle: {
                    color: '#ff0'
                }
            }
        ]
    };

    function init() {
        histogram.setOption(option);
        // 监听窗口大小变化，动态调整图表大小
        window.addEventListener('resize', function () {
            histogram.resize();
        });
    }

    init();
}