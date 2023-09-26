$(function() {
// crea la riga css per nascondere le righe di classe 'sample'
$("<style type='text/css'> tr.sample{ display: none;} </style>").appendTo("head");
});

var tableUtility = {
	// funzioni di utilita' per manipolare una tabella gestendo le righe campione e quelle da non eliminare quando si vuota la tabella
	empty: function (tbody) {
		// vuota la sezione specificata evitando di rimuovere le righe con la classe 'noremove'
		$("tr:not(.noremove)", tbody).remove();	
	},
	
	createRow: function(tbody, sampleClass, additionalAttributes, addClass) {
		// ritorna una nuova riga per la sezione specificata
		
		var oBody = $(tbody);		
				
		// selettore riga campione
		var sel = "tr.sample"
		if (sampleClass && sampleClass != "")
			sel += ("." + sampleClass);
		// riga campione 
		var sample = $(sel, oBody);
		
		// crea la nuova riga
		var tr = sample.clone();
				
		tr.removeClass("sample");	// toglie la classe che identifica il sample
		tr.removeClass("noremove"); // toglie la classe che inibisce la pulizia della riga 
		
		if (additionalAttributes) {
			// ci sono attributi da assegnare alla riga
			tr.attr(additionalAttributes);
		}
		
		if (addClass)
			tr.addClass(addClass);
			
		// aggiunge al contenitore
		oBody.append(tr);
		
		// ritorna la riga generata
		return tr;	
	},
	
	setup: function(tbody) {
		// aggancia una tabella e ritorna un proxy con i metodi di manipolazione
			var t = tbody;
			return {
				empty: function() {tableUtility.empty(t);},
				createRow: function(sampleClass, additionalAttributes, addClass) {return tableUtility.createRow(t, sampleClass, additionalAttributes, addClass);}
			};
	}
}