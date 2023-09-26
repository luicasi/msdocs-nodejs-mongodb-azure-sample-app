gebi = function(v) {return document.getElementById(v);}

function utf8_encode (argString) {

  if (argString === null || typeof argString === "undefined") {
    return "";
  }

  var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var utftext = '',
    start, end, stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
}
      	
function utf8_decode (str_data) {  
  // http://kevin.vanzonneveld.net  
  // + original by: Webtoolkit.info (http://www.webtoolkit.info/)  
  // + input by: Aman Gupta  
  // + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
  // + improved by: Norman "zEh" Fuchs  
  // + bugfixed by: hitwork  
  // + bugfixed by: Onno Marsman  
  // + input by: Brett Zamir (http://brett-zamir.me)  
  // + bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
  // * example 1: utf8_decode('Kevin van Zonneveld');  
  // * returns 1: 'Kevin van Zonneveld'  
  var tmp_arr = [],  i = 0,  ac = 0,  c1 = 0,  c2 = 0,  c3 = 0;   
  str_data += '';   
  while (i < str_data.length) {  
    c1 = str_data.charCodeAt(i);  
    if (c1 < 128) {  
      tmp_arr[ac++] = String.fromCharCode(c1);  
      i++;  
    } else if (c1 > 191 && c1 < 224) {  
      c2 = str_data.charCodeAt(i + 1);  
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));  i += 2;  
    } else {  
      c2 = str_data.charCodeAt(i + 1);  
      c3 = str_data.charCodeAt(i + 2);  
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  i += 3;  
    }  
  }   
  return tmp_arr.join(''); }  

if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

if (!window.isArray) {
  window.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.lastIndexOf(searchString, position) === position;
  };
}

function isString(myVar) {
	
	return (typeof myVar == 'string' || myVar instanceof String);

}

var delay = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();
       	
/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlUnescape(str) {
    return String(str)
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
}

function AddToURL(pURL, nomePar, valore) {
// se il terzo parametro è vuoto si intende che il secondo è un oggetto, quindi accoda i vari attributi 

	var tmp = ""
	var o;
	var i;
	
   if (pURL == "")
     return "";
			
	tmp = pURL;
	
	if (valore) {
		o = {};
		o[nomePar] = valore;
	}
	else 
		o = nomePar;
	
	for (i in o) {
		if (tmp.indexOf('?') == -1)
			tmp += '?';
		else
			tmp += '&';
		tmp += i + '=' + encodeURIComponent(o[i]);
	}
	
	return tmp;
}

