let { Notification } = require('./chui_notification')

class BarGraph {
    #canvas = document.createElement('canvas');
    #options = undefined;
    constructor(options) {
        require('../modules/chui_functions').style_parse([
            {
                name: "canvas",
                style: {
                    "background": "var(--center_background)",
                    "height": "max-content",
                    "width": "max-content",
                    "border-radius": "var(--border_radius)",
                    "margin": "var(--margin)",
                }
            },
            {
                name: "chui_piechart",
                style: {
                    "display": "flex",
                    "align-items": "center",
                }
            },
            {
                name: "legends",
                style: {
                    "margin": "15px"
                }
            },
            {
                name: "legend",
                style: {
                    "display": "flex",
                    "align-items": "center",
                }
            },
            {
                name: "legend_color",
                style: {
                    "width": "20px",
                    "height": "20px",
                    "border-radius": "var(--border_radius)"
                }
            },
            {
                name: "legend_label",
                style: {
                    "color": "var(--text_color)",
                    "font-weight": "500",
                    "margin": "var(--margin)"
                }
            }
        ], 'Canvas');
        this.#options = options;
        let colors = options.colors;
        let data_lenght = 0;
        let datz = [];
        let labelz = [];
        for (let test in this.#options.data) {
            data_lenght++;
            datz.push(this.#options.data[test]);
            labelz.push(test);
        }
        let height = Math.max.apply(null, datz);
        height =  height / 100;
        height = Math.ceil(height) * 100;
        let zz = 4;
        let width = (150 * data_lenght) - 75;
        let max = height;
        this.#canvas.setAttribute("width", width+70);
        this.#canvas.setAttribute("height", height+70);
        let ctx = this.#canvas.getContext('2d');

        ctx.strokeStyle = '#8e8e93'
        ctx.lineWidth = 1.5;
        ctx.beginPath(); 
        ctx.moveTo(35, 35); 
        ctx.lineTo(35, height + 35);
        ctx.lineTo(width + 35, height + 35);
        ctx.stroke();
        
        let shag = max / zz;

        ctx.fillStyle = "#8e8e93";
        let test = (height + 35) / shag + 1;
        for(let i = 0; i < test; i++) {
            let testzz = i * shag;
            if (testzz < max || testzz === max) {
                ctx.font = `bold 14px Arial`;
                ctx.textBaseline = 'middle';
                ctx.fillText(testzz, 0, (height + 35 - i * shag)); 
                ctx.beginPath(); 
                ctx.moveTo(35, height + 35 - i * shag);
                ctx.lineTo(30, height + 35 - i * shag);
                ctx.stroke();
            }
        }

        let i = 0;
        for (test in this.#options.data) {
            ctx.font = `bold 14px Arial`;
            ctx.fillText(test, 35 + i * 150, height + 60);
            i++;
        }

        
        let rects = [];
        i = 0;
        for (test in this.#options.data) {
            let dp = this.#options.data[test];
            rects.push({x: 35 + i * 150, y: height + 35 - dp, w: 75, h: dp})
            i++;
        }
        i = 0;
        let r;
        while(r = rects[i++]) {
            ctx.fillStyle = `${colors[i-1]}`;
            ctx.fillRect(r.x, r.y, r.w, r.h);
        }        

        this.#canvas.onclick = function(e) {
            let rect = this.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top, i = 0, r;
            while(r = rects[i++]) {
                ctx.fillStyle = `${colors[i-1]}`;
                ctx.beginPath();
                ctx.rect(r.x, r.y, r.w, r.h);
                if (ctx.isPointInPath(x, y)) {
                    new Notification(`${labelz[i-1]} [${datz[i-1]}]`).show();
                    ctx.fillStyle = ctx.isPointInPath(x, y) ? "#1676f3" : "#1676f3";
                }
                ctx.closePath();
                ctx.fill();
            }
        };
    }
    set() {
        return this.#canvas;
    }
}

class PieGraph {
    #chui_piechart = document.createElement('chui_piechart');
    #canvas = document.createElement('canvas');
    #options = undefined;
    #ctx = this.#canvas.getContext("2d");
    #colors = undefined;
    constructor(options) {
        
        this.#canvas.width = 400;
        this.#canvas.height = 400;
        this.#options = options;
        
        this.#colors = options.colors;

        let total_value = 0;
        let color_index = 0;
        for (let categ in this.#options.data){
            let val = this.#options.data[categ];
            total_value += val;
        }

        let start_angle = 0;
        for (let categ in this.#options.data){
            let val = this.#options.data[categ];
            let slice_angle = 2 * Math.PI * val / total_value;
 
            drawPieSlice(
                this.#ctx,
                this.#canvas.width/2,
                this.#canvas.height/2,
                Math.min(this.#canvas.width/2,this.#canvas.height/2),
                start_angle,
                start_angle+slice_angle,
                this.#colors[color_index%this.#colors.length]
            );
 
            start_angle += slice_angle;
            color_index++;
        }
        /*if (this.#options.doughnutHoleSize){
            drawPieSlice(
                this.#ctx,
                this.#canvas.width/2,
                this.#canvas.height/2,
                this.#options.doughnutHoleSize * Math.min(this.#canvas.width/2,this.#canvas.height/2),
                0,
                2 * Math.PI,
                "rgba(0, 0, 200, 0.5)"
            );
        }*/
        start_angle = 0;
        for (let categ in this.#options.data){
            let val = this.#options.data[categ];
            let slice_angle = 2 * Math.PI * val / total_value;
            let pieRadius = Math.min(this.#canvas.width / 2, this.#canvas.height / 2);
            let offset = (pieRadius * 0.3) / 2;
            let labelX = this.#canvas.width / 2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
            let labelY = this.#canvas.height / 2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);
            let labelText = Math.round(100 * val / total_value);
            this.#ctx.fillStyle = "white";
            this.#ctx.font = "bold 17px Arial";
            this.#ctx.fillText(`${labelText}%`, labelX, labelY+10);
            start_angle += slice_angle;
        }
        let legends = document.createElement('legends');
        if (this.#options.legend){
            color_index = 0;
            for (let categ in this.#options.data){
                let legend = document.createElement('legend');
                let color = document.createElement('legend_color');
                let label = document.createElement('legend_label');
                color.style.background = `${this.#colors[color_index++]}`;
                label.innerHTML = categ;
                legend.appendChild(color);
                legend.appendChild(label);
                legends.appendChild(legend);
            }
        }
        this.#chui_piechart.appendChild(this.#canvas);
        this.#chui_piechart.appendChild(legends);
    }
    set() {
        return this.#chui_piechart;
    }
}
function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX , centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

exports.BarGraph = BarGraph;
exports.PieGraph = PieGraph;