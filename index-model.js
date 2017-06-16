$(document).ready(function() {
	var modalContainer = $("#cart");
	var cartModal = $("#cartModal");
	var dialog = $('#dialog');
	
	var viewModel = kendo.observable({
		isVisible: true,
		increaseQuantity: function(e) {
			this.updateCartSetVars(e);
			
			// perform validations
			if( currentAvailability == "false" ) { 
				dialog.kendoDialog({
					width: "400px",
					title: "Product Not Available",
					closable: false,
					modal: false,
					content: "<p>Looks like <strong>" + currentProductName + "</strong> it´s not for sale right now.<p>",
					actions: [{ text: 'Ok, thanks.', primary: true }],
					close: onClose
				});	
				dialog.data("kendoDialog").open();
				
				return currentQuantity; 
			}
			if( currentStock == currentQuantity ) { 
				dialog.kendoDialog({
					width: "400px",
					title: "Maximum Stock Request Reached",
					closable: false,
					modal: false,
					content: "<p>Looks like <strong>" + currentProductName + "</strong> has no more units available.<p>",
					actions: [{ text: 'Ok, thanks.', primary: true }],
					close: onClose
				});	
				dialog.data("kendoDialog").open();
				
				return currentQuantity; 
			}
			
			// all went well
			currentQuantity++;
			var newStock = currentStock - currentQuantity;
			var newPrice = currentProductPrice * currentQuantity;
			this.renderNewQuantities(currentProductId, currentQuantity, newStock, newPrice);
			
		},
		decreaseQuantity: function(e) {
			this.updateCartSetVars(e);
			
			// perform validations
			if( currentAvailability == "false" ) {
				dialog.kendoDialog({
					width: "400px",
					title: "Product Not Available",
					closable: false,
					modal: false,
					content: "<p>Looks like <strong>" + currentProductName + "</strong> it´s not for sale right now.<p>",
					actions: [
						{ text: 'Ok, thanks.', primary: true }
					],
					close: onClose
				});	
				dialog.data("kendoDialog").open();
				
				return currentQuantity; 
			}
			if(currentQuantity == 0 ) { 
				return currentQuantity; 
			}
			
			// all went well
			currentQuantity--;			
			var newStock = currentStock - currentQuantity;
			var newPrice = currentProductPrice * currentQuantity;			
			this.renderNewQuantities(currentProductId, currentQuantity, newStock, newPrice);
		},
		updateCart: function(e) {
			this.updateCartSetVars(e);
			
			var grid = $("#grid").data("kendoGrid");
			
			var raw = grid.dataSource.data();
			var length = raw.length;
			
			var item, i;
			for(i=length-1; i>=0; i--){
				item = raw[i];
				// if an instance of the same product id exists..
				if (item.Id == currentProductId){
					grid.dataSource.remove(item);
				}
				// if the amount is equal to zero it means to remove it..
				if (item.Id == currentProductId && currentQuantity < 1){
					grid.dataSource.remove(item);
					this.hide();
				}
			}
			if(currentQuantity > 0 ) {
				// add to datasource..
				grid.dataSource.add({
					"Id": currentProductId, 
					"Name": currentProductName, 
					"Category": currentProductCategory, 
					"Price": currentProductPrice*currentQuantity, 
					"Quantity": currentQuantity
				});
				grid.dataSource.sync();
				
				// tell user..
				dialog.kendoDialog({
					width: "400px",
					title: "Product Added",
					closable: false,
					modal: false,
					content: "<p><strong>" + currentProductName + "</strong> has been added to your cart.<p>",
					actions: [
						{ text: 'Ok, thanks.', primary: true }
					],
					close: onClose
				});	
				dialog.data("kendoDialog").open();
			} else {
				// invalid amount..
				dialog.kendoDialog({
					width: "400px",
					title: "Product not Added",
					closable: false,
					modal: false,
					content: "<p><strong>Invalid Quantity, please select a valid amount.<p>",
					actions: [
						{ text: 'Ok.', primary: true }
					],
					close: onClose
				});	
				dialog.data("kendoDialog").open();
			}
		},
		clearCart: function(e) {
			var grid = $("#grid").data("kendoGrid");
			
			$("#confirm").kendoConfirm({
				content: "Empty your shopping cart?",
				messages:{ okText: "OK" }
			}).data("kendoConfirm").result.done(function(){ 
				grid.dataSource.data([]);
				$("#example").find("input:text").val('');
			});
			
			// recreate an instance of the confirm div since it has been removed by kendo on previous confirmation
			$("#example").append('<div id="confirm"></div>');
		},
		updateCartSetVars: function(e) {
			// set variables to avoid recursiveness
			currentProductId = $(e.target).data('id');
			currentProductName = $(e.target).data('name');
			currentProductCategory = $(e.target).data('category');
			currentStock = $(e.target).data('stock');
			currentProductPrice = $(e.target).data('price');
			currentAvailability = $(e.target).data('availability');
			currentQuantity = $('#' + $(e.target).data('id') + "-quantity").val();
		},
		renderNewQuantities: function(currentProductId, currentQuantity, newStock, newPrice) {
			$('#' + currentProductId + "-quantity").val(currentQuantity);
			$('#' + currentProductId + "-stock").html(newStock);
			$('#' + currentProductId + "-price").html(kendo.toString(newPrice, "c"));
		},
		products: new kendo.data.DataSource({
			schema: {
				model: {
					Id: "Id",
					Name: "Name",
					Category: "Category",
					Price: "Price",
					Stock: "Stock",
					Availability: "Availability"
				}
			},
			batch: true,	
			selectable: "multiple",
			transport: {
				read: {
					url: "data-service.json",
					dataType: "json"
				}
			}
		})
	});
	
	// cart modal 
	cartModal.click(function() {
		modalContainer.data("kendoWindow").open();
		cartModal.fadeOut();
	});
	function onClose() {
		cartModal.fadeIn();
	}

	modalContainer.kendoWindow({
		width: "600px",
		title: "Your shopping cart",
		visible: false,
		actions: [
			"Pin",
			"Minimize",
			"Maximize",
			"Close"
		],
		close: onClose
	}).data("kendoWindow").center();

	$("#grid").kendoGrid({
	dataSource: {
	  data: [],
	  schema: {
		model: {
		  fields: {
			Id: { type: "string" },
			Name: { type: "string" },
			Category: { type: "string" },
			Price: { type: "number" },
			Quantity: { type: "number" }
		  }
		}
	  }
	},
	dataBound: function (e) {
		var grandTotal=0;
		var grid = $("#grid").data("kendoGrid");
		var gridData = grid.dataSource.view();
		for (var i = 0; i < gridData.length; i++) {
			grandTotal+=gridData[i].Price;
		}
		e.preventDefault();
		$("#gridTotals").html('<span class="grand-total">Grand Total: ' + kendo.toString(grandTotal, "c") + '</span>');
	},
	columns: [
	  { field: "Id", title: "ID" },
	  { field: "Name", title: "Name" },
	  { field: "Category", title: "Category" },
	  { field: "Price", title: "Price", format: "{0:c}" },
	  { field: "Quantity", title: "Quantity" }
	]
	});
	
	kendo.bind($("#example"), viewModel);
});