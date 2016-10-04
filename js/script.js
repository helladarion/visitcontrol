//Global Variables
	var clientSelected = 		null;
	var visitSelected = 		null;
	var $SelectedHour =			0;
	var $SelectedMinute =		0;
	var startInMinutes = 		0;
	var finishInMinutes = 		0;
	var $startH = 				0;
	var $startM = 				0;
	var $finishH = 				0;
	var $finishM = 				0;
	var $employee =				null;
	var d = 					new Date();
	var totalHoursVisited = 	0;
	var loginTime = 			0;
	// Local variable to single use
	var startTime = 			true;
	var showingAdmin = 			true;
	var showError = 			true; // to show the error msg once
	var clickReload = 			true;


// New Global Variables
	var allClients 	= [];
	var allVisits 	= [];
	var allEmployee = [];

//Starting the load of the document and the app
$(function(){
	loadEverything();
});

var loadEverything = function(){ // Load every element in the right order
	hideElements();
	$('#app').fadeIn().html('Loading Data'); //Show a message on the screen
	getEmployee(); // Load Employee database
	getClients();  // Load Clients database
	setTimeout(function(){ 	// wait the clients database to load
		getVisits();	 	// Start loading Visits Database
		setTimeout(function(){
			employeeLogin(); // Show the Login screen
		},500);
		$('#app').fadeOut(); // Hides the load message
	},1500);
};

var hideElements = function(){
	// Hiding panels
	$('.container').hide();
	$('#login').hide();
	$('.right').hide();
	$('#app').hide();
	console.log('Document loaded');
};

var reloadDataBase = function(){
	// cleaning the array objects
	allClients 	= [];
	allVisits 	= [];
	// allEmployee = [];
	clickReload = 			true;
	showingAdmin = 			true;
	// hideElements();
	$('#app').fadeIn().html('Loading Data');
	// getEmployee();
	getClients();
	setTimeout(function(){
		getVisits();	
		setTimeout(function(){
			showClients();	
		},500);
		$('#app').fadeOut();
	},1500);
};

// functions to load the data from database
var getClients = function(){
	$.ajax({ //Getting clients Information
		type: 'GET',
		url: 'http://minerafa.pointto.us:1113/api/clients',
		success: function(data, status, xhr) {	
			$.each(data,function(i,client){
				// Insert all Clients inside the array allClients
				allClients.push(client);
			});
			console.log("all clients loaded");
		},
		error: function(event, xhr, options, exc) {
			console.log('Event ', event);
			console.log('xhr ', xhr);
			console.log('options ', options);
			console.log('exc ', exc);
		},
	});	
};

var getVisits = function(){
	$.ajax({ // Getting visits Information
			type: 'GET',
			url: 'http://minerafa.pointto.us:1113/api/visits',
			success: function(data, status, xhr) {
				$.each(data,function(i,visits){
				// Insert all visits inside the array allVisits
					allVisits.push(visits);
				});
				console.log("all visits loaded");
			},
			error: function(event, xhr, options, exc) {
				console.log('Event ', event);
				console.log('xhr ', xhr);
				console.log('options ', options);
				console.log('exc ', exc);
			},
		});
};

var getEmployee = function(){
	$.ajax({ // Getting visits Information
			type: 'GET',
			url: 'http://minerafa.pointto.us:1113/api/employee',
			success: function(data, status, xhr) {
				$.each(data,function(i,employee){
				// Insert all visits inside the array allVisits
					allEmployee.push(employee);
				});
				console.log("all employee loaded");
			},
			error: function(event, xhr, options, exc) {
				console.log('Event ', event);
				console.log('xhr ', xhr);
				console.log('options ', options);
				console.log('exc ', exc);
			},
		});
};

var findEmployee = function(ID){
	var employeeName = null;
	allEmployee.forEach(function(employee, key){
		if (employee._id===ID){
			employeeName = employee.name;
		}
	});
	return employeeName;
};

var clearVariables = function(){
	// Cleaning variables
	clientSelected = 		null;
	visitSelected = 		null;
	$SelectedHour =			0;
	$SelectedMinute =		0;
	startInMinutes = 		0;
	finishInMinutes = 		0;
	$startH = 				0;
	$startM = 				0;
	$finishH = 				0;
	$finishM = 				0;
	totalHoursVisited = 	0;
	startTime = 			true;
	// showingAdmin = 			true;
	showError = 			true;
};

