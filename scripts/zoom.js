var Ps;
(function(window, undefined){
    var displayNoneClass = "display-none";
	var isInit = false;
	var ifr;
    var time_hour_data     = [];
    var duration_hour_data = [];
    var duration_min_data  = [];
    var times = ["12:00","12:30","1:00","1:30","2:00","2:30","3:00","3:30","4:00","4:30","5:00","5:30","6:00","6:30","7:00","7:30","8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30"];
    var hours = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
    var minutes = ["0","15","30","45"];
    var elements = { };
    var proxyUrl = "https://proxy-zoom.herokuapp.com/"
    var zoomApiUrl = "https://api.zoom.us/v2/users/";
    var email = '';
    var apiKey = '';
    var secretKey = '';
    var tokenKey = '';
    for (var nTime = 0; nTime < times.length; nTime++) {
        time_hour_data.push({id: nHour, text: times[nTime]});
    }
    for (var nHour = 0; nHour < hours.length; nHour++) {
        duration_hour_data.push({id: hours[nHour], text: hours[nHour]});
    }
    for (var nMin = 0; nMin < minutes.length; nMin++) {
        duration_min_data.push({id: minutes[nMin], text: minutes[nMin]});
    }

    var jsonData = { };

	window.oncontextmenu = function(e)
	{
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
    };

    function showLoader(elements, bShow) {
       switchClass(elements.loader, displayNoneClass, !bShow);
    };
    function switchClass(el, className, add) {
        if (add) {
            el.classList.add(className);
        } else {
            el.classList.remove(className);
        }
    };

	window.Asc.plugin.init = function () {
	    $('#topic-value').val(window.Asc.plugin.info.documentTitle);

        if (!isInit) {
			document.getElementById("iframe_join").innerHTML = "";
			ifr                = document.createElement("iframe");
			ifr.position	   = "fixed";
			ifr.name           = "zoom";
			ifr.id             = "zoom_id";
			ifr.src            = "./index_zoom.html";
			ifr.style.top      = "0px";
			ifr.style.left     = "0px";
			ifr.style.width    = "100%";
			ifr.style.height   = "100%";
			ifr.setAttribute("frameBorder", "0");
			document.getElementById("iframe_join").appendChild(ifr);
			isInit = true;
			ifr.onload = function() {

			}
		}
    };

    window.openMeeting = function(sUrl) {

        document.getElementById("iframe_meeting").innerHTML = "";
            ifr                = document.createElement("iframe");
            ifr.position	   = "fixed";
            ifr.name           = "zoom";
            ifr.id             = "zoom_id";
            ifr.src            = sUrl;
            ifr.style.top      = "0px";
            ifr.style.left     = "0px";
            ifr.style.width    = "100%";
            ifr.style.height   = "100%";
            ifr.setAttribute("frameBorder", "0");
            document.getElementById("iframe_meeting").appendChild(ifr);
            isInit = true;
            ifr.onload = function() {
                $('#iframe_join').toggleClass('display-none');
                $('#iframe_meeting').toggleClass('display-none');
            }

    };
    window.switchForms = function(elmToHide, elmToShow) {
        $(elmToHide).toggleClass('display-none');
        $(elmToShow).toggleClass('display-none');
    };

	$(document).ready(function () {
	    elements = {
            loader: document.getElementById("loader-container"),
		};

	    $('input[name="date"]').daterangepicker({
            singleDatePicker: true,
        });
        $('#time-hour').select2({
            data: time_hour_data
        });
        $('#duration-hour').select2({
            data: duration_hour_data
        });
        $('#duration-min').select2({
            data: duration_min_data
        });
        $('.select_example').select2({
			minimumResultsForSearch: Infinity,
			width : 'calc(100% - 24px)',
		});
		$('.select_example.group').select2({
			minimumResultsForSearch: Infinity,
			width : 'calc(50% - 20px)',
		});
		$('.select_example.duration').select2({
			minimumResultsForSearch: Infinity,
			width : '100%',
		});

        $('#timezone').select2({
            minimumResultsForSearch: 0,
            width : 'calc(100% - 24px)'
        });

		$('#adv_settings').click(function() {
		    $('#settings_wrapper').find('.settings_group').slideToggle('fast', function() { updateScroll(); });
		    $('#settings_wrapper').find(".arrow").toggleClass("transform");
		});

        $('#saveConfigBtn').click(function() {
            SaveConfiguration(true);
        });
        $('#topic-value').focus(function(){
            if(this.value !== this.defaultValue){
                this.select();
            }
        });
        $('#emailField').focus(function() {
            if(this.value !== this.defaultValue){
                this.select();
            }
        });
        $('#apiKeyField').focus(function() {
            if(this.value !== this.defaultValue){
                this.select();
            }
        });
        $('#apiKeyField').change(function() {
            if ($(this).hasClass('error_api'))
                $(this).toggleClass('error_api');
        });
        $('#secretKeyField').focus(function() {
            if(this.value !== this.defaultValue){
                this.select();
            }
        });
        $('#secretKeyField').change(function() {
            if ($(this).hasClass('error_api'))
                $(this).toggleClass('error_api');
        });
        $('#tokenKeyField').focus(function() {
            if(this.value !== this.defaultValue){
                this.select();
            }
        });
        $('#tokenKeyField').change(function() {
            if ($(this).hasClass('error_api'))
                $(this).toggleClass('error_api');
        });
        $('#reconf').click(function() {
            $('#scheduler-container').toggleClass('display-none');
            $('#configState').toggleClass('display-none');
        });
        $('#switch').click(function() {
            $('#scheduler-container').toggleClass('display-none');
            $('#iframe_join').toggleClass('display-none');
        });
        $('#schedule_meeting').click(function() {
            ScheduleMeeting();
        });
		Ps = new PerfectScrollbar("#scheduler-container", {suppressScrollX: true});

        document.getElementById('emailField').value = localStorage.getItem($('#emailField').attr("data-id")) || "";
		document.getElementById('apiKeyField').value = localStorage.getItem($('#apiKeyField').attr("data-id")) || "";
		document.getElementById('secretKeyField').value = localStorage.getItem($('#secretKeyField').attr("data-id")) || "";
		document.getElementById('tokenKeyField').value = localStorage.getItem($('#tokenKeyField').attr("data-id")) || "";
		SaveConfiguration(false);
    });

    async function IsValidConfigData() {
        showLoader(elements, true);
        var url =
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokenKey,
            },
            dataType: 'json',
            json: true,
            data: JSON.stringify(jsonData),
            url: proxyUrl + zoomApiUrl + email
        }).success(function (oResponse) {
            localStorage.setItem($('#emailField').attr("data-id"), email);
            localStorage.setItem($('#apiKeyField').attr("data-id"), apiKey);
            localStorage.setItem($('#secretKeyField').attr("data-id"), secretKey);
            localStorage.setItem($('#tokenKeyField').attr("data-id"), tokenKey);

            $('#configState').toggleClass('display-none');
            $('#scheduler-container').toggleClass('display-none');

            showLoader(elements, false);
        }).error(function(e){
            alert('Check your details');
            showLoader(elements, false);
        });
    };

    async function SaveConfiguration(bShowError) {
        if (!IsEmptyFields(bShowError)) {
            email = $('#emailField').val().trim();
            apiKey = $('#apiKeyField').val().trim();
            secretKey = $('#secretKeyField').val().trim();
            tokenKey = $('#tokenKeyField').val().trim();

            await IsValidConfigData();
        }
    };
    function IsEmptyFields(bShowError) {
        var isEmpty = null;

        if ($('#emailField').val() === '') {
            isEmpty = true;

            if (bShowError)
                if (!$('#emailField').hasClass('error_api'))
                    $('#emailField').toggleClass('error_api');
        }
        else {
            isEmpty = false;

            if (bShowError)
                if ($('#emailField').hasClass('error_api'))
                    $('#emailField').toggleClass('error_api');
        }
        if ($('#apiKeyField').val() === '') {
            isEmpty = true;

            if (bShowError)
                if (!$('#apiKeyField').hasClass('error_api'))
                    $('#apiKeyField').toggleClass('error_api');
        }
        else {
            isEmpty = false;

            if (bShowError)
                if ($('#apiKeyField').hasClass('error_api'))
                    $('#apiKeyField').toggleClass('error_api');
        }

        if ($('#secretKeyField').val() === '') {
            isEmpty = isEmpty && true;

            if (bShowError)
                if (!$('#secretKeyField').hasClass('error_api'))
                    $('#secretKeyField').toggleClass('error_api');
        }
        else {
            isEmpty = isEmpty && false;

            if (bShowError)
                if ($('#secretKeyField').hasClass('error_api'))
                    $('#secretKeyField').toggleClass('error_api');
        }

        if ($('#tokenKeyField').val() === '') {
            isEmpty = isEmpty && true;

            if (bShowError)
                if (!$('#tokenKeyField').hasClass('error_api'))
                    $('#tokenKeyField').toggleClass('error_api');
        }
        else {
            isEmpty = isEmpty && false;

            if (bShowError)
                if ($('#tokenKeyField').hasClass('error_api'))
                    $('#tokenKeyField').toggleClass('error_api');
        }

        return isEmpty;
    }
    function ScheduleMeeting() {
        showLoader(elements, true);

        // getting parameters
        var sTopic         = $('#topic-value').val();
        var meetingType    = 2;
        var sDate          = '';
        var sTime          = $('#time-hour').val();
        var sAmPmTime      = $('#time-am-pm').val();
        var sDurationHour  = $('#duration-hour').val();
        var sDurationMin   = $('#duration-min').val();
        var sMeetPasswd    = $('#password').val();
        var bPersonalId    = ('true' === $("input[name=meeting-id]:checked").val());
        var bWaitingRoom   = document.getElementById("is_waiting_room").checked;
        var sTimeZone      = $('#timezone').val();
        var sRecurringConf = null;
        if ($('#recurring-conf').val() !== 'never') {
            meetingType = 8;
            var nType = null;
            switch ($('#recurring-conf').val()) {
                case 'daily':
                    nType = 1;
                    break;
                case 'weekly':
                    nType = 2;
                    break;
                case 'monthly':
                    nType = 3;
                    break;
            }
            sRecurringConf = {
                "type" : nType
            }
        }

        // bringing the date to the required format
        var sResultTime    = '';
        var arrSplittedDate = $('#date-value').val().split('/');
        sDate += arrSplittedDate[2] + '-' + arrSplittedDate[0] + '-' + arrSplittedDate[1];

        if (sAmPmTime == 'pm') {
            var arrSplittedTime = sTime.split(':');
            sTime = String(Number(arrSplittedTime[0]) + 12) + ':' + arrSplittedTime[1];
        }
        sResultTime = sDate + 'T' + sTime + ':00';

        // calc duration in minutes
        var sResultDuration = String(Number(sDurationHour) * 60 + Number(sDurationMin));

        // filling the jsonData for request
        var meetingSettings = {
            "use_pmi" : bPersonalId,
            "waiting_room" : bWaitingRoom
        }
        jsonData["topic"]        = sTopic;
        jsonData["type"]         = meetingType;
        jsonData["start_time"]   = sResultTime;
        jsonData["duration"]     = sResultDuration;
        jsonData["settings"]     = meetingSettings;
        if (sMeetPasswd !== "")
            jsonData["password"] = sMeetPasswd;
        jsonData["timezone"]     = sTimeZone;
        jsonData["recurrence"]   = sRecurringConf;

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + tokenKey,
            },
            dataType: 'json',
            json: true,
            data: JSON.stringify(jsonData),
            url: proxyUrl + zoomApiUrl + email + '/meetings'
        }).success(function (oResponse) {
            var sTopic    = 'Topic: ' + oResponse.topic;
            var sTime     = 'Time: ' + $('#date-value').val() + ' ' + $('#time-hour').val() + ' ' + $('#time-am-pm').val().toUpperCase() + ' ' + jsonData["timezone"];
            var sJoinUrl  = 'Join URL: ' + oResponse.join_url;
            var sConfId   = 'Conference ID: ' + oResponse.id;
            var sPassword = 'Password: ' + oResponse.password;
            var sResult   = sTopic + '\r' + sTime + '\r' + sJoinUrl +'\r' + sConfId + '\r' + sPassword + '\r';

            Asc.scope.meeting_info = sResult;
            /*window.Asc.plugin.callCommand(function() {
                Api.CoAuthoringChatSendMessage(Asc.scope.meeting_info);
            }, false, true, function(isTrue) {
                if (isTrue)
                    alert('Meeting was created');
                else
                    alert('Meeting was create, please update SDK for checking info about created meeting in chat.');
            });*/
            window.Asc.plugin.executeMethod('CoAuthoringChatSendMessage', Asc.scope.meeting_info, function(isTrue) {
                if (isTrue)
                    alert('Meeting was created');
                else
                    alert('Meeting was create, please update SDK for checking info about created meeting in chat.');
            });
            showLoader(elements, false);
        }).error(function(e) {
            alert('Meeting was not created');
            showLoader(elements, false);
        });
    };
    window.Asc.plugin.button = function(id)
	{
		this.executeCommand("close", "");
	};

    function updateScroll()
	{
		Ps && Ps.update();
	};

	window.Asc.plugin.onExternalMouseUp = function()
	{
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0,
			false, false, false, false, 0, null);

		document.dispatchEvent(evt);
		$('.select_example').select2({
			minimumResultsForSearch: Infinity,
			width : 'calc(100% - 24px)',
		});
		$('.select_example.group').select2({
			minimumResultsForSearch: Infinity,
			width : 'calc(50% - 20px)',
		});
		$('.select_example.duration').select2({
			minimumResultsForSearch: Infinity,
			width : '100%',
		});
		$('#timezone').select2({
            minimumResultsForSearch: 0,
            width : 'calc(100% - 24px)'
        });
	};

})(window, undefined);
