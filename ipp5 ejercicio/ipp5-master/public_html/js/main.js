
//This function resets the code in the editor to the original
//value found in  the parameter file. file represents an actual 
//file in the server.
function restaurar(file, editor) {
    loadDoc(file, editor);
}

//This function executes the code from the editor in the
// canvas. It reloads the iframe object
function ejecutar(editor, frameId) {
    $(frameId).attr('src', $(frameId).attr('src'));
}

function cargarEnCanvas(editor, frameId){
    var exampleCode = editor.getSession().getValue();

    try {

        if (exampleCode.indexOf('new p5()') === -1) {
            exampleCode += '\nnew p5();';
        }
        //alert(exampleCode);

        var userScript = $(frameId)[0].contentWindow.document.createElement('script');
        userScript.type = 'text/javascript';
        userScript.text = exampleCode;
        userScript.async = false;
        $(frameId)[0].contentWindow.document.body.appendChild(userScript);

    } catch (e) {
        console.log(e.message);
    }
    
}

function iniciarCanvas(editor, frameId){
    $(frameId).load(function() {
            // alert('exampleFrame load')
            cargarEnCanvas(editor, frameId);});
    
}

function loadDoc(file, editor) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     editor.getSession().setValue(this.responseText);
    }
  };
  xhttp.open("GET", file, true);
  xhttp.send();
}