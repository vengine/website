if (typeof HTMLElement != "undefined" && !HTMLElement.prototype.insertAdjacentElement) {
	HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
		switch (where) {
		case 'beforeBegin':
			this.parentNode.insertBefore(parsedNode, this);
			break;
		case 'afterBegin':
			this.insertBefore(parsedNode, this.firstChild);
			break;
		case 'beforeEnd':
			this.appendChild(parsedNode);
			break;
		case 'afterEnd':
			if (this.nextSibling) this.parentNode.insertBefore(parsedNode, this.nextSibling);
			else this.parentNode.appendChild(parsedNode);
			break
		}
	}
	HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML = r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where, parsedHTML)
	}
	HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
		var parsedText = document.createTextNode(txtStr);
		this.insertAdjacentElement(where, parsedText)
	}
}
function UTF8UrlEncode(input) {
	var output = "";
	var currentChar = '';
	for (var counter = 0; counter < input.length; counter++) {
		currentChar = input.charCodeAt(counter);
		if ((48 <= currentChar) && (currentChar <= 57)) output = output + input.charAt(counter);
		else if ((65 <= currentChar) && (currentChar <= 90)) output = output + input.charAt(counter);
		else if ((97 <= currentChar) && (currentChar <= 122)) output = output + input.charAt(counter);
		else output = output + UTF8UrlEncodeChar(currentChar)
	}
	return output
}
function UTF8UrlEncodeChar(input) {
	if (input <= 0x7F) return "%" + input.toString(16);
	var leadByte = 0xFF80;
	var hexString = "";
	var leadByteSpace = 5;
	while (input > (Math.pow(2, leadByteSpace + 1) - 1)) {
		hexString = "%" + ((input & 0x3F) | 0x80).toString(16) + hexString;
		leadByte = (leadByte >> 1);
		leadByteSpace--;
		input = input >> 6
	}
	return ("%" + (input | (leadByte & 0xFF)).toString(16) + hexString).toUpperCase()
}
function GSplit(input, start, end) {
	var ret = input.split(start);
	var i;
	for (i = 1; i < ret.length; i++) {
		ret[i] = ret[i].split(end)[0]
	}
	ret.splice(0, 1);
	return ret
}
function SubString(input, length, dot, dotstr) {
	dotstr = dotstr || "бн";
	var newLength = 0;
	var newStr = "";
	var chineseRegex = /[^\x00-\xff]/g;
	var singleChar = "";
	var strLength = input.replace(chineseRegex, "**").length;
	for (var i = 0; i < strLength; i++) {
		singleChar = input.charAt(i).toString();
		if (singleChar.match(chineseRegex) != null) {
			newLength += 2
		} else {
			newLength++
		}
		if (newLength > length) {
			break
		}
		newStr += singleChar
	}
	if (dot && strLength > length) {
		newStr += dotstr
	}
	return newStr
}
function GetCurrentStyle(obj, prop) {
	if (obj.currentStyle) {
		return obj.currentStyle[prop]
	} else if (window.getComputedStyle) {
		propprop = prop.replace(/([A-Z])/g, "-$1");
		propprop = prop.toLowerCase();
		return document.defaultView.getComputedStyle(obj, null)[prop]
	}
	return null
}
function GetColor(color) {
	if (color.indexOf(',') > -1) {
		color = color.replace(/[^0-9,]*/ig, '');
		var colors = color.split(',');
		colors[0] = parseInt(colors[0], 10).toString(16);
		colors[0] = colors[0].length == 2 ? colors[0] : "0" + colors[0];
		colors[1] = parseInt(colors[1], 10).toString(16);
		colors[1] = colors[1].length == 2 ? colors[1] : "0" + colors[1];
		colors[2] = parseInt(colors[2], 10).toString(16);
		colors[2] = colors[2].length == 2 ? colors[2] : "0" + colors[2];
		color = colors[0] + colors[1] + colors[2];
		color = "#" + color
	}
	return color
}
function HTMLEncode(html) {
	var temp = document.createElement("div"); (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
	var output = temp.innerHTML;
	temp = null;
	return output
}
function HTMLDecode(text) {
	var temp = document.createElement("div");
	temp.innerHTML = text;
	var output = temp.innerText || temp.textContent;
	temp = null;
	return output
}
function GetParameter(param) {
	var query = window.location.search;
	var iLen = param.length;
	var iStart = query.indexOf(param);
	if (iStart == -1) return "";
	iStart += iLen + 1;
	var iEnd = query.indexOf("&", iStart);
	if (iEnd == -1) return query.substring(iStart);
	return query.substring(iStart, iEnd);
}
function AddFavorite(title, url) {
	title = typeof(title) == "undefined" ? document.title: title;
	url = typeof(url) == "undefined" ? window.location.href: url;
	if (document.all) window.external.addFavorite(url, title);
	else if (window.sidebar) window.sidebar.addPanel(title, url, "");
}
function AddHomePage(url) {
	url = typeof(url) == "undefined" ? window.location.href : url;
	if (document.all) {
		document.body.style.behavior = 'url(#default#homepage)';
		document.body.setHomePage(url);
	} else if (window.sidebar) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch(e) {
				alert("\u60a8\u7684\u6d4f\u89c8\u5668\u62d2\u7edd\u6b64\u64cd\u4f5c\uff0c\u5982\u679c\u60f3\u542f\u7528\u8be5\u529f\u80fd\uff0c\u8bf7\u5728\u5730\u5740\u680f\u5185\u8f93\u5165\20about\3aconfig\2c\u7136\u540e\u5c06\u9879\20signed.applets.codebase_principal_support\20\u503c\u8be5\u4e3atrue");
			}
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage', url);
	}
}
function FocusPanel(panel, button, interval, easing, callback) {
	if(typeof(panel) == 'undefined' || panel == '') return; else panel = $(panel);
	if(panel.length == 0) return;
	if(typeof(button) == 'undefined' || button == '') button = $(Array()); else button = $(button);
	if(typeof(interval) == 'undefined') interval = -1; else interval = parseInt(interval);
	if(typeof(easing) == 'undefined') easing = 'none';
	var count = panel.css('position', 'relative').show().children().css('position', 'absolute').length;
	var fn = 'TGBUS_UTILITY_PANELCHANGE_FN_' + parseInt(Math.random() * 1000000);
	var cur = -1;
	var width = panel.width();
	var height = panel.height();
	var timer = null;
	panel = panel.children();
	button = button.children();
	window[fn] = function(dir) {
		var next, _easing;
		
		clearTimeout(timer);

		if(dir == 'p') {
			next = cur < 0 ? count - 1 : cur - 1;
			if(easing == 'slideLeft') _easing = 'slideRight';
			else if(easing == 'slideRight') _easing = 'slideLeft';
			else if(easing == 'slideUp') _easing = 'slideDown';
			else if(easing == 'slideDown') _easing = 'slideUp';
		}
		else if(typeof(dir) == 'number') {
			next = parseInt(dir);
			_easing = easing;
		}
		else {
			next = cur > count - 2 ? 0 : cur + 1;
			_easing = easing;
		}
		
		if(cur != next) {
			var curp = panel.eq(cur).stop(true, true);
			var nextp = panel.eq(next).stop(true, true);
			
			if(_easing == 'slideLeft') {
				panel.not(curp).css({'top': 0, 'left': width});
				curp.animate({'top': 0, 'left': -width}, 'fast');
				nextp.animate({'top': 0, 'left': 0}, 'fast');
			}
			else if(_easing == 'slideRight') {
				panel.not(curp).css({'top': 0, 'left': -width});
				curp.animate({'top': 0, 'left': width}, 'fast');
				nextp.animate({'top': 0, 'left': 0}, 'fast');
			}
			else if(_easing == 'slideUp') {
				panel.not(curp).css({'top': height, 'left': 0});
				curp.animate({'top': -height, 'left': 0}, 'fast');
				nextp.animate({'top': 0, 'left': 0}, 'fast');
			}
			else if(_easing == 'slideDown') {
				panel.not(curp).css({'top': -height, 'left': 0});
				curp.animate({'top': height, 'left': 0}, 'fast');
				nextp.animate({'top': 0, 'left': 0}, 'fast');
			}
			else if(_easing == 'fade') {
				panel.not(curp).css({'z-index': 0});
				curp.animate({'z-index': 5, 'opacity': 0});
				nextp.css({'z-index': 10, 'opacity': 0}).animate({'opacity': 1});
			}
			else {
				panel.css({'top': 0, 'left': width});
				nextp.css({'top': 0, 'left': 0});
			}
			
			if(cur < 0) nextp.stop(true, true);
			button.removeClass('cur').eq(next).addClass('cur');	
			cur = next;
		}
		if(interval > 0) timer = setTimeout(fn + '()', interval);
	}
	
	button.each(function(i, n){
		n = $(n);
		n.mouseover(function(){ eval(fn + '(' + i + ')'); });
	});

	eval(fn + '()');
	return fn;
}