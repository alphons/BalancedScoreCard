// Cache for background canvases based on minValue and maxValue
const backgroundCanvasCache = new Map();

function updateMeter(canvasId, newTargetValue, label = null) 
{
	const canvas = document.getElementById(canvasId);
	if (!canvas)
	{
		addMeter(newTargetValue, label || 'Meter', -1, 1);
		return;
	}
	const minValue = parseFloat(canvas.dataset.minValue);
	const maxValue = parseFloat(canvas.dataset.maxValue);
	canvas.dataset.currentValue = newTargetValue;
	const meterDiv = canvas.parentElement;
	const currentLabel = label || meterDiv.querySelector('p').textContent;
	const needleCanvas = document.getElementById(`${canvasId}-needle`);
	drawMeter(canvasId, `${canvasId}-needle`, newTargetValue, currentLabel, minValue, maxValue);
}

function addMeter(value, label, minValue = -1, maxValue = 1) 
{
	const metersContainer = document.getElementById('metersContainer');
	const meterId = `meter${metersContainer.children.length + 1}`;
	const meterDiv = document.createElement('div');
	meterDiv.className = 'meter';
	meterDiv.style.position = 'relative';

	// Background canvas
	const bgCanvas = document.createElement('canvas');
	bgCanvas.id = meterId;
	bgCanvas.width = 200;
	bgCanvas.height = 180;
	bgCanvas.dataset.currentValue = value;
	bgCanvas.dataset.minValue = minValue;
	bgCanvas.dataset.maxValue = maxValue;
	bgCanvas.style.position = 'absolute';
	bgCanvas.style.zIndex = '1';

	// Needle canvas
	const needleCanvas = document.createElement('canvas');
	needleCanvas.id = `${meterId}-needle`;
	needleCanvas.width = 200;
	needleCanvas.height = 180;
	needleCanvas.style.position = 'absolute';
	needleCanvas.style.zIndex = '2';

	const labelP = document.createElement('p');
	labelP.textContent = label;
	meterDiv.appendChild(bgCanvas);
	meterDiv.appendChild(needleCanvas);
	meterDiv.appendChild(labelP);
	metersContainer.appendChild(meterDiv);

	drawMeter(meterId, `${meterId}-needle`, value, label, minValue, maxValue);
}

function createBackgroundCanvas(width, height, minValue, maxValue) 
{
	//console.log('createBackgroundCanvas ' + minValue + ' ' + maxValue);
	const bgCanvas = document.createElement('canvas');
	bgCanvas.width = width;
	bgCanvas.height = height;
	const ctx = bgCanvas.getContext('2d');
	const centerX = width / 2;
	const centerY = height * 0.65;
	const radius = width * 0.4;
	const startAngle = Math.PI;
	const endAngle = 2 * Math.PI;

	// Draw background arc
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	ctx.lineWidth = 20;
	const gradient = ctx.createLinearGradient(0, 0, width, 0);
	gradient.addColorStop(0, '#ff4d4d');
	gradient.addColorStop(0.5, '#ffa500');
	gradient.addColorStop(1, '#00cc00');
	ctx.strokeStyle = gradient;
	ctx.stroke();

	// Draw radial gradient overlay
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	const radialGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.2);
	radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
	radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
	ctx.strokeStyle = radialGradient;
	ctx.lineWidth = 10;
	ctx.stroke();

	// Draw ticks
	const tickCount = 10;
	const tickLength = 8;
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	for (let i = 0; i <= tickCount; i++)
	{
		const tickAngle = startAngle + (i / tickCount) * (endAngle - startAngle);
		ctx.beginPath();
		ctx.moveTo(centerX + radius * Math.cos(tickAngle), centerY + radius * Math.sin(tickAngle));
		ctx.lineTo(centerX + (radius + tickLength) * Math.cos(tickAngle), centerY + (radius + tickLength) * Math.sin(tickAngle));
		ctx.stroke();
	}

	// Draw labels
	ctx.font = '14px Arial';
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	const midValue = (maxValue + minValue) / 2;
	ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	ctx.fillRect(centerX - radius - 20, centerY + 10, 40, 24);
	ctx.fillStyle = 'white';
	ctx.fillText(minValue.toFixed(0), centerX - radius, centerY + 22);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	ctx.fillRect(centerX - 20, centerY + 10, 40, 24);
	ctx.fillStyle = 'white';
	ctx.fillText(midValue.toFixed(0), centerX, centerY + 22);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	ctx.fillRect(centerX + radius - 20, centerY + 10, 40, 24);
	ctx.fillStyle = 'white';
	ctx.fillText(maxValue.toFixed(0), centerX + radius, centerY + 22);

	// Draw screws
	const screwRadius = 10;
	const screwPositions = [
		{ x: screwRadius, y: screwRadius }, // top-left
		{ x: width - screwRadius, y: screwRadius }, // top-right
		{ x: screwRadius, y: height - screwRadius }, // bottom-left
		{ x: width - screwRadius, y: height - screwRadius } // bottom-right
	];
	ctx.fillStyle = '#666666';
	ctx.strokeStyle = '#333333';
	ctx.lineWidth = 2;
	screwPositions.forEach(pos =>
	{
		// Draw screw circle
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, screwRadius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		// Draw cross
		ctx.beginPath();
		ctx.moveTo(pos.x - screwRadius * 0.6, pos.y);
		ctx.lineTo(pos.x + screwRadius * 0.6, pos.y);
		ctx.moveTo(pos.x, pos.y - screwRadius * 0.6);
		ctx.lineTo(pos.x, pos.y + screwRadius * 0.6);
		ctx.stroke();
	});

	return bgCanvas;
}

