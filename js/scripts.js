exitfromloop = !1;
var OS_LIST = [],
    cmdList = [],
    OS_ARRAY_WITH_DATA = {};

function getCommands(e = "en") {
    OS_LIST.length = 0, CMD_PAGES_URL = "en" != e ? CMD_PAGES_URL_BASE.replace("/pages/", "/pages." + e + "/") : CMD_PAGES_URL_BASE, $("#osSection .jumbotron").remove(), $.ajax({
        url: CMD_PAGES_URL,
        success: function(e) {
            for (jQuery.each(e, function(e, t) {
                    "dir" == t.type && OS_LIST.push(t)
                }), i = 0; i < OS_LIST.length; i++) os_name = OS_LIST[i].name, template = "<div class='jumbotron'> <p id='osname_" + i + "'></p> <p id='osnameTags_" + i + "'></p> </div>", $("#osSection").append(template), $("#osname_" + i).html(os_name), $.ajax({
                url: CMD_PAGES_URL + os_name,
                async: !1,
                success: function(e) {
                    tempHtml = "<div id='selector' class=''>", temparr = [], jQuery.each(e, function(e, t) {
                        temparr.push(t.name), tempHtml = tempHtml + '<button type="button" class="btn active badge" id="' + t.name + '" onclick="javascript:SearchButtonClicked(\'' + t.name + "');\">" + t.name + "</button>"
                    }), tempHtml += "</div>", OS_ARRAY_WITH_DATA[os_name] = temparr, $("#osnameTags_" + i).html(tempHtml), tempHtml = ""
                }
            })
        },
        error: function(e) {
            e.message && console.log(e.message)
        }
    })
}
CMD_PAGES_URL = "https://api.github.com/repos/tldr-pages/tldr/contents/pages/", CMD_PAGES_URL_BASE = "https://api.github.com/repos/tldr-pages/tldr/contents/pages/", CMD_PAGES_LANGUAGE = "https://api.github.com/repos/tldr-pages/tldr/contents/", $(document).ready(function() {
    getCommands("en");
    var e = document.getElementById("language"),
        t = document.createElement("option");
    t.text = "en", e.add(t), $.ajax({
        url: CMD_PAGES_LANGUAGE,
        success: function(e) {
            jQuery.each(e, function(e, t) {
                if ("dir" == t.type && t.name.split("pages.")[1]) {
                    var o = document.getElementById("language"),
                        a = document.createElement("option");
                    a.text = t.name.split("pages.")[1], o.add(a)
                }
            })
        },
        error: function(e) {
            e.message && console.log(e.message)
        }
    }), SearchButtonClicked = function(e) {
        $("#searchBox").val(e.substring(0, e.lastIndexOf("."))), $("#searchButton").click()
    }, Check = function(e, t) {
        var o, a = 0;
        for (o = 0; o < e.length; o++) e[o] == t && a++;
        return a > 0
    }
}), $("#language").on("change", function(e) {
    getCommands(document.getElementById("language").value)
}), $("#searchButton").on("click", function(e) {
    $("#cmdDetails").html(""), BASE_TLDR_API_URL = "https://api.github.com/repos/tldr-pages/tldr/contents/pages";
    var t = document.getElementById("language");
    for (e.preventDefault(), cmdToSearch = $("#searchBox").val(), i = 0; i < OS_LIST.length; i++) Check(OS_ARRAY_WITH_DATA[OS_LIST[i].name], cmdToSearch + ".md") ? (url = OS_LIST[i].url, os_name = OS_LIST[i].name, "en" != t.value && (url = url.replace("/pages/", "/pages." + t.value + "/")), $.ajax({
        url: url.split("?")[0] + "/" + cmdToSearch + ".md",
        success: function(e) {
            console.log(Base64.decode(e.content)), $("#cmdDetails").html(markdown.toHTML(Base64.decode(e.content))), exitfromloop = !0, $("body").animate({
                scrollTop: 0
            }, "slow")
        },
        error: function(e) {
            console.log("Command not found in --\x3e" + os_name), $("#cmdDetails").html(e.message), $("body").animate({
                scrollTop: 0
            }, "slow")
        }
    })) : ($("#cmdDetails").html("Command help not found... Please select from the tags below."), $("body").animate({
        scrollTop: 0
    }, "slow"))
});
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t, o, a, n, r, c, s, m = "",
            i = 0;
        for (e = Base64._utf8_encode(e); i < e.length;) n = (t = e.charCodeAt(i++)) >> 2, r = (3 & t) << 4 | (o = e.charCodeAt(i++)) >> 4, c = (15 & o) << 2 | (a = e.charCodeAt(i++)) >> 6, s = 63 & a, isNaN(o) ? c = s = 64 : isNaN(a) && (s = 64), m = m + this._keyStr.charAt(n) + this._keyStr.charAt(r) + this._keyStr.charAt(c) + this._keyStr.charAt(s);
        return m
    },
    decode: function(e) {
        var t, o, a, n, r, c, s = "",
            m = 0;
        for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); m < e.length;) t = this._keyStr.indexOf(e.charAt(m++)) << 2 | (n = this._keyStr.indexOf(e.charAt(m++))) >> 4, o = (15 & n) << 4 | (r = this._keyStr.indexOf(e.charAt(m++))) >> 2, a = (3 & r) << 6 | (c = this._keyStr.indexOf(e.charAt(m++))), s += String.fromCharCode(t), 64 != r && (s += String.fromCharCode(o)), 64 != c && (s += String.fromCharCode(a));
        return s = Base64._utf8_decode(s)
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", o = 0; o < e.length; o++) {
            var a = e.charCodeAt(o);
            a < 128 ? t += String.fromCharCode(a) : a > 127 && a < 2048 ? (t += String.fromCharCode(a >> 6 | 192), t += String.fromCharCode(63 & a | 128)) : (t += String.fromCharCode(a >> 12 | 224), t += String.fromCharCode(a >> 6 & 63 | 128), t += String.fromCharCode(63 & a | 128))
        }
        return t
    },
    _utf8_decode: function(e) {
        for (var t = "", o = 0, a = c1 = c2 = 0; o < e.length;)(a = e.charCodeAt(o)) < 128 ? (t += String.fromCharCode(a), o++) : a > 191 && a < 224 ? (c2 = e.charCodeAt(o + 1), t += String.fromCharCode((31 & a) << 6 | 63 & c2), o += 2) : (c2 = e.charCodeAt(o + 1), c3 = e.charCodeAt(o + 2), t += String.fromCharCode((15 & a) << 12 | (63 & c2) << 6 | 63 & c3), o += 3);
        return t
    }
};