function ajaxCall(url, data, callback, method) {

	var d = data;
	if (!method)
		method = "GET"

	$.ajax({
			type: method,
			url: url,
			data: d,
			cache: false,
			async: true,
			dataType: "json",
			})
			.done(function(retdata, textStatus){d; callback(d, retdata, textStatus);})
			.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				if (textStatus == "error")
					callback(d, {success: false, message: "Errore HTTP: " + XMLHttpRequest.statusText}, "");
				else if ((textStatus || "") == "")
					callback(d, {success: false, message: "General error"}, "");
				else
					callback(d, {success: false, message: textStatus}, "");
				});

}

// identica alla ajaxCall ma incorpora la alert in caso di insuccesso
// segnalato secondo la struttura convenzionale (success, message)
// la funzione di callback viene chiamata in caso di successo
function ajaxCall2(url, data, callback, method) {

	var c = function(sentData, retData) {
		if (!retData.success) {
			alert(retData.message);
			return;
		}

		callback(sentData, retData);
	}
	
	ajaxCall(url, data, c, method);
	
}

function onKeyEnter(o, f) {

	$(o).keyup(function(e) {
		if (e.which == 13) {
			e.preventDefault();
			f.call(this, e);
		}
	});
	
}

function onKeyEsc(o, f) {

	$(o).keyup(function(e) {
		if (e.which == 27) {
			e.preventDefault();
			f.call(this, e);
		}
	});
	
}

// creates a selector function within the specified container
function $createLocalSelector(cnt) {
	
		var l_cnt = cnt;
		
		return function(selector) {
			return $(selector, l_cnt);
		}
}

// creates a selector function within the specified container with pattern ':input[name=...'
function $createLocalSelector2(cnt) {
	
		var l_cnt = cnt;
		
		return function(name) {
			return $(":input[name=" + name + "]", l_cnt);
		}
}

// assegna un ID univoco ad ogni elemento selezionato
function setObjectID(o) {

	$(o).each(function(index, item) {
		if (!$(this).attr("id")) {
			for (;;) {
				var i = generateGUID();
				if ($("#" + i).length == 0) {
					$(this).attr("id", i);
					break;
				}
			}
		}
	});

}

// all'interno del contenitore specificato clona l'elemento con classe 'template' e lo accoda al contenitore togliendo la classe stessa
function createFromTemplate(cnt, prepend) {

	var tClass = "template";
	var l = $(cnt).children("." + tClass).clone();
	l.removeClass(tClass);
	if (prepend)
		$(cnt).prepend(l);	
	else
		$(cnt).append(l);	
	l.show();	
	return l;
	
}

// vuota il contenuto di un elemento ad eccezione degli elementi con classe 'template'
function clearContent(cnt) {

	var tClass = "template";
	$(cnt).children().not("." + tClass).not(".noremove").remove();

}

function createTr(tab, tclass, attributes) {

	var tr = $("<tr></tr>");
	if (tclass)
		tr.addClass(tclass);
	if (attributes)
		tr.attr(attributes);
	tab.append(tr);
	
	return tr;
				
}

function createTd(tr, text, tclass, attributes) {

	var td = $("<td></td>");
	td.text(text);
	if (tclass)
		td.addClass(tclass);
	if (attributes)
		td.attr(attributes);
	tr.append(td);
	
	return td;
				
}

function addOptionToSelect(s, optionValue, optionText) {
// aggiunge una option ad una select
// selectID e' l'ID della SELECT oppure l'oggetto stesso
// se esiste gia' non fa niente 

	var found = false;
	/*
	questa soluzione non va bene perch� non funziona con tutti i valori (ad esempio se c'� un punto)
	var check = $("option[value=" + optionValue + "]", s);
	if (check.length > 0)
		return;
	*/
	$("option", s).each(function(index, value) {
		if ($(value).attr("value") == optionValue) {
			found = true;
			return false;
		}
	});
	if (found)
		return;
	
	var o = $("<option/>");
	o.attr("value", optionValue);
	if (optionText)
		o.text(optionText);
	else
		o.text(optionValue);
	$(s).append(o);
}

//ordinamento -> lo aggiungo all'insieme di funzioni di jQuery
jQuery.fn.sort = function() 
{  
  return this.pushStack( [].sort.apply( this, arguments ), []);  
}; 

function sortListAsc(a, b)
{  
  if ((a.value || "") == "" || (a.value || "") == "*" || (a.value || "") == "-")
    return -1;

    
  if ((b.value || "") == "" || (b.value || "") == "*")
    return 1;


  if (a.description.toUpperCase() == b.description.toUpperCase())
  {
    //return 0;
    return a.value > b.value ? 1 : -1;
  }
  
  return a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1;  
};

function sortListByValueAsc(a, b)
{
  if ((a.value || "") == "" || (a.value || "") == "*" || (a.value || "") == "-")
    return -1;
    
  if ((b.value || "") == "" || (b.value || "") == "*")
    return 1;

  return a.value > b.value ? 1 : -1;  
} 

