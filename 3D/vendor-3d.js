<<<<<<< HEAD
function Rainbow(){function r(r){if(r.length<2)throw new Error("Rainbow must have two or more colours.");var f=(e-n)/(r.length-1),i=new ColourGradient;i.setGradient(r[0],r[1]),i.setNumberRange(n,n+f),t=[i];for(var u=1;u<r.length-1;u++){var a=new ColourGradient;a.setGradient(r[u],r[u+1]),a.setNumberRange(n+f*u,n+f*(u+1)),t[u]=a}return o=r,this}var t=null,n=0,e=100,o=["ff0000","ffff00","00ff00","0000ff"];r(o),this.setColors=this.setColours,this.setSpectrum=function(){return r(arguments),this},this.setSpectrumByArray=function(t){return r(t),this},this.colourAt=function(r){if(isNaN(r))throw new TypeError(r+" is not a number");if(1===t.length)return t[0].colourAt(r);var o=(e-n)/t.length,f=Math.min(Math.floor((Math.max(r,n)-n)/o),t.length-1);return t[f].colourAt(r)},this.colorAt=this.colourAt,this.setNumberRange=function(t,f){if(!(f>t))throw new RangeError("maxNumber ("+f+") is not greater than minNumber ("+t+")");return n=t,e=f,r(o),this}}function ColourGradient(){function r(r,t,n){var e=r;f>e&&(e=f),e>i&&(e=i);var o=i-f,u=parseInt(t,16),a=parseInt(n,16),s=(a-u)/o,h=Math.round(s*(e-f)+u);return formatHex(h.toString(16))}function t(r){var t=/^#?[0-9a-fA-F]{6}$/i;return t.test(r)}function n(r){if(t(r))return r.substring(r.length-6,r.length);for(var n=[["red","ff0000"],["lime","00ff00"],["blue","0000ff"],["yellow","ffff00"],["orange","ff8000"],["aqua","00ffff"],["fuchsia","ff00ff"],["white","ffffff"],["black","000000"],["gray","808080"],["grey","808080"],["silver","c0c0c0"],["maroon","800000"],["olive","808000"],["green","008000"],["teal","008080"],["navy","000080"],["purple","800080"]],e=0;e<n.length;e++)if(r.toLowerCase()===n[e][0])return n[e][1];throw new Error(r+" is not a valid colour.")}var e="ff0000",o="0000ff",f=0,i=100;this.setGradient=function(r,t){e=n(r),o=n(t)},this.setNumberRange=function(r,t){if(!(t>r))throw new RangeError("maxNumber ("+t+") is not greater than minNumber ("+r+")");f=r,i=t},this.colourAt=function(t){return r(t,e.substring(0,2),o.substring(0,2))+r(t,e.substring(2,4),o.substring(2,4))+r(t,e.substring(4,6),o.substring(4,6))},formatHex=function(r){return 1===r.length?"0"+r:r}}
=======
/*
RainbowVis-JS 
Released under Eclipse Public License - v 1.0
*/

function Rainbow()
{
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
			return this;
		}
	}

	this.setColors = this.setColours;

	this.setSpectrum = function () 
	{
		setColours(arguments);
		return this;
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
        return this;
	}

	this.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
			return gradients[index].colourAt(number);
		}
	}

	this.colorAt = this.colourAt;

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}
}

function ColourGradient() 
{
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
			+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
			+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
	}
	
	function calcHex(number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	formatHex = function (hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-fA-F]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var colourNames =
			[
				['red', 'ff0000'],
				['lime', '00ff00'],
				['blue', '0000ff'],
				['yellow', 'ffff00'],
				['orange', 'ff8000'],
				['aqua', '00ffff'],
				['fuchsia', 'ff00ff'],
				['white', 'ffffff'],
				['black', '000000'],
				['gray', '808080'],
				['grey', '808080'],
				['silver', 'c0c0c0'],
				['maroon', '800000'],
				['olive', '808000'],
				['green', '008000'],
				['teal', '008080'],
				['navy', '000080'],
				['purple', '800080']
			];
			for (var i = 0; i < colourNames.length; i++) {
				if (string.toLowerCase() === colourNames[i][0]) {
					return colourNames[i][1];
				}
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}
}

;
>>>>>>> c04dd00b6aa44bdfe5a8fc8010f6a82db8092183