// convert minutes to hours
var convertMin = function(minutes) {
	var hours = Math.floor(minutes / 60); // Get only the decimal value
	var remainMinutes = ((minutes / 60) % 1) * 60; // Use the rest of the division to transform in minutes
	var min = Math.floor(remainMinutes); // Include one extra zero on numbers that are smaller than 10
	return hours+':'+ (min < 10 ? '0'+ min : min);
};

// convert hours to minutes
var convertHour = function(hour, minute) {
	return ((parseInt(hour) * 60) + parseInt(minute));
};

// Add data to employee database
var recordEmployeeData = function(data, ID) {
	$.ajax({
	    type: "PUT",
	    contentType: "application/json; charset=utf-8",
	    url: 'http://minerafa.pointto.us:1113/api/employee/'+ID,
	    data: JSON.stringify(data),
	    dataType: "json",
	    success: function (msg) {
	        console.log('Logged');
	        // console.log(employee.accessLevel);
	        // console.log(this.data);
	        // console.log(this.url);
	    },
	    error: function (err, status, xhr){
	        console.log('Error', err);
	        console.log('status', status);
	        console.log('xhr', xhr);
	    }
	});
};

var employeeLogin = function(){
	$('#login').show();
	$('#logbtn').on('click', function(){
		var $userName = 			$('#uname'); // Takes the username
		var $password = 			$('#pswd');  // Takes the password
		// verify if the password is correct
		allEmployee.forEach(function(employee, key){ // search for the username and password on the employeee database
			if ($userName.val() === employee.username && $password.val() === employee.password) {
				console.log("access granted");
				$employee = employee; // Attribuing the value of the logged employee to the global variable $employee
				// Update Last Login
				var loginTimeMin=d.getDate() +'/'+d.getMonth()+'/'+d.getFullYear()+'-'+d.getHours()+':'+d.getMinutes();
				loginTime=d.getDate() +'/'+d.getMonth()+'/'+d.getFullYear(); // this variable will show the date
				recordEmployeeData({'lastLogin': loginTimeMin }, $employee._id);
				// console.log($employee.name);
				$('#login').hide(); // Hide the login 
				// $('#app').show(); 	// Show the rest of the app
				// console.log($employee.accessLevel);
				showClients();
				//Show user and data on the right side
				$('.right').show().html('<strong>'+$employee.name+'</strong><br>'+ loginTime);
				backButton();
				return false;	
			} else {
				if (showError) {
					$('#login').append('<span style="color: red">Nome de usuario ou senha erradas</span>');
					// console.log('Wrong Username or Password');
					showError = false;
				}
			}
		});
	});
};

var backButton = function(){
	// Back button on the title
	$('.left h2').on('click', function(){
		showClients();
		if ($('#admPanel').length < 1){
			createClients();
		}	
	});
};

var showClients = function() {
	// Cleaning variables
	// clearVariables();
	//Showing the header
	$('#app').empty();
	$('#app').html('<h3>Selectione o cliente</h3><ul id="cliList"></ul>'); // Loading Title
	$('#app').fadeIn();
	// Iterate between allClients
	allClients.forEach(function(client,keyC){ // get all clients and their details about visits
		// console.log(client, key);
		$('#cliList').append('<li data-cli='+keyC+'>'+client.name+' <span data-addCli='+keyC+'><strong>+</strong></span><ul id='+keyC+'>'+
			'<li>Horas contratadas: '+convertMin(client.hours)+'</li>'+
			'<li>Visitas projetadas por Mês: '+client.numVisits+'</li>'+
			'</ul></li>'); // Client and Remaining time
		$('#cliList ul').hide();
		//calculating all visits made
		$('#'+keyC).append('<ol></ol>');
		allVisits.forEach(function(visit,keyV){ // Get all visits of this client
			if (visit.month === d.getMonth() && visit.clientID === client._id){
				$('#'+keyC+' ol').append('<li>Visita: '+visit.day+'/'+visit.month+'/'+visit.year+' - lasts: '+convertMin((visit.finishHour-visit.startHour))+' by '+findEmployee(visit.employee)+'</li>');
				startInMinutes += visit.startHour;
				finishInMinutes += visit.finishHour;
				return false;
			}
		});

		$('#'+keyC).append('<li>Total de horas trabalhadas este mes: '+convertMin((finishInMinutes-startInMinutes))+'</li>');
		$('#'+keyC).append('<li>Horas restantes no mes: <strong>'+convertMin((client.hours-(finishInMinutes-startInMinutes)))+'</strong></li>');
		var totalVisits = (client.hours-(finishInMinutes-startInMinutes));
		if (totalVisits / client.hours < 0.31 ) {
			$('li[data-cli='+keyC+']').addClass("closeToFinish");
			$('#'+keyC).addClass('colorCommon');
		}
		clearVariables();
		return false;
	});
	// 
	$('li[data-cli]').on('click', function(){
		// $(this).fadeOut(500);
		var clientClicked = $(this).attr('data-cli');
		$('#'+clientClicked).fadeToggle();		
		// hourControl(clientSelected);
		// console.log('You clicked on ' + clientClicked);
		console.log('Outside of the function',clientSelected);
	});
	// add newClient
	$('span[data-addCli]').on('click', function(){
		var clientAddSelected = $(this).attr('data-addCli');
		clientSelected = allClients[clientAddSelected];
		showClientData(clientSelected);
	});
};

