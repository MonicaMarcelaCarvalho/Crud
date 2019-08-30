	var editor;
	var caminhoId = "sample";
	var oTable;


	$(document).ready(function(){
		
		$('#caminhoId').hide();
			var seq=createTable();
		
			$('#seq').text(seq);
		
				$("#caminhoId").validationEngine('attach',
				{
					onValidationComplete: function(form, status){
						if (!verifyLocalStorageCapability) {
							return;
						}if (status) {
							save();
							location.reload(true);
						}
					}
				});
		});

	function createTable() {

		var dataSet	= [];
		var i = 0;
		var seq = 0; 
		var index = 0;
		var icons  ='<span  class="glyphicon glyphicon-plus"></span> <span  class="glyphicon glyphicon-trash"></span>';

		while ( i < 2 ) {
			var key=caminhoId+"_"+index;
			var json=localStorage.getItem(key);
			if ( json==null || json=="null" || json=="[object Object]" ) {
				index=index+1;
				i=i+1;
				continue;
			}
			var object=null;
			object=JSON.parse(json);
			var note= object.note;
			dataSet[seq]=[index,icons, object.nome, object.sobrenome, object.avatar]; 
			index=index+1;
			seq=seq+1;
		}


		oTable=$('#table').dataTable({
			"data": dataSet,
			"columns": [
			{ "title": "   Id ", "class": "center" },
			{ "title": "    ", "class": "center" },
			{ "title": "Nome" , "class": "center" },
			{ "title": "Sobrenome", "class": "center" },
			{ "title": "Telefone", "class": "center" }
			],
			"bJQueryUI": false,
                "oLanguage": {
					"sEmptyTable": "Nenhum registro encontrado",
					"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
					"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
					"sInfoFiltered": "(Filtrados de _MAX_ registros)",
					"sInfoPostFix": "",
					"sInfoThousands": ".",
					"sLengthMenu": "_MENU_ resultados por página",
					"sLoadingRecords": "Carregando...",
					"sProcessing": "Processando...",
					"sZeroRecords": "Nenhum registro encontrado",
					"sSearch": "Pesquisar",
					"oAria": {
						"sSortAscending": ": Ordenar colunas de forma ascendente",
						"sSortDescending": ": Ordenar colunas de forma descendente"
					}
				}
                
		});


		$('#table tbody').on( 'click', '.glyphicon-trash', function () {
		    var row = $(this).parents('tr');
		    var seq = row.children()[0].innerHTML;
		    if(window.confirm('Deseja excluir o ID '+seq +'?')){
		    	var key=caminhoId+"_"+seq;
		    	localStorage.removeItem(key);
		    	restoreItems();
        		location.reload(true);
		    }
		} );

		$('#add').on( 'click', function () {
		    $('#list').hide(); 
		    $('#seq').text(seq); 
		    $('#caminhoId').show(); 
		} );

		$('#cancel').on( 'click', function () {
		    location.reload(true);
		} );


		$('#table tbody').on( 'click', '.glyphicon-plus', function () {
		    $('#list').hide();
		    var rows = $(this).parents('tr').children();
		    $('#seq').text(rows[0].innerHTML);
		    $('').val(rows[1].innerHTML);
		    $('#nome').val(rows[2].innerHTML);
		    $('#sobrenome').val(rows[3].innerHTML);
		    $('#avatar').val(rows[4].innerHTML);
		    $('#caminhoId').show();
		} );

		return seq;
	}


	function save() {
		var d=new Date();
		var seq=$('#seq').text();
		if ( isNaN(seq) ) { seq=0; }
		var key=caminhoId+"_"+seq;
		var object={
			"nome":$("#nome").val(),
			"sobrenome": $("#sobrenome").val(),
			"avatar": $("#avatar").val()
		}
		
		localStorage.setItem(key, JSON.stringify(object));
		alert("Dados foi salvo com sucesso!");
	}

	function restoreItems() {
		var i=0;
		var index=1;
		var previous=JSON.parse(localStorage.getItem(caminhoId+"_0"));
		var prevIndex=0;
		while ( i<2 ) {
			var key=caminhoId+"_"+index;
			var object=JSON.parse(localStorage.getItem(key));
			
			


			if ( previous==null && object==null ) {
				i=i+1;
				prevIndex=index;
				index=index+1;
				continue;
			}
			if ( previous==null && object!=null ) {
				
				localStorage.setItem(caminhoId+"_"+prevIndex, JSON.stringify(object));
				localStorage.setItem(key, null);
				prevIndex=index;
				index=index+1;
				continue;
			}
			previous=object;
			prevIndex=index;
			index=index+1;
		}
	};


	function verifyLocalStorageCapability() {
		if (!window.localStorage) {
	    	return false;
		}
		return true;
	}