
var arr = [
	"algorithm",
	"bandwidth",
	"cache",
	"database",
	"encryption",
	"firewall",
	"gateway",
	"hash",
	"interface",
	"kernel",
	"latency",
	"metadata",
	"network",
	"packet",
	"protocol",
	"query",
	"runtime",
	"server",
	"throughput",
	"virtualization",
	"authentication",
	"bitrate",
	"cloud",
	"compression",
	"container",
	"cpu",
	"datagram",
	"endpoint",
	"firmware",
	"frame",
	"hashrate",
	"hypervisor",
	"index",
	"jitter",
	"load",
	"middleware",
	"port",
	"queue",
	"socket",
	"thread"
];

arr.forEach((woord, index) => 
{
	if (Math.random() < 0.5)
		addMeter(50.0, woord, 0.0, 100.0);
	else
		addMeter(0.0, woord, -1.0, 1.0);
});

function randomUpdateMeter(meterId) 
{
	if (Math.random() < 0.01) 
	{ // 10% chance
		const canvas = document.getElementById(meterId);
		if (!canvas) return;
		const currentValue = parseFloat(canvas.dataset.currentValue) || 0;
		const minValue = parseFloat(canvas.dataset.minValue);
		const maxValue = parseFloat(canvas.dataset.maxValue);
		const change = (Math.random() - 0.5) * (maxValue / 2.0);
		const newValue = Math.max(minValue, Math.min(maxValue, currentValue + change));
		updateMeter(meterId, newValue);
	}
}

function startRandomUpdateTimers() 
{
	for (let i = 0; i < arr.length; i++) 
	{
		setInterval(() => { randomUpdateMeter(`meter${1 + i}`); }, 100);
	}
}
startRandomUpdateTimers();
