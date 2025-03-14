{
    // 获取 DOM 容器
    const DOM = {
        line: document.getElementById('chartmain_line')
    };
    // 初始化 ECharts 实例
    const line = echarts.init(DOM.line);
    // 获取父容器的宽度和高度
    const parentWidth = DOM.line.parentNode.offsetWidth;
    const parentHeight =DOM.line.parentNode.offsetHeight;

    // 计算边距（10%）
    const margin = 0.1;
    const leftMargin = parentWidth * margin;
    const topMargin = parentHeight * margin;
    const rightMargin = parentWidth * margin;
    const bottomMargin = parentHeight * margin;

    // 图表配置选项
    const option = {

        legend: {
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            right: '10%',
            data: ['折线一', '折线二']
        },
        grid: {
            // 根据容器大小合理调整
            left: leftMargin,
            right: topMargin,
            top: rightMargin,
            bottom: bottomMargin
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                symbol: ['none', 'arrow'],
                symbolOffset: 12,
                lineStyle: {
                    color: '#fff'
                }
            },
            data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00']
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
                symbol: ['none', 'arrow'],
                symbolOffset: 12,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                }
            }
        },
        series: [
            {
                name: '折线一',
                type: 'line',
                stack: '总量',
                data: [280, 102, 191, 134, 390, 230, 210],
                itemStyle: {
                    normal: {
                        color: "#0efdff", // 折线点的颜色
                        lineStyle: {
                            color: "#0efdff", // 折线的颜色
                            width: 2
                        }
                    }
                }
            },
            {
                name: '折线二',
                type: 'line',
                stack: '总量',
                data: [100, 132, 131, 234, 290, 330, 110]
            }
        ]
    };

    function init() {
        line.setOption(option);
        // 监听窗口大小变化事件
        window.addEventListener('resize', function () {
            line.resize();
        });
    }

    init();
}
