# BalancedScoreCard

```html
<!DOCTYPE html>
<html lang="nl">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Balanced Scorecard Meters</title>
	<link href="balanced.css" rel="stylesheet" />
	<script src="balanced.js" defer></script>
	<script src="example.js" defer></script>
</head>
<body>
	<div class="meters" id="metersContainer"></div>
</body>
</html>

```


```javascript
addMeter(50.0, woord, 0.0, 100.0);

addMeter(0.0, woord, -1.0, 1.0);
```

```javascript
updateMeter('meter1', 49.0);

updateMeter('meter2', -0.32);
```