// converte un oggetto (key, value) in un array di coppie (value, description)
// l'array viene ordinato alfabeticamente tramite la funzione sortListAsc
//  che gestisce in modo opportuno gli elementi
function getArrayFromObject(arrList, sortByValue)
{
  var ret = [];
  var ret2 = [];
  var i;

  for (i in arrList)
  {
    var tmp = { value: i, description: arrList[i]};
    ret.push(tmp);
  }  
  
  if (!sortByValue)
    var fnSort = sortListAsc;
  else
    var fnSort = sortListByValueAsc;
  
  ret = $(ret).sort(fnSort);

  //slm perch� dopo che faccio l'ordinamento mi diventa un oggetto...
  //lo ritrasformo in un array
  for (var j = 0; j < ret.length; j++)
  {
    ret2.push(ret[j]);  
  }
  
  return ret2;
}

function fillSelect2(o, list, bEmpty, sortByValue)
{
	var tmp = $(o);
	
	if (bEmpty)
		tmp.empty();
	
  if (!$.isArray(list) && list != "")
	 list = getArrayFromObject(list, sortByValue || false);
	 
	$.each(list, function(index, item) 
  {
  	if (item.value || item.value == "")
  		tmp.append("<option value='" + item.value + "'>" + item.description + "</option>");
  	else
  		tmp.append("<option value='" + item + "'>" + item + "</option>");
	});
}

function fillSelect(o, list, bEmpty) {
// aggiunge alla SELECT indicata da 'o' (in sintassi jQuery)
// le OPTION elencate in 'list'
// gli elementi di 'list' possono essere stringhe oppure oggetti con
// le proprieta' 'value' e 'description'

	var tmp = $(o);
	
	if (bEmpty)
		tmp.empty();
	
/*
	if (!$.isArray(list))
	 list = getArrayFromObject(list);
*/	
	if ($.isArray(list)) {
		// e' un array, ciclo sugli elementi
		$.each(list, function(index, item) {
			if (item.value || item.value == "")
				tmp.append("<option value='" + item.value + "'>" + item.description + "</option>");
			else
				tmp.append("<option value='" + item + "'>" + item + "</option>");
			});
	 }
	 else {
	 	// e' un oggetto, ciclo sulle proprieta'
/*		$.each(list, function(key, value) {
				if (!$.isFunction(value)) {
					//console.log (key + "-" + value);
					tmp.append("<option value='" + key + "'>" + value + "</option>");
				}
			});*/
		for (var key in list) {
			var value = list[key];
			if (!$.isFunction(value)) {
				//console.log (key + "-" + value);
				tmp.append("<option value='" + key + "'>" + value + "</option>");
			}
		}
	 }
}

// ritorna un array con i testi delle option selezionate
function getSelectedTexts(o) {

	var tmp = [];
	
	$(o).find("option:selected").each(function(index, item) {
      tmp.push($(item).text());
  });  
		
	return tmp;
	
 }

// ritorna un array con i valori delle option selezionate
function getSelectedValues(o) {

	var tmp = [];
	
	$(o).find("option:selected").each(function(index, item) {
      tmp.push($(item).val());
  });  
		
	return tmp;
	
 } 
 
 // seleziona le option corrispondenti ai valori specificati
 function setSelectedValue(o, values)
 {
 
	$("option", o).each(function(index, item) {$(item).prop("selected", false); });
	
	$.each(values, function(index, item) {
		$("option[value='" + item + "']", o).prop("selected", true);
	});
 }
 
 // se l'option correntemente selezionata non � visible imposta la prima visible
 // e ritorna true 
 // altrimenti ritorna false
 function selectVisibleOption(select) {
	 
	var val = $(select).val();
	
	if (!$("option[value='" + val + "']", select).is(":visible")) {
		val = $("option:visible", select).eq(0).val();
		$(select).val(val);		
		return true;
	}
	 
	return false;
	
 }
 
function getRadioValue(pname, cnt) {
// ritorna il valore del radio button selezionato dato il parametro NAME ed il contenitore (opzionale)
	if (cnt)
		return $("input[name='" + pname + "']:checked", cnt).val();
	else
		return $("input[name='" + pname + "']:checked").val();
}

function setRadioValue(pname, value, cnt) {
// inposta il valore del radio button selezionato dato il parametro NAME ed il contenitore (opzionale)
	if (cnt)
		$("input[name='" + pname + "']", cnt).filter("[value='" + value + "']").prop("checked", true);
	else
		$("input[name='" + pname + "']").filter("[value='" + value + "']").prop("checked", true);
}

function resetRadioValue(pname, cnt) {
// vuota tutti i radio button selezionati dato il parametro NAME ed il contenitore (opzionale)
	if (cnt)
		$("input[name='" + pname + "']", cnt).prop("checked", false);
	else
		$("input[name='" + pname + "']").prop("checked", false);
}

function getCheckedValue(o) {
// ritorna il valore del radio button selezionato dato il seletore
	return $(o).filter(":checked").val();
}

function setCheckedValue(o, value) {
// inposta il valore del radio button selezionato dato il selettore
	$(o).filter("[value=" + value + "]").prop("checked", true);
}

