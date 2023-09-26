function pageManagerObj(p) {
	
	var initialized = false;
	var currentpage;
	var params = $.extend({}, {marginRight: 20, marginBottom: 20}, p);

	this.showPage = function (p) {
	
		// per ogni DIV di classe 'page' imposta la visibilita' in base all'attributo 'page'
		$("div.page").each(function(index, item) {
			var v = $(item).attr("page");
			setVisible($(item), (v == p));
		});
	
	    currentpage = p;
	
		if (!initialized) {
			$(window).resize(resizePage);
	        initialized = true;
		}

	    resizePage()
	    
	    // chiama l'eventuale callback
	    if (params.onAfterChange)
	    	params.onAfterChange();
	
	}
	
	this.currentPage = function() {
			// ritorna l'etichetta della pagina corrente
    	return currentpage;
	}

	this.resize = function() {resizePage();}
	
	function resizePage() {

		if (!currentpage)
			return;
	
		var o = $("div.page[page=" + currentpage + "]");
	
		var t = o.position();
		if (t) {
			var tt = t.top;
			var tl = t.left;
		}
		else {
			var tt = 0;
			var tl = 0;
		}
		
		o.css('height', $(window).height() - tt - params.marginBottom);
		o.css('width', $(window).width() - tl - params.marginRight);
		
		if (params.preventLayout == undefined || params.preventLayout == false)
			handleLayout(o);
	}

	function handleLayout(cnt) {
	
		var c = $(cnt);
	
		// tipo di layout
		var layout = c.attr("layout");
		if (layout == undefined || layout == "")
			return;	// nessun layout da gestire
		layout = layout.toLowerCase();
		if (layout != "col" && layout != "row")
			return;	// valore non valido
	
		// dimensioni del contenitore
		var cntw = c.innerWidth();
		var cnth = c.innerHeight();
	
		// valuta il padding
		var paddingleft = parseInt(c.css("padding-left").replace("px", ""));
		var paddingright = parseInt(c.css("padding-right").replace("px", ""));
		var paddingtop = parseInt(c.css("padding-top").replace("px", ""));
		var paddingbottom = parseInt(c.css("padding-bottom").replace("px", ""));
	
		// sottrae il padding dall'area disponibile
		cntw = cntw - paddingleft - paddingright;
		cnth = cnth - paddingtop - paddingbottom;
	
		//console.log ("handleLayout " + $(cnt).attr("id") + ": " + layout + ", cntw = " + cntw + ", cnth = " + cnth);
	
		// nome dell'attributo che definisce la dimensione
		var sizeattr = (layout == "col" ? "colwidth": "rowheight");
		
		// valore della dimensione da riempire
		var vardim = (layout == "col" ? cntw: cnth);
	
		// somma degli elementi a dimensione fissa
		var sum = 0;
		
		// posizione di partenza degli elementi (viene poi incrementata)
		var pos = (layout == "col" ? paddingleft: paddingtop);
	
		// memorizza in una variabile l'elenco degli oggetti DIV discendenti diretti
		var divs = c.children("div:visible");
	
		// fa un ciclo per calcolare la somma delle dimensioni degli elementi a dimensione fissa
		divs.each(function() {
	    	var v = parseInt($(this).attr(sizeattr));
	    	if (! isNaN(v))
	    		sum += v;
		});
	
		// calcola lo spazio rimanente
		var rem = vardim - sum
		if (rem < 0) rem = 0;
	
		// fa un ciclo per posizionare e dimensionare gli elementi
		divs.each(function() {
			var t = $(this);
			// dimensione dell'elemento
	    	var v = parseInt(t.attr(sizeattr));
	    	if (isNaN(v))
	    		v = rem		// dimensione non definita, utilizza quella calcolata come rimanente
	
			// crea l'oggetto per posizionare l'elemento
			if (layout == "col") {
				var c = {top: paddingtop, left: pos, width: v, height: cnth};
			}
			else {
				var c = {top: pos, left: paddingleft, width: cntw, height: v};
			}
			c.layout = layout;
			c.position= "absolute";
			$(this).css(c);
			//console.log ($(this).attr("id") + " " + dumpObj(c));
			pos += v
		});
	
		// applica la gestione del layout ad ogni elemento interno
	  divs.each(function() {
			handleLayout(this);
		});
	
	}
	
};

