//= require modernizr.js
//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require swfobject.js
//= require jquery.uploadify.min
//= require jquery-ui.min.js
//= require jquery.ui.nestedSortable

function goTo(event,url) {
	if (!$(event.target).hasClass("dont-move")) {
		window.location = url;
	};
};

$(document).ready(function(){
  $(".redactor_toolbar a").attr("tabindex", "-1");
  var sliderHtml = $("td textarea").clone().text();
  $(".slider_txt").append(sliderHtml);

  $(".prev_button input[type=submit]").click(function(e){
    e.preventDefault();
    $("#previews").toggleClass('show');
  });
  $(".date_params_link").click(function(e){
    e.preventDefault();
    $("tr.date_params").toggleClass("show");
  });
});



var lightBox;

function remove_fields(link) {
  $(link).prev("input[type=hidden]").val("1");
  $(link).closest("div").hide();
}

function remove_fields_gal(link) {
  $(link).prev("input[type=hidden]").val("1");
  hideElem($(link).closest("tr"));
  function hideElem(el) {
    el.hide();
    el.hasClass("bot") ? el.hide() : hideElem(el.next("tr"));
  };
}

function add_fields(link, association, content) {
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_" + association, "g")
  var innerPrint = $(link).before(content.replace(regexp, new_id));
}

function add_fields_gal(link, association, content) {
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_" + association, "g")
  var innerPrint = $(link).closest("tfoot").prev("tbody").append(content.replace(regexp, new_id));
}

function selectCheckbox(el) {
  el.checked ? $(el).closest("tr").addClass("selected") : $(el).closest("tr").removeClass("selected");
}

function selectLang(el) {
	var show_lang = el.removeClass("selected").attr("class");
  	$("tr."+show_lang).show();
  	var hide_lang = el.siblings("a").removeClass("selected").attr("class");
  	$("tr."+hide_lang).hide();
  	el.addClass("selected");
}

crop = {
	createPreview: function(el){
		var b = $("#mini_preview div");
		var i = b.find("img");
		var params = $.param({
			ww:parseInt(i.width()),
			x:Math.abs(parseInt(i.css("margin-left"))),
			y:Math.abs(parseInt(i.css("margin-top"))),
			w:parseInt(b.width()),
			h:parseInt(b.height())
		});
		var f =$(el).closest("form");
		f.get(0).action += "?" + params;
		f.submit();		
	},
	initCrop : function(){
		return $('#crop_image').imgAreaSelect({
			x1: 120, y1: 90, x2: 280, y2: 210,
			instance: true,
			handles: true,
			onSelectChange : crop.preview
		});
	},
	preview: function(img, selection) {
		$("#create_preview").removeAttr("disabled");
		if (selection == undefined) {
			var selection = crop.self.getSelection();
			var img = $("#crop_image").get(0);
		};
		var mini_width = 220*selection.width/(selection.height || 1);
		$('#mini_preview div').width(mini_width);
		var scaleX = mini_width / (selection.width || 1);
		var scaleY = 220 / (selection.height || 1);
		$('#mini_preview > div > img').attr("src",img.src).css({
			width : Math.round(scaleX * $(img).width()) + 'px',
			marginLeft : '-' + Math.round(scaleX * selection.x1) + 'px',
			marginTop : '-' + Math.round(scaleY * selection.y1) + 'px'
		});		
	},
	change: function(el){
		if (parseInt($(el).val())) {
			$(".box1").show();
			$(".box0").hide();
			crop.self.setOptions({ disable: true, hide:true });
		} else {
			$(".box0").show();
			$(".box1").hide();
			crop.self.setOptions({ disable: false, show: true });
			crop.self.update();
		};		
	}
}


$(function(){
  if ($("#looks").length) {
  	$("#looks").width($(document).width()+500)
  
	function changeSelect(el) {
		var li = el.closest("form").find("li");
		switch (el.val()) {
			case "1":{
				li.show();
				li.filter(":eq(0),:eq(2)").hide();
				break;
			};
			case "2":{
				el.closest("form").find("li").show();
				break;
			}				
		}		
	};  	



  	$(this).find("ul.looks_a li").draggable({
  		opacity: 0.6,
  		stop: function(){
  			var l = parseInt($(this).css("left"));
  			var t = parseInt($(this).css("top"));
  			var route = $(this).find("a.del").attr("href");
  			$.post(route,{look_item:{left:l,top:t},_method:"put"})
  		}
  	});
  	OPERA = $.browser.opera;
	$("html").bind("mousewheel",function(event, delta){
		if (OPERA) {
			delta = (delta > 0) ? -1 : 1;
		};
		var left = $(document).scrollLeft();
		$(document).scrollLeft(left-delta*30);
		return false;
	});
	changeSelect($("select#look_item_scope"));
	$("select#look_item_scope").change(function(){changeSelect($(this));});
  };
	
  lightBox = $("ul.photos-lightbox").find("a:not(.del)").lightBox();
	
	if ($('#crop_image').length) {
		crop.self = crop.initCrop();		
		$("#create_preview").click(function(e){
			crop.createPreview(this);
			e.preventDefault();
		});
		crop.change($("#type"));
		$("#type").change(function(){
			crop.change(this);
		});
	}
  
  $('textarea:not(.nowred)').each(function(){
  	$(this).redactor();
  });
    
  selectLang($("tr.lang").find("a.selected"));
  $('a.ru_lang, a.en_lang').click(function(e){
  	selectLang($(this));
  	e.preventDefault();
  });  
  
  $("table.pe input:checked").each(function(){
    $(this).closest("tr").addClass("selected");
  });
  $("table.pe a.new, table.pe a.sale").live("click",function(e){
    var el = $(this);
    $.get(this.href,function(data){
      if (parseInt(data)) {
        el.closest("tr").find("a.active").removeClass("active");
        el.addClass("active");
      } else {
        el.removeClass("active");
      }
    });
    e.preventDefault();
  })
  $('#launchbar .arrow a').click(function(e){
    e.preventDefault();
    $('#launchbar li').toggleClass('show');
  })
});