function generateGUID() {
	return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

function getSelectedButton(buttonGroup){

    for (var i = 0; i < buttonGroup.length; i++) {
        if (buttonGroup[i].checked) {
            return i;
        }
    }
    return -1;
}

function isValidEmail(sText) {

	//var reEmail = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/;
	var reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return reEmail.test(sText);
}

function getSelectedText(o) {
	if (typeof o == "string")
		o = gebi(o);

	if (!o)
		return "";

	if (o.selectedIndex == -1)
		return ("");
	else {
		return o.options[o.selectedIndex].text;
	}
}

function getSelectedValue(o) {
	if (typeof o == "string")
		o= gebi(o);
	if (!o)
		return "";

	if (o.selectedIndex == -1)
		return ("");
	else {
		return o.options[o.selectedIndex].value;
	}
}

function IsNumeric(ch){
	return isNumeric(ch);
}

function isNumeric(sText)
{
   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;


   for (i = 0; i < sText.length && IsNumber == true; i++)
      {
      Char = sText.charAt(i);
      if (ValidChars.indexOf(Char) == -1)
         {
         IsNumber = false;
         }
      }
   return IsNumber;

   }

function isInteger(sText)
{
   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;


   for (i = 0; i < sText.length && IsNumber == true; i++)
      {
      Char = sText.charAt(i);
      if (ValidChars.indexOf(Char) == -1)
         {
         IsNumber = false;
         }
      }
   return IsNumber;

   }

   function isIntegerNeg(sText)
{
	//ritorna true se il testo è un numero intero eventualmente preceduto dal segno meno

   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;
   var iStart;

   if (sText == "")
   		return false;

   if (sText.indexOf("-") == 0)
   		iStart = 1;
   if (sText.indexOf("-") == -1)
   		iStart = 0;
   if (sText.indexOf("-") > 0)
   		return false;

   for (i = iStart; i < sText.length && IsNumber == true; i++)
      {
      Char = sText.charAt(i);
      if (ValidChars.indexOf(Char) == -1)
         {
         IsNumber = false;
         }
      }
   return IsNumber;

   }

function getValue(s) {

	if (typeof s == "string")
		s = gebi(s);

	if (!s)
		return "";
	
	return s.value;

}

function trim(stringToTrim) {
	if (stringToTrim)
		return stringToTrim.replace(/^\s+|\s+$/g,"");
	else
		return "";
}
function ltrim(stringToTrim) {
	if (stringToTrim)
		return stringToTrim.replace(/^\s+/,"");
	else
		return "";
}
function rtrim(stringToTrim) {
	if (stringToTrim)
		return stringToTrim.replace(/\s+$/,"");
	else
		return "";
}

//restituisce true se l'oggetto è vuoto, false altrimenti
function isEmpty(ob)
{
  for(var i in ob)
  { 
    return false;
  }
  return true;
}

//restituisce la porzione di stringa dopo delimiter
function ReadAfter(str, delimiter)
{
  var pos = str.indexOf(delimiter);
  pos += delimiter.length;
  
  return str.substr(pos);
}

function FillZero(s, l) {

	if (s == undefined)
		return "";
		
	var b = "";
	for (var x = s.length + 1; x<= l; x++)
		b+= "0";
		
	return b + s;

}

function FillL(s, l) {

	if (s == undefined)
		return "";
		
	var b = "";
	for (var x = s.length + 1; x<= l; x++)
		b+= " ";
		
	return b + s;

}

function FillR(s, l) {

	if (s == undefined)
		return "";
		
	var b = "";
	for (var x = s.length + 1; x<= l; x++)
		b+= " ";

	return s + b;

}

function customDateFormat(dateValue, formatString){
   var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,dMod,th;

   if (!formatString)
    return dateValue.toString();

   YY = ((YYYY=dateValue.getFullYear())+"").substr(2,2);
   MM = (M=dateValue.getMonth()+1)<10?('0'+M):M;
   MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substr(0,3);
   DD = (D=dateValue.getDate())<10?('0'+D):D;
   DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateValue.getDay()]).substr(0,3);
   th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
   gmt_offset = (-dateValue.getTimezoneOffset( )) / 60;
   if (gmt_offset>0)
	gmt_offset = "+" + gmt_offset;
   formatString = formatString.replace("GMT", "***").replace("YYYY",YYYY).replace("YY",YY).replace("MMMM",MMMM).replace("MMM",MMM).replace("MM",MM).replace("M",M).replace("DDDD",DDDD).replace("DDD",DDD).replace("DD",DD).replace("D",D).replace("th",th).replace("***", "GMT" + gmt_offset);

   h=(hhh=dateValue.getHours());
   if (h==0) h=24;
   if (h>12) h-=12;
   hh = h<10?('0'+h):h;
   ampm=hhh<12?'am':'pm';
   mm=(m=dateValue.getMinutes())<10?('0'+m):m;
   ss=(s=dateValue.getSeconds())<10?('0'+s):s;
   return formatString.replace("hhh",hhh).replace("hh",hh).replace("h",h).replace("mm",mm).replace("m",m).replace("ss",ss).replace("s",s).replace("ampm",ampm);
}
function parseNumber(v) {
// converte in numero il testo specificato
// ritorna un oggetto con le proprieta'
//     value: il valore ottenuto oppure NaN
//     message: l'eventuale messaggio di errore


var message = "";

if (v == "" || v == undefined)
	return {value: NaN, message: 'Valore non specificato'};

var isDecimal = false;

//sostituisco virgola con punto
var v1 = v.replace(/,/g,".");

//cerco il primo punto
var x = v1.indexOf(".");

if (x != -1) {
    //punto trovato
    //non deve essere l'ultimo carattere
    if (x == v1.length - 1) {
        //alert ("Il separatore decimale non puo' essere l'ultimo carattere");
        return {value: NaN, message: 'Il separatore decimale non puo\' essere l\'ultimo carattere'};
    }
    //cerco un altro punto
    var y = v1.substring(x + 1).indexOf(".")
    if (y != -1) {
        //alert ("Non ci possono essere piu' separatori decimali");
        return {value: NaN, message: 'Non ci possono essere piu\' separatori decimali'};
    }
    isDecimal = true;
}

// cerco il segno meno
x = v1.indexOf("-");
if (x > 0) {
        // posizione non ammessa
	return {value: NaN, message: 'Segno meno in posizione non ammessa'};
    }

var va2;
if (isDecimal)
	 v2 = parseFloat(v1);
else
	v2 = parseInt(v1)
if (isNaN(v2))
	message = "Valore non valido";
return {value: v2, message: message, decimal: isDecimal};

}

