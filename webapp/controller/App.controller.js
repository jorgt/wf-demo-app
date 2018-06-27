sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
], function(Controller, JSONModel, Toast) {
	"use strict";

	return Controller.extend("demo.app.controller.App", {
		onInit: function() {
			this.getView().setModel(new JSONModel({
				vendor: this._resetVendor(),
				submitEnabled: false
			}));
		},

		onSubmitButtonPress: function() {
			this._startInstance(this._fetchToken());
		},

		onVerifyVendor: function() {
			var fields = this.getView().byId('vendorInputForm').getContent();
			this.getView().getModel().setProperty('/submitEnabled', true);

			for (var i = 0; i < fields.length; i++) {
				if (fields[i].getValue && fields[i].getValue().trim() === '') {
					this.getView().getModel().setProperty('/submitEnabled', false);
				}
			}
		},

		startWorkflow: function() {
			this._startInstance(this._fetchToken());
		},

		_startInstance: function(token) {
			$.ajax({
				url: "/bpmworkflowruntime/rest/v1/workflow-instances",
				method: "POST",
				async: false,
				contentType: "application/json",
				headers: {
					"X-CSRF-Token": token
				},
				data: JSON.stringify({
					definitionId: "testworkflowpoc",
					context: {
						Vendor: this.getView().getModel().getData().vendor
					}
				}),
				success: function(result) {
					Toast.show('Workflow started with id: ' + result.id);
					model.setProperty("/Vendor", this._resetVendor());
				}
			});
		},

		_fetchToken: function() {
			var token;
			$.ajax({
				url: "/bpmworkflowruntime/rest/v1/xsrf-token",
				method: "GET",
				async: false,
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				success: function(result, xhr, data) {
					token = data.getResponseHeader("X-CSRF-Token");
				}
			});
			return token;
		},

		_resetVendor: function() {
			var tempId = (Math.round(Math.random() * Number.MAX_SAFE_INTEGER)).toString(16);
		
			return {
					TempId: tempId,
					Name: '',
					Street: '',
					HouseNumber: '',
					PostCode: '',
					City: '',
					Country: 'Australia'
				}
		}
	});
});