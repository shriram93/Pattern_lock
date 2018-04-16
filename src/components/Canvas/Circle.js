export default function Circle(center, radius) {
    let stroke = false;
    this.position = function () {
        return {
            x: center.x,
            y: center.y
        };
    };
    this.draw = function (ctx,patternTried,selCircs,patternDone,patternMatch,parent) {
        ctx.fillStyle = '#FFF';
        if (stroke) ctx.strokeStyle = stroke;
        ctx.beginPath();
        if ((this.hovering || this.selected) && !patternTried) {
            ctx.arc(center.x, center.y, radius * 1.5, 0, Math.PI * 2, false);
        } else if (patternTried && this.selected && (selCircs.length <= 3|| (!patternMatch && parent === 'ConfirmPattern'))) {
            ctx.fillStyle = '#FF5722';
            ctx.arc(center.x, center.y, radius * 1.5, 0, Math.PI * 2, false);
        } else if (patternDone && this.selected) {
            ctx.fillStyle = '#9CCC65';
            ctx.arc(center.x, center.y, radius * 1.5, 0, Math.PI * 2, false);
        } else {
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, false);
        }

        ctx.fill();
        if (stroke) ctx.stroke();

    };

    this.isPointInPath = function (x, y) {
        return Math.sqrt(Math.pow(center.x - x, 2) + Math.pow(center.y - y, 2)) <= radius * 3;
    };
    this.hovering = false;
    this.selected = false;
}