String.prototype.insertAt=function(loc,strChunk){ 
   return (this.valueOf().substr(0,loc))+strChunk+(this.valueOf().substr(loc)) 
} 

Number.prototype.toInteger=function(thousandsSeparator){ 
   var n,startAt,intLen;
   if (thousandsSeparator==null) thousandsSeparator=",";
   if (this == 0)
   	return "0";
   n = this.round(0,true);
   intLen=n.length;
   if ((startAt=intLen%3)==0) startAt=3;
   for (var i=0,len=Math.ceil(intLen/3)-1;i<len;i++)n=n.insertAt(i*4+startAt,thousandsSeparator);
   return n;
} 

Number.prototype.round=function(decimals, returnAsString, decimalSeparator){
   //Supports 'negative' decimals, e.g. myNumber.round(-3) rounds to the nearest thousand 
   var n,factor,breakPoint,whole,frac;
   if (!decimals) decimals=0;
   factor=Math.pow(10,decimals);
   n=(this.valueOf()+"");         //To get the internal value of an Object, use the valueOf() method
   if (!returnAsString) return Math.round(n*factor)/factor;
   if (!decimalSeparator) decimalSeparator=",";
   if (n==0) {
	   return "0,"+((factor+"").substr(1));
	}
   breakPoint=(n=Math.round(n*factor)+"").length-decimals;
   whole = n.substr(0,breakPoint);
   if (decimals>0){
      frac = n.substr(breakPoint);
      if (frac.length<decimals) frac=(Math.pow(10,decimals-frac.length)+"").substr(1)+frac;
      return whole+decimalSeparator+frac;
   }else return whole+((Math.pow(10,-decimals)+"").substr(1));
}

function formatNumber1(v, decimals, sepGroups){
	return FormatNumber1(v, decimals, sepGroups);
}

function FormatNumber1(v, decimals, sepGroups){
   //Supports 'negative' decimals, e.g. myNumber.round(-3) rounds to the nearest thousand
   var n,factor,breakPoint,whole,frac, isNeg;
   var decimalSeparator = ",";
	 
   if (!decimals) decimals=0;
   factor=Math.pow(10,decimals);
   n=(v.valueOf()+"");         //To get the internal value of an Object, use the valueOf() method
   if (!sepGroups)
	sepGroups="";
	else
	sepGroups = ".";
   if (n==0) {
   		if (decimals == 0)
   			return "0"
   		else
	   		return "0,"+((factor+"").substr(1));
	}
   isNeg = "";
   if (n<0) {isNeg = "-"; n = -n}
   breakPoint=(n=Math.round(n*factor)+"").length-decimals;
   whole = n.substr(0,breakPoint);
   if (whole == "") whole = "0";
   if (sepGroups != "")
	whole = parseInt(whole).toInteger(".");
   if (decimals>0){
      frac = n.substr(breakPoint);
      if (frac.length<decimals) frac=(Math.pow(10,decimals-frac.length)+"").substr(1)+frac;
      return isNeg + whole+decimalSeparator+frac;
   }else return isNeg + whole+((Math.pow(10,-decimals)+"").substr(1));
}