function resetCheckedValue(o) {
// vuota tutti i radio button selezionati dato il selettore
	$(o).prop("checked", false);
}

function isChecked(obj, v) {
// ritorna true se l'oggetto e' CHECKED	
	if (arguments.length == 2) {
		$(obj).prop("checked", v);
    }
    else
		return $(obj).is(":checked");
}

function getCheckedList(pname, cnt) {
// ritorna un array con i valori dei radio/check selezionati 
// identificati tramite il nome ed un contenitore opzionale 

	var tmp = [];
	var l;
	
	if (cnt)
		l = $("input[name='" + pname + "']", cnt);
	else
		l = $("input[name='" + pname + "']");
	
	l.each(function(index, item) {
		if (isChecked(item))
			tmp.push($(item).val());
	});
	
	return tmp;
	
}

function setCheckedList(pname, values, cnt) {
// riceve un array con i valori dei radio/check da selezionare
// identificati tramite il nome ed un contenitore opzionale 

	var l;
	
	$.each(values, function(index, value) {
		if (cnt)
			l = $("input[name='" + pname + "'][value=" + value + "]", cnt);
		else
			l = $("input[name='" + pname + "'][value=" + value + "]");
		isChecked(l, true);
	});
	
}

function setVisible(obj, v) {
	if (v)
		$(obj).show();
	else
		$(obj).hide();
}

function fillContainer(obj, params) {

	var p = $(obj).parent("div");
	var margin = 0;
	if (params) {
		if (params.margin)
			margin = params.margin;
	}
	$(obj).css({position: "absolute", top: margin, left: margin, width: p.width() - margin * 2, height: p.height() - margin * 2});

}

function setDisabled(obj, v) {
	if ($.fn.prop) {
		$(obj).prop("disabled", v);
	}
	else {
		if (v)
				$(obj).attr("disabled", "disabled");
		else
				$(obj).removeAttr("disabled");
	}
}

function setEnabled(obj, v) {
	setDisabled(obj, !v);
}

function scrollIntoView(element, container, speed) {

	if (!element)
		return;
		
	if (element.length == 0)
		return;
		
  var containerTop = $(container).scrollTop(); 
  var containerBottom = containerTop + $(container).height(); 
  var elemTop = element.get(0).offsetTop;
  var elemBottom = elemTop + $(element).height(); 
  if (elemTop < containerTop) {
	if (speed)
		$(container).animate({scrollTop: elemTop}, speed);
	else 
		$(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
	if (speed)
		$(container).animate({scrollTop: elemBottom - $(container).height()}, speed);
	else 
		$(container).scrollTop(elemBottom - $(container).height());
  }
}

function setupToggle(obj, params) {
	// trasforma un link in un elemento a due stati
	// il valore e' memorizzato in .data('value') e vale 0/1
	// obj: oggetto jQuery
	// params:
	//      text: [testo0, testo1]
	//      defaultValue: il valore iniziale (0/1), se non specificato si intende 0
	//      callback: la funzione chiamata dopo il click e la valutazione del nuovo valore
	//				  come parametro viene passato il nuovo valore
	
	var o = $(obj);
	
	o.data("toggle", params);
	
	var def;
	if (params.defaultValue)
		def = parseInt(params.defaultValue);
	else
		def = 0;
	if (isNaN(def)) def = 0;

	o.attr("value", def);
	o.text(params.text[def]);
	o.attr("href", "javascript:void(0)");

	o.click(function(event) {
		var obj = $(this);
		var v = obj.attr("value");
		var params = obj.data("toggle");
		v = (v == "0") ? 1 : 0
		obj.attr("value", v);
		obj.text(params.text[v]);
		if (params.callback) {
			if (Array.isArray(params.callback)) {
				params.callback[v].call(this);
			}
			else {
				params.callback.call(this, v);
			}
		}
		event.preventDefault();
	});
}

// da utilizzare su un oggetto toggle (impostato tramite la funzione setupToggle
// per impostare il valore 
// TODO: da migliorare
function toggleSetValue(obj, v) {

	var o = $(obj);
	
	var params = o.data("toggle");

	o.attr("value", v);
	o.text(params.text[v]);
	if (params.callback) {
		if (Array.isArray(params.callback)) {
			params.callback[v].call(o);
		}
		else {
			params.callback.call(o, v);
		}
	}
	
}

/**
 *  serializza un oggetto jQuery in formato JSON
 */ 
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function clearInputFields(container) {
  // iterate over all of the inputs for the container
  // element that was passed in
  $(':input', container).each(function() {
    var type = this.type;
    var tag = this.tagName.toLowerCase(); // normalize case
    // it's ok to reset the value attr of text inputs,
    // password inputs, and textareas
    if (type == 'text' || type == 'password' || tag == 'textarea')
      this.value = "";
    // checkboxes and radios need to have their checked state cleared
    // but should *not* have their 'value' changed
    else if (type == 'checkbox' || type == 'radio')
      this.checked = false;
    // select elements need to have their 'selectedIndex' property set to -1
    // (this works for both single and multiple select elements)
    else if (tag == 'select')
      this.selectedIndex = -1;
  });
}

