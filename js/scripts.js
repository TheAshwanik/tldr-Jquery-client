exitfromloop = false;
var OS_LIST = [];
var cmdList = [];
var OS_ARRAY_WITH_DATA = {};
CMD_PAGES_URL = "https://api.github.com/repos/tldr-pages/tldr/contents/pages/";

$(document).ready(function() {

    $.ajax({
        url: CMD_PAGES_URL,
        success: function (data) {

        	jQuery.each( data, function( i, val ) {
			 	
                //console.log(OS_LIST[i].type);
                if (val.type == "dir"){
	               //console.log(val.name);
                   OS_LIST.push(val);
                }
	            //alert(data[i].name);	
			});

            //console.log(OS_LIST);
            

            for (i = 0; i < OS_LIST.length; i++){
                os_name = OS_LIST[i].name;
                template = "<div class='jumbotron'> <p id='osname_" + i + "'></p> <p id='osnameTags_" + i +"'></p> </div>"
                
                $("#osSection").append(template);
                $("#osname_" + i).html(os_name);
                //console.log(os_name);
                $.ajax({
                    url: CMD_PAGES_URL + os_name,
                    async: false,
                    success: function (data) {

                        tempHtml = "<div id='selector' class=''>";
                        temparr = [];
                        jQuery.each( data, function( j, val ) {
                            temparr.push(val.name);                            
                            tempHtml = tempHtml + "<button type=\"button\" class=\"btn active badge\" id=\"" + val.name + "\" onclick=\"javascript:SearchButtonClicked('" + val.name + "');\">" + val.name + "</button>"
                        });

                        tempHtml = tempHtml + "</div>"

                        //$.sessionStorage(os_name, JSON.stringify(temparr));
                        OS_ARRAY_WITH_DATA[os_name] = temparr;
                        $("#osnameTags_" + i ).html(tempHtml);
                        tempHtml = "";
                        //alert(os_name + "----" + temparr);
                        //cmdList.splice(0, cmdList.length);
                    }
                });
            }
        },
        error: function (data) {
            if( data.message ){
                console.log(data.message);
            }

            // ajax error callback
        },
    });

    SearchButtonClicked=function(cmdName) {
        //alert(cmdName);
        $('#searchBox').val(cmdName.substring(0,cmdName.lastIndexOf('.')));
        $('#searchButton').click();

    }

    Check=function(arr, str){
        var i, j;
        var totalmatches = 0;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == str) {
                totalmatches++;
            }
        }
        if (totalmatches > 0) {
            return true;
        } else {
            return false;
        }
    }

});

 

$('#searchButton').on('click', function(e){
    $("#cmdDetails").html("");

	BASE_TLDR_API_URL = "https://api.github.com/repos/tldr-pages/tldr/contents/pages";
    e.preventDefault(); // prevent the default click action
    //alert("hi");
	cmdToSearch	= $('#searchBox').val();
	//alert(cmdName);
	//console.log(OS_LIST);

    // $.each(OS_ARRAY_WITH_DATA, function (index, value) {
    //     alert( index + ' : ' + value );
    // });


 	for (i = 0; i < OS_LIST.length; i++){
      	if(Check(OS_ARRAY_WITH_DATA[OS_LIST[i].name], cmdToSearch +'.md')){
            //console.log(exitfromloop);
        	url = OS_LIST[i].url;
            os_name = OS_LIST[i].name;

    	    $.ajax({
    	        url: (url).split('?')[0] + "/" + cmdToSearch +'.md',
    	        success: function (data) {
    	            //alert('response received');
    	            console.log(Base64.decode(data.content));
    	            $("#cmdDetails").html(markdown.toHTML(Base64.decode(data.content)));
                    exitfromloop = true;
                    $("body").animate({ scrollTop: 0 }, "slow");
    	            // ajax success callback
    	        },
    	        error: function (data) {
    	            console.log('Command not found in -->' + os_name);
                    $("#cmdDetails").html(data.message);
                    $("body").animate({ scrollTop: 0 }, "slow");
    	            // ajax error callback
    	        }
    	    });
    	   }
        else{
            $("#cmdDetails").html("Command help not found... Please select from the tags below.");
            $("body").animate({ scrollTop: 0 }, "slow");
        }
    }
});


/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}