function FormatNumber(that, decimals, hasComma) {

	// fix number precision
	that = that.toFixed(decimals);

	// get the string now that precision is correct
	var fnum = that.toString();

	// format has comma, then compute commas
	if (hasComma) {
		// remove precision for computation
		psplit = fnum.split('.');

		var cnum = psplit[0];
		
		// isolates minus
		var mi = (cnum.indexOf('-') == 0);
		if (mi)
			cnum = cnum.substr(1, cnum.length - 1);

		var	parr = [],
			j = cnum.length,
			m = Math.floor(j / 3),
			n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop

		// break the number into chunks of 3 digits; first chunk may be less than 3
		for (var i = 0; i < j; i += n) {
			if (i != 0) {n = 3;}
			parr[parr.length] = cnum.substr(i, n);
			m -= 1;
		}

		// put chunks back together, separated by comma
		fnum = parr.join('.');

		// restores minus sign
		if (mi)
			fnum = '-' + fnum;

		// add the precision back in
		if (psplit[1]) {fnum += ',' + psplit[1];}
	}

	return fnum
};

function formatPercent(v, decimals) {
	return FormatPercent(v, decimals);
}

function FormatPercent(v, decimals) {
	var v1 = v * 100;
	return FormatNumber(v1, decimals) + "%";
}

function integerDivide ( numerator, denominator ) {
    // In JavaScript, dividing integer values yields a floating point result (unlike in Java, C++, C)
    // To find the integer quotient, reduce the numerator by the remainder first, then divide.
    var remainder = numerator % denominator;
    var quotient = ( numerator - remainder ) / denominator;

	return quotient;
}

function roundTo(value, decimalpositions)
{
    var i = value * Math.pow(10,decimalpositions);
    i = Math.round(i);
    return i / Math.pow(10,decimalpositions);
}

function replaceNewLine(v) {

	if (!v)
		return "";
		
	if (v == undefined)
		return "";
		
	return v.replace(/\n/g,"<br/>");
}

if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}


/*******************************************************************************
 *    NUMERI
 ******************************************************************************/  
//restituisce true se pari, false se dispari
function IsEven(someNumber)
{
  return (someNumber%2 == 0) ? true : false;
}   
function isEven(someNumber)
{
  return IsEven(someNumber);
}   

//restituisce solo i caratteri numerici di una stringa
function GetNumericChars(value)
{
  var retVal = "";
  
  for(var i = 0; i < value.length; i++)
  {
    if (IsNumeric(value.substr(i, 1)))
      retVal += value.substr(i, 1);
  }
  
  return retVal;
}



/*******************************************************************************
 * FUNZIONE:      strReplace
 * DESCRIZIONE:   sostituisce TUTTE le occorrenze di string2Find in expression 
 *                con replacement
 *                NB: il metodo replace dell'oggetto string sostituisce SOLTANTO 
 *                LA PRIMA OCCORRENZA di string2Find in expression 
 *              
 * PARAMETRI:   
 * expression:    stringa su cui effettuare la ricerca
 * string2Find:   stringa da cercare (e che deve essere sostituita)
 * replacement:   stringa che sostituisce string2Find
 ******************************************************************************/ 
function strReplace(expression, string2Find, replacement)
{
	if (!expression)
		return "";
		
  while (expression.indexOf(string2Find) > -1)
  {
    expression = expression.replace(string2Find, replacement);
  }
  
  return expression;
}

//***************************Diego Albini*******************************
function toFixedFix(n, precisione) {  

     // Funzione per arrotondare valore  
     var k = Math.pow(10, precisione);  
     return '' + Math.round(n * k) / k;  
 }  
    
 function number_format(numero, decimali, dec_separatore, mig_separatore){   
     // Elimino i caratteri che non sono numeri (lascio il segno meno e il punto)  
     //alert(numero);
     //numero = parseFloat(numero);
     //numero = (numero).replace(/[^0-9\.\-]?/gi,"");  
     // Controllo se valore numerico  
     var n = 0;  
     if(isFinite(+numero)){  
         n=numero;  
     }  
// Controllo se i decimali sono accettabili  
     var precisione = 0; 
     if(isFinite(+decimali) && decimali>-1){  
         precisione = decimali;  
     } 
     // Recupero caratteri separatori  
     var separatore = '.';  
     if(typeof mig_separatore != 'undefined'){  
         separatore = mig_separatore;  
     }  
     var dec = ',';  
     if(typeof dec_separatore != 'undefined'){  
         var dec = dec_separatore;  
     }  

     // Arrotondo il valore se necessario - Utilizzo funzione toFixedFix  
     var s = '';  
     if(precisione!=0){  
         s = toFixedFix(n, precisione);  
     }else{  
         s = '' + Math.round(n);  
     }  

     // Taglio il valore in parte intera e parte decimale  
     s = s.split('.');  
     // Aggiungo il separatore delle migliaia - ogni 3 numeri sulla parte intera  
     if (s[0].length > 3) {  
         s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, separatore);  
     }  
     // Formatto la parte decimale - aggiungo degli 0 se necessari 
     if ((s[1] || '').length < precisione) {  
         s[1] = s[1] || '';  
         //Se lascio questa parte mi aggiunge sempre 0 come decimali
         s[1] += new Array(precisione - s[1].length + 1).join('0');
     } 
     //Elimino la virgola se non ho decimali 
     if(s[1] == ""){dec = "";}
     // Aggiungo parte decimale a parte intera - separati da separatore decimali  
     return s.join(dec);  
 }

 function fileSize(bytes) {
    var exp = Math.log(bytes) / Math.log(1024) | 0;
    var result = (bytes / Math.pow(1024, exp));
		if (result >= 100) {
				result = result.toFixed(0);		
		}
		else {
			if (result >= 10) {
				result = result.toFixed(1);
			}
			else {
				result = result.toFixed(2);
			}
		}

    return result + ' ' + (exp == 0 ? 'bytes': 'KMGTPEZY'[exp - 1] + 'B');
}

