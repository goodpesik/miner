function Calc (holder) {
	var output = holder.find('.output');
	var result = 0;
	var currentValue = 0;
	var memory = 0;
	var readyForNewValue = true;
	var action;
	
	output.on('keydown', function(e) {
		return false;
	});
	
	holder.on('click', 'td a', function(e) {
		e.preventDefault();
		keySetup($(e.currentTarget));
	});
	
	function keySetup(key) {
		var value = parseFloat(key.html());
		var keyValue = key.html();
		
		switch (keyValue) {
			case '0': 
				if (output.val() === '0') {
					return;
				}
				// break is ommited
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '.':
				if (output.val() === '0' || readyForNewValue) {
					output.val('');
				}
				
				readyForNewValue = false;
				
				output.val(output.val() + keyValue);
				currentValue = parseFloat(output.val());
				break;

			case '+':
			case '-':
			case '/':
			case '*':
				output.val(calculate());
				action = keyValue;
				readyForNewValue = true;
				break;
			case '=':
				output.val(calculate());
				readyForNewValue = true;
				break;
			case 'C':
				result = undefined;
				currentValue = 0;
				action = null;
				output.val(0);
				readyForNewValue = true;
				break;
			case 'MC':
				memory = 0;
				break;
			case 'MR':
				currentValue = memory;
				output.val(memory);
				readyForNewValue = false;
				break;
			case 'MS':
				memory = parseFloat(output.val());
				action = null;
				break;
		}
	}
	
	function calculate () {
		switch (action) {
			case '+':
				result += currentValue;
				break;
				
			case '-':
				result -= currentValue;
				break;
				
			case '/':
				result /= currentValue;
				break;

			case '*':
				result *= currentValue;
				break;
				
			default:
				result = currentValue;
		}
		
		return result;
	}
}

var calc1 = new Calc($('#calc-1'));