var createClients = function(){
	// User with privileges to create new clients
	if ( $employee.accessLevel === 0) {
		// console.log($employee.accessLevel);
		
		// if (showingAdmin) { // avoiding create multiple admin clients when click on the title
		console.log("second record");
		if ($('#admCli').length < 1){ // To avoid create twice the pannel
			// console.log("Created AdmCli");
			$('.right').append('<br><strong><span id="admCli"></strong></span>');	
			$('#admCli').empty();
			$('#admCli').append("Admin Clients");
		}

		$('#admCli').on('click', function(){
			// console.log($('#admPanel').length);
			if ($('#admPanel').length < 1){
				// console.log("Need to be created");
				if (showingAdmin) {
					$('#app').append('<div id="admPanel"></div>');
					$('#admPanel').empty();
					// console.log("After "+$('#admPanel').length);
				
					$('#admPanel').show();
					showingAdmin = false;
				
					if($('#admPanel h3').length < 1){
						$('#admPanel').html('<h3>Create a new Client</h3><ul id="cliList"></ul>');
						// console.log("Adm PANNEL TEXT CREATED "+$('#admPanel h3').length);
					}
				}

				$('#admPanel h3').on('click', function(){
					$('.container').empty();
					loadContainer();
					$('.cliCadField').val("");
					$('#cliName').focus();
					$('#numContract').val(allClients.length+1);
					// console.log("inside admpanel2");
				});
			}
		});
	}
};

var loadContainer = function(){
	$('.container').show().html('<label>Numero do Contrato:</label>'+
	'<input type="text" name="numContract" id="numContract" class="cliCadField"><br />'+
	'<label>Nome do Cliente:</label>'+
	'<input type="text" name="cliName" id="cliName" class="cliCadField"><br />'+
	'<label>Horas Contratadas:</label>'+
	'<input type="text" name="cliHours" id="cliHours" class="cliCadField"><br />'+
	'<label>Numero de Visitas por mes:</label>'+
	'<input type="text" name="cliVisits" id="cliVisits" class="cliCadField"><br />'+
	'<p><button id="cadNewCli">Cadastrar</button></p>');
	$('#cadNewCli').on('click', function(){
		recordClients();
	});	
};

var recordClients = function(){
	var newClientObj = null;
	// console.log("before "+newClientObj);
	var clientHours = $('#cliHours').val()*60; // Making hours in minutes

	// Creating object to insert
	newClientObj = {
		name: 				$('#cliName').val(),
		hours: 				clientHours, 
		numVisits: 			parseInt($('#cliVisits').val()), 
		contractNumber: 	$('#numContract').val()  
	};
	$.ajax({
	    type: "POST",
	    contentType: "application/json; charset=utf-8",
	    url: 'http://minerafa.pointto.us:1113/api/clients/',
	    data: JSON.stringify(newClientObj),
	    dataType: "json",
	    success: function (msg) {
	        // console.log('Success');
	        $('.cliCadField').val("");
	        $('.container p').append('<span style="color: red:>Novo cliente Cadastrado'+ newClientObj.name+ '</span>');
	        $('.container').fadeOut(1000);
	        newClientObj = null;
	        reloadDataBase();
	        // console.log(this.data);
	        // console.log(this.url);
	        return false;
	    },
	    error: function (err, status, xhr){
	        console.log('Error', err);
	        console.log('status', status);
	        console.log('xhr', xhr);
	        return false;
	    }
	});
};

