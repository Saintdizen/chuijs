const { Notification } = require('../chui_notification/notification');
const { setStyles } = require('../../modules/chui_functions');

const STYLES_ID = 'chUiJS_Canvas';
const AXIS_COLOR = '#8e8e93';
const LABEL_FONT = 'bold 14px Arial';
const Y_AXIS_STEPS = 4;
const PLOT_HEIGHT = 240;
const CATEGORY_WIDTH = 150;
const BAR_WIDTH = 75;
const BAR_FALLBACK_COLOR = '#1676f3';
const PADDING = { top: 20, right: 20, bottom: 50, left: 50 };
const PIE_SIZE = 400;

/** Подбирает «круглый» масштаб оси: максимум и шаг между делениями. */
function getAxisScale(maxValue) {
    if (!(maxValue > 0)) return { max: Y_AXIS_STEPS, step: 1 };
    const rawStep = maxValue / Y_AXIS_STEPS;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = Math.ceil(rawStep / magnitude) * magnitude;
    return { max: step * Y_AXIS_STEPS, step: step };
}

/** Форматирует подпись оси без лишних нулей после запятой. */
function formatAxisLabel(value) {
    return Number(value.toFixed(2)).toString();
}

/** Приводит canvas к физическому разрешению экрана, сохраняя рисование в CSS-пикселях. */
function prepareCanvas(canvas, cssWidth, cssHeight) {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = cssWidth * ratio;
    canvas.height = cssHeight * ratio;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    return ctx;
}

class BarGraph {
    #canvas = document.createElement('canvas');
    #options = undefined;
    #bars = [];

    constructor(options) {
        setStyles(__dirname + '/styles.css', STYLES_ID);
        this.#options = options;
        this.#draw();
        this.#bindPointer();
    }

    #draw() {
        const data = this.#options.data || {};
        const colors = this.#options.colors || [];
        const labels = Object.keys(data);
        const values = labels.map((label) => Number(data[label]) || 0);
        const scale = getAxisScale(Math.max.apply(null, values.length ? values : [0]));

        const plotWidth = labels.length * CATEGORY_WIDTH;
        const cssWidth = PADDING.left + plotWidth + PADDING.right;
        const cssHeight = PADDING.top + PLOT_HEIGHT + PADDING.bottom;
        const ctx = prepareCanvas(this.#canvas, cssWidth, cssHeight);

        this.#drawAxes(ctx, plotWidth, scale);
        this.#drawBars(ctx, labels, values, scale, colors);
    }

    #drawAxes(ctx, plotWidth, scale) {
        const originX = PADDING.left;
        const originY = PADDING.top;
        const bottomY = originY + PLOT_HEIGHT;

        ctx.strokeStyle = AXIS_COLOR;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX, bottomY);
        ctx.lineTo(originX + plotWidth, bottomY);
        ctx.stroke();

        ctx.font = LABEL_FONT;
        ctx.fillStyle = AXIS_COLOR;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= Y_AXIS_STEPS; i++) {
            const y = bottomY - (i / Y_AXIS_STEPS) * PLOT_HEIGHT;
            ctx.fillText(formatAxisLabel(i * scale.step), originX - 6, y);
            ctx.beginPath();
            ctx.moveTo(originX, y);
            ctx.lineTo(originX - 5, y);
            ctx.stroke();
        }
    }

    #drawBars(ctx, labels, values, scale, colors) {
        const bottomY = PADDING.top + PLOT_HEIGHT;
        this.#bars = [];
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let i = 0; i < labels.length; i++) {
            const barHeight = (values[i] / scale.max) * PLOT_HEIGHT;
            const x = PADDING.left + i * CATEGORY_WIDTH + (CATEGORY_WIDTH - BAR_WIDTH) / 2;
            const bar = { index: i, x: x, y: bottomY - barHeight, w: BAR_WIDTH, h: barHeight };
            this.#bars.push(bar);

            ctx.fillStyle = colors[i % colors.length] || BAR_FALLBACK_COLOR;
            ctx.fillRect(bar.x, bar.y, bar.w, bar.h);

            ctx.fillStyle = AXIS_COLOR;
            ctx.fillText(labels[i], bar.x + bar.w / 2, bottomY + 10);
        }
    }

    #bindPointer() {
        this.#canvas.style.cursor = 'pointer';
        this.#canvas.addEventListener('click', (event) => {
            const bar = this.#findBar(event);
            if (bar === null) return;
            const data = this.#options.data || {};
            const labels = Object.keys(data);
            new Notification({
                title: labels[bar.index],
                text: String(data[labels[bar.index]]),
                showTime: 3000,
            }).show();
        });
    }

    #findBar(event) {
        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for (let bar of this.#bars) {
            if (x >= bar.x && x <= bar.x + bar.w && y >= bar.y && y <= bar.y + bar.h) return bar;
        }
        return null;
    }

    set() {
        return this.#canvas;
    }
}

class PieGraph {
    #chui_piechart = document.createElement('chui_piechart');
    #canvas = document.createElement('canvas');
    #options = undefined;

    constructor(options) {
        setStyles(__dirname + '/styles.css', STYLES_ID);
        this.#options = options;
        const ctx = prepareCanvas(this.#canvas, PIE_SIZE, PIE_SIZE);
        this.#drawSlices(ctx);
        this.#chui_piechart.appendChild(this.#canvas);
        if (options.legend) this.#chui_piechart.appendChild(this.#buildLegend());
    }

    #drawSlices(ctx) {
        const data = this.#options.data || {};
        const colors = this.#options.colors || [];
        const labels = Object.keys(data);
        const total = labels.reduce((sum, label) => sum + (Number(data[label]) || 0), 0);
        if (total <= 0) return;

        const center = PIE_SIZE / 2;
        let startAngle = 0;
        for (let i = 0; i < labels.length; i++) {
            const value = Number(data[labels[i]]) || 0;
            const sliceAngle = 2 * Math.PI * value / total;
            drawPieSlice(ctx, center, center, center, startAngle, startAngle + sliceAngle, colors[i % colors.length]);
            this.#drawPercentage(ctx, center, startAngle, sliceAngle, value, total);
            startAngle += sliceAngle;
        }
        this.#drawDoughnutHole(ctx, center);
    }

    #drawPercentage(ctx, center, startAngle, sliceAngle, value, total) {
        const labelRadius = center * 0.65;
        const angle = startAngle + sliceAngle / 2;
        ctx.fillStyle = 'white';
        ctx.font = LABEL_FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(100 * value / total)}%`, center + labelRadius * Math.cos(angle), center + labelRadius * Math.sin(angle));
    }

    #drawDoughnutHole(ctx, center) {
        const holeSize = this.#options.doughnutHoleSize;
        if (!(holeSize > 0) || holeSize >= 1) return;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(center, center, center * holeSize, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    #buildLegend() {
        const data = this.#options.data || {};
        const colors = this.#options.colors || [];
        const legends = document.createElement('legends');
        let index = 0;
        for (let label in data) {
            const legend = document.createElement('legend');
            const color = document.createElement('legend_color');
            const text = document.createElement('legend_label');
            color.style.background = colors[index % colors.length];
            text.innerHTML = label;
            legend.appendChild(color);
            legend.appendChild(text);
            legends.appendChild(legend);
            index++;
        }
        return legends;
    }

    set() {
        return this.#chui_piechart;
    }
}

function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

exports.BarGraph = BarGraph;
exports.PieGraph = PieGraph;