function drawMeter(bgCanvasId, needleCanvasId, value, label, minValue, maxValue) 
{
	const bgCanvas = document.getElementById(bgCanvasId);
	const needleCanvas = document.getElementById(needleCanvasId);
	const bgCtx = bgCanvas.getContext('2d');
	const needleCtx = needleCanvas.getContext('2d');
	const width = bgCanvas.width;
	const height = bgCanvas.height;
	const centerX = width / 2;
	const centerY = height * 0.65;
	const radius = width * 0.4;
	const startAngle = Math.PI;
	const endAngle = 2 * Math.PI;

	if (!bgCanvas.hasBackground) 
	{
		const cacheKey = `${minValue}_${maxValue}`;
		if (!backgroundCanvasCache.has(cacheKey))
		{
			backgroundCanvasCache.set(cacheKey, createBackgroundCanvas(width, height, minValue, maxValue));
		}
		//console.log('draw cached(' + cacheKey + ') ' + bgCanvasId);
		bgCtx.drawImage(backgroundCanvasCache.get(cacheKey), 0, 0);
		bgCanvas.hasBackground = true; // Mark as drawn
	}

	needleCtx.clearRect(0, 0, width, height);

	// Draw needle base
	needleCtx.beginPath();
	needleCtx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
	const baseGradient = needleCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 6);
	baseGradient.addColorStop(0, '#ffffff');
	baseGradient.addColorStop(1, '#666666');
	needleCtx.fillStyle = baseGradient;
	needleCtx.fill();

	// Draw needle
	const normalizedValue = (value - minValue) / (maxValue - minValue);
	const angle = startAngle + normalizedValue * (endAngle - startAngle);
	const needleLength = radius * 1.0;
	const needleBaseWidth = 8;
	const needleTipWidth = 1;
	needleCtx.save();
	needleCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
	needleCtx.shadowBlur = 8;
	needleCtx.shadowOffsetX = 3;
	needleCtx.shadowOffsetY = 3;
	needleCtx.beginPath();
	needleCtx.translate(centerX, centerY);
	needleCtx.rotate(angle);
	needleCtx.moveTo(0, -needleBaseWidth / 2);
	needleCtx.lineTo(needleLength, -needleTipWidth / 2);
	needleCtx.lineTo(needleLength, needleTipWidth / 2);
	needleCtx.lineTo(0, needleBaseWidth / 2);
	needleCtx.closePath();
	const needleGradient = needleCtx.createLinearGradient(0, -needleBaseWidth / 2, 0, needleBaseWidth / 2);
	needleGradient.addColorStop(0, '#cccccc');
	needleGradient.addColorStop(1, '#666666');
	needleCtx.fillStyle = needleGradient;
	needleCtx.fill();
	needleCtx.restore();

	// Draw value label on needle canvas
	needleCtx.font = '14px Arial';
	needleCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	needleCtx.fillRect(centerX - 30, 0, 60, 24);
	needleCtx.fillStyle = 'white';
	needleCtx.textAlign = 'center';
	needleCtx.textBaseline = 'middle';
	needleCtx.fillText(`${value.toFixed(2)}`, centerX, 12);
}