var showClientData = function(clientSelected) {
	// Show data in the Screen
	$('#app').hide();
	$('#app').html('<h3>'+clientSelected.name+'</h3>');
	$('#app').fadeIn(1000);
	$('#app').append('<p>Horas contratadas: '+convertMin(clientSelected.hours)+'</p>');
	$('#app').append('<p>Horas calculadas por visita: '+ convertMin((clientSelected.hours / clientSelected.numVisits)));
	// $('#app').append('<p>Horas consumidas este mês: '+ convertMin(totalHoursVisited));	
	$('#app').append('<p>Horas restantes no mês: <strong>'+convertMin(clientSelected.hours - totalHoursVisited)+'</strong></p>');
	// Create new entry data
	$('#app').append('<div id="msgTime"></div>');
	$('#msgTime').html('<h3>Selectione o horario de entrada:</h3>');
	buildHour();
	

	$('#selHour').on('change',function(){
		$SelectedHour = $(this).val();
	});

	$('#selMin').on('change',function(){
		$SelectedMinute = $(this).val();
	});
	// console.log(startTime);

	$('#addTime').on('click', function() {
		if (startTime) {
			$startH=$SelectedHour;
			$startM=$SelectedMinute;
			$('#msgTime').append('<br>Hora de entrada: '+ $startH+':'+ ($startM < 10 ? '0'+ $startM : $startM) +'<br>');
			$('#msgTime').append('<h3>Selectione o horario de saída:</h3>');
			startInMinutes = convertHour($startH, $startM);
			startTime = false;
		} else {
			$finishH=$SelectedHour;
			$finishM=$SelectedMinute;
			$('#msgTime').append('<br>Hora de saída: '+ $finishH+':'+ ($finishM < 10 ? '0'+ $finishM : $finishM) +'<br>');
			finishInMinutes = convertHour($finishH, $finishM);

			var totalTime = (((parseInt($finishH) * 60) + parseInt($finishM))-((parseInt($startH) * 60) + parseInt($startM)));
			// console.log(totalTime);
			var timeHour=totalTime/60;
			// console.log(Math.floor(timeHour));
			// console.log((timeHour % 1)*60);
			$('#selTime').fadeOut(1000);
			// console.log(totalTime);
			$('#msgTime').append('<h3>Total de horas trabalhadas: <strong>'+convertMin(totalTime)+'</strong></h3>');
			// Recording the data on the database
			var visitData = {
				clientID: 		clientSelected._id,
				employee: 		$employee._id,
				month: 			d.getMonth(),
				day: 			d.getDate(),
				year: 			d.getFullYear(),
				startHour: 		startInMinutes, 	
				finishHour: 	finishInMinutes  	
			};
			// console.log(visitData);

			$.ajax({
			    type: "POST",
			    contentType: "application/json; charset=utf-8",
			    url: 'http://minerafa.pointto.us:1113/api/visits',
			    data: JSON.stringify(visitData),
			    dataType: "json",
			    success: function (msg) {
			        console.log('Success');
			        $('#msgTime').append('Valores cadastrados com sucesso, muito obrigado ');
			        // console.log(this.data);
			        // console.log(this.url);
			        setTimeout(function(){
			        	reloadDataBase();
			        }, 1000);
			    },
			    error: function (err, status, xhr){
			        console.log('Error', err);
			        console.log('status', status);
			        console.log('xhr', xhr);
			    }
			});

		}
	});
};

var buildHour = function(){ // Hour Selector Constructor
	// Build Hour DropdownList
	$('#app').append('<div id="selTime">');
	$('#selTime').append('<select id="selHour">');
	for (var h=0; h <= 23; h++) {
		$('#selHour').append('<option>'+h+'</option>');	
	}
	$('#selTime').append('</select>');

	//Build Minute DropdownList
	$('#selTime').append('<select id="selMin">');
	for (var m=0; m < 60; m+=5) {
		$('#selMin').append('<option>'+m+'</option>');	
	}
	$('#selTime').append('</select><button id="addTime">Add</button></div>');
};

