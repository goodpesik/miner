jQuery(function() {
	minerGame();
});

function minerGame () {
	var wrapper = jQuery('#wrapper');
	var holder = jQuery('#miner');
	var gameFiled = 10;
	var bombs = 10;
	var gameCell = [];
	var bombsClass = "bomb";
	var hiddenClass = "hide";
	var openClass = "open";
	var flagClass = 'flag';
	var emptyClass = 'empty';
	var mistakeClass = "mistake";
	var disabledClass = 'disabled';
	var largeClass = 'large';
	var elements;
	var bombCount = bombs;
	var title = wrapper.find('.title');
	var countElement = wrapper.find('.bombsLeft');
	var isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	
	gameMode();
	
	function gameMode () {
		var select = wrapper.find('#select');
		var start = wrapper.find('.start');
		select.on('change', function(e){
			var mode = jQuery(this).val();
			switch(mode) {
				case 'small': 
					gameFiled = 10;
					bombs = 10;
					if(holder.hasClass(largeClass)) {
						holder.removeClass(largeClass);
					}
					break;
				case 'medium': 
					gameFiled = 15;
					bombs = 30;
					if (!holder.hasClass(largeClass)) {
						holder.addClass(largeClass);
					}
					break;
				case 'expert': 
					gameFiled = 15;
					bombs = 50;
					if (!holder.hasClass(largeClass)) {
						holder.addClass(largeClass);
					}
					break;
			}
			gameCell = [];
			elements = undefined;
		});
		
		start.on('click',function(e){
			if (holder.find('li').length > 0) {
				holder.find('li').remove();
			}
			e.preventDefault();
			if(holder.hasClass(disabledClass)){
				holder.removeClass(disabledClass);
			}
			title.text('MINER');
			bombCount = bombs;
			countElement.text(bombCount);
			gameInit();
			
		});
	}
	
	function gameInit () {
		generateGameFields();
		generateBombs();
		setNum();
		generateMarkup();
		readyGame();
	}
	
	function generateGameFields () {
		for (var x = 0; x < gameFiled; x++) {
			gameCell[x] = [];
			for (var y = 0; y < gameFiled; y++) {
				var tempObj = {
					bomb: false,
					number: 0,
					flag: false,
					state: false
				};
				gameCell[x][y] = tempObj;
			}
		}
	}
	
	function generateBombs () {
		initRandom();
		
		function initRandom () {
			for (var i = 0; i < bombs; i++) {
				var obj = initRandomCoordinate();
				
				gameCell[obj.x][obj.y].bomb = true;
				gameCell[obj.x][obj.y].number = -1;
			}
		}
		
		function initRandomCoordinate () {
			var x = helperRandom(gameFiled-1);
			var y = helperRandom(gameFiled-1);
			var obj = {};
			
			if (gameCell[x][y].bomb) {
				return initRandomCoordinate();
			}
			
			obj.x = x;
			obj.y = y;
			
			return obj;
		}
	}
	
	
	function setNum () {
		
		findPosition();
		
		function findPosition () {
			for (var x = 0; x < gameFiled; x++) {
				for (var y = 0; y < gameFiled; y++) {
					if(gameCell[x][y].bomb) {
						findNeightbor(x,y,'bombs')
					}
				}
			}
		}
	}
	
	/*
	
		mode = bombs;
		mode = empty;
		
	*/
	
	function findNeightbor (x,y,mode) {
		// onLeft
		checkNum(x-1,y);
		// onRight
		checkNum(x+1,y);
		//onTop
		checkNum(x,y-1);
		//onBottom
		checkNum(x,y+1);
		//onLeftTop
		checkNum(x-1,y-1);
		//onLeftBottom
		checkNum(x-1,y+1);
		//onRightTop
		checkNum(x+1,y-1);
		//onRightBottom
		checkNum(x+1,y+1);
		
		function checkNum(x,y) {
			if (x < 0 || x > gameFiled-1 || y < 0 || y > gameFiled-1) {
				return;
			}
			
			if (mode === 'bombs') {
				if (gameCell[x][y].number > 0) {
					gameCell[x][y].number++;
				} else {
					gameCell[x][y].number = 1;
				}
			}
			
			if (mode === 'empty') {
				if (gameCell[x][y].number === 0 && !gameCell[x][y].state) {
					
					gameCell[x][y].state = 'open';
					
					elements.each(function(){
						var current = jQuery(this);
						var posX = parseFloat(current.attr('x'));
						var posY = parseFloat(current.attr('y'));
						
						if (posX === x && posY === y) {
							current.addClass(openClass);
							findNeightbor (x,y,'empty');
						}
					});
				} else {
					return;
				}
			}
		}
	}
	
	function generateMarkup () {
		
		holder.css({
			"width": gameFiled*50
		});
		
		for (var x = 0; x < gameFiled; x++) {
			for (var y = 0; y < gameFiled; y++) {
				
				var number = gameCell[x][y].number;
				
				if (!gameCell[x][y].bomb) {
					var item = jQuery('<li></li>').text(number).addClass(hiddenClass);
					if(number === 0) {
						item.addClass(emptyClass);
					}
				} else {
					var item = jQuery('<li></li>').addClass(bombsClass).addClass(hiddenClass);
				}
				item.attr('x',x);
				item.attr('y',y);
				holder.append(item);
			}
		}
		elements = holder.find('li');
		countElement.text(bombCount);
	}
	
	function readyGame () {
		if(isTouchDevice) {
			elements.on('tap taphold',function(e){
				console.log(e.type);
				var current = jQuery(this);
				var putFlag = false;
				
				if(e.type === 'taphold') {
					putFlag = true;
				}
				gameHandler(current,putFlag);
			});
		} else {
			elements.on('click ',function(e){
				var current = jQuery(this);
				var putFlag = e.ctrlKey;
				gameHandler(current,putFlag);
			});
		}
		
		
		function gameHandler (current,putFlag) {
			var x = parseFloat(current.attr('x'));
			var y = parseFloat(current.attr('y'));
			if (putFlag) {
				if (current.hasClass(flagClass)) {
					current.removeClass(flagClass);
					bombCount++;
				} else {
					current.addClass(flagClass);
					bombCount--;
					checkFlags();
				}
			} else {
				
				if (current.hasClass(bombsClass)) {
					endGame();
				} else {
					if(!current.hasClass(openClass)) {
						current.addClass(openClass)
						gameCell[x][y].state = 'open';
						toggleEmpty(x,y);
					}
				}
			}
			countElement.text(bombCount);
		}
	}
	
	function toggleEmpty (x,y) {
		findNeightbor(x,y,'empty');
	}
	
	
	function endGame () {
		elements.each(function(){
			var current = jQuery(this);
			
			if(current.hasClass(bombsClass)) {
				current.addClass(openClass);
			}
			if(current.hasClass(flagClass) && !current.hasClass(bombsClass)) {
				current.addClass(mistakeClass);
			}
		});
		
		holder.addClass(disabledClass);
		title.text('GAME OVER :( PRESS F5');
	}
	
	function checkFlags () {
		var counter = 0;
		elements.each(function(){
			var current = jQuery(this);
			if(current.hasClass(bombsClass) && current.hasClass(flagClass)) {
				counter++;
			}
		});
		
		if (counter === bombs) {
			title.text('YOU WON :)');
		}
	}
	
	
	// Helpers
	
	function helperRandom (max) {
		var min = 0;
		return min + Math.floor(Math.random() * (max + 1 - min));
	}
}