// dato un recordset (array di oggetti) ed un array di nomi di campi
// ritorna un oggetto con la somma dei campi indicati
// filter è una funzione opzionale che deve ritornare true se il singolo record va considerato nella somma
function sumUp(a, fs, filter) {

	var ret = {};
	var flt = filter || function() {return true;};
	
	for (var x = 0; x < fs.length; x++) {
		ret[fs[x]] = 0;
	}
	
	for (var x = 0; x < a.length; x++) {
		var item = a[x];
		if (flt(item)) {
			for (var k in ret) {
				if (item[k])
					ret[k] += item[k];
			}
		}
	}

	return ret;
	
}

// ritorna true se il valore 'v' e' incluso nella lista
function isAmong(v, lst) {
	
	return lst.indexOf(v) > -1;
	
}

var arrayList = function() {
	
	// riceve una stringa contenente un elenco ed il carattere separatore
	// ritorna l'elenco sempre sotto forma di stringa togliendo i duplicati ed eventuali separatori in eccesso
	// le stringe vengono trattate in modo case-sensitive
	function clean(list, sep) {
	
		var ret = getArray(list, sep);	
		return ret.join(sep);
		
	}

	// riceve una stringa contenente un elenco ed il carattere separatore
	// ritorna l'elenco sotto forma di array togliendo i duplicati ed eventuali separatori in eccesso
	// le stringe vengono trattate in modo case-sensitive
	function getArray(list, sep) {
		
		if (list == "" || list == undefined || list == null)
			return [];
		
		var ret = [];	
		var a = list.split(sep);
		var i;
		
		for (var x = 0; x < a.length; x++) {
			i = a[x];
			if (i != "") {
				if (ret.indexOf(i) == -1)
					ret.push(i);
			}		
		}
		
		return ret;
		
	}

	function add(list, item, sep) {

		var ret = getArray(list, sep);	
		if (ret.indexOf(item) == -1)
			ret.push(item);
		return ret.join(sep);
		
	}

	function remove(list, item, sep) {

		var a = getArray(list, sep);	
		var ret = []
		
		for (var x = 0; x < a.length; x++) {
			if (a[x] != item)
				ret.push(a[x]);
		}
		return ret.join(sep);
		
	}
	
	return {
		clean: clean,
		add: add,
		remove: remove,
		getArray: getArray
	}
}();

function getDecimalSeparator()
{
	var decSeparator = (1.5).toLocaleString().substr(1,1);
	
	if (!isNaN(parseInt(decSeparator)) || !decSeparator) decSeparator = "."	// nel caso in cui il separatore non sia definito
	
	return decSeparator;			
}

function getThousandsSeparator()
{
	var decSeparator = getDecimalSeparator();
	var thousandsSeparator = (1234).toLocaleString().substr(1,1);
	if (!isNaN(parseInt(thousandsSeparator)) || !thousandsSeparator || thousandsSeparator == decSeparator) thousandsSeparator = "'"	// nel caso in cui il separatore non sia definito
	
	return thousandsSeparator;			
}

