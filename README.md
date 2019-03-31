# Workflow start application

Clone this repository in SAP WebIDE and deploy it to cloud platform. 
Also add the app to the default site on the cloud platform portal, so that it can be 
started from the launchpad.

### How does it work

All the interesting parts are in `controller/App.controller.js`, where you can see the
API calls to the workflow:

```
_startInstance: function (token) {
	$.ajax({
		url: "/bpmworkflowruntime/rest/v1/workflow-instances",
		method: "POST",
		async: false,
		contentType: "application/json",
		headers: {
			"X-CSRF-Token": token
		},
		data: JSON.stringify({
			definitionId: "workflow",
			context: {
				Vendor: this.getView().getModel().getData().vendor,
				Requestor: this._getCurrentPerson()
			}
		}),
		success: function (result) {
			Toast.show('Workflow started with id: ' + result.id);
			this.getView().getModel().setProperty("/vendor", this._resetVendor());
		}.bind(this)
	});
},

_fetchToken: function () {
	var token;
	$.ajax({
		url: "/bpmworkflowruntime/rest/v1/xsrf-token",
		method: "GET",
		async: false,
		headers: {
			"X-CSRF-Token": "Fetch"
		},
		success: function (result, xhr, data) {
			token = data.getResponseHeader("X-CSRF-Token");
		}
	});
	return token;
